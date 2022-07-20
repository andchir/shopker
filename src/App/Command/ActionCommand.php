<?php

namespace App\Command;

use App\MainBundle\Document\Category;
use App\MainBundle\Document\FileDocument;
use App\Service\CatalogService;
use App\Service\DataBaseUtilService;
use App\Service\UtilsService;
use Doctrine\ODM\MongoDB\DocumentManager;
use Doctrine\ODM\MongoDB\LockException;
use Doctrine\ODM\MongoDB\Mapping\MappingException;
use Doctrine\ODM\MongoDB\MongoDBException;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Helper\ProgressBar;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

class ActionCommand extends Command
{

    /** @var ParameterBagInterface */
    protected $params;
    /** @var DocumentManager */
    protected $dm;
    /** @var CatalogService */
    protected $catalogService;
    /** @var DataBaseUtilService */
    protected $databaseUtilService;

    public function __construct(
        ParameterBagInterface $params,
        DocumentManager $dm,
        CatalogService $catalogService,
        DataBaseUtilService $databaseUtilService
    )
    {
        parent::__construct();

        $this->params = $params;
        $this->dm = $dm;
        $this->catalogService = $catalogService;
        $this->databaseUtilService = $databaseUtilService;
    }

    protected function configure()
    {
        $this
            ->setName('app:action')
            ->setDescription('Application actions commands.')
            ->setHelp('Available actions: filters_update, db_export, db_import.')
            ->addArgument('action', InputArgument::REQUIRED, 'Action name.')
            ->addArgument('option', InputArgument::OPTIONAL, 'Action option.')
            ->addArgument('option2', InputArgument::OPTIONAL, 'Action second option.');
    }

    /**
     * @param InputInterface $input
     * @param OutputInterface $output
     * @return void
     * @throws LockException
     * @throws MappingException
     * @throws MongoDBException
     */
    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $io = new SymfonyStyle($input, $output);
        $time_start = microtime(true);

        $action = $input->getArgument('action');
        $option = $input->getArgument('option');
        $option2 = $input->getArgument('option2');

        switch ($action) {
            case 'filters_update':

                $count = 0;

                /** @var \App\Repository\CategoryRepository $categoryRepository */
                $categoryRepository = $this->dm->getRepository(Category::class);

                $categories = $categoryRepository->findAll();
                $progressBar = new ProgressBar($output, count($categories));

                foreach ($categories as $category) {
                    $this->catalogService->updateFiltersData($category);
                    $count++;
                    $progressBar->advance();
                }

                $progressBar->finish();
                $io->success('Updated filters for categories: ' . $count);

                break;
            case 'db_export':

                $mongoToolPath = $option ?: 'mongoexport';// Path for DevilBox: "docker exec devilbox_mongo_1 mongoexport"
                $rootPath = $this->params->get('kernel.project_dir');
                $zipFileName = 'export_' . date('Y-m-d') . '.zip';
                $zipFilePath = $rootPath . '/public/uploads/' . $zipFileName;
                $result = null;
                $io->writeln('Please wait...');
                try {
                    $result = $this->databaseUtilService->databaseExport($zipFilePath, $mongoToolPath);
                } catch (\Exception $e) {
                    $io->error($e->getMessage());
                    break;
                }

                if ($result) {
                    $io->success('Export completed successfully. File name: ' . basename($zipFilePath));
                }

                break;
            case 'db_import':

                $inputDirPath = $option;
                if (!$inputDirPath || !is_dir($inputDirPath)) {
                    $io->error("Directory not found.");
                    break;
                }
                $mongoToolPath = $option2 ?: 'mongoimport';// Path for DevilBox: "docker exec devilbox_mongo_1 mongoimport"
                $io->writeln('Please wait...');

                try {
                    $count = $this->databaseUtilService->databaseImportFromDir($inputDirPath, 'insert', $mongoToolPath);
                } catch (\Exception $e) {
                    $io->error($e->getMessage());
                    break;
                }

                if ($count > 0) {
                    $io->success("Import completed successfully. Imported: {$count}");
                } else {
                    $io->error("Nothing is imported.");
                }

                break;
            case 'search_images':

                list($apiKey, $customSearchId) = strpos($option, '__') !== false ? explode('__', $option) : ['', $option];
                $collectionName = $option2 ?: 'products';

                if (!$apiKey || $customSearchId) {
                    $io->info("How to use: \nbin/console app:action search_images <API_KEY>__<SEARCH_ENGINE_ID> <COLLECTION_NAME>");
                    break;
                }

                $imageFieldName = 'image';
                $imgSize = 'HUGE';// HUGE|LARGE
                $maxResults = 3;
                // Docs: https://developers.google.com/custom-search/v1/reference/rest/v1/cse/list
                $apiUrl = "https://customsearch.googleapis.com/customsearch/v1?imgSize={$imgSize}&searchType=image&cx={$customSearchId}&key={$apiKey}";
                $apiUrl .= "&imgType=photo&lr=lang_ru&num=10";

                $collection = $this->catalogService->getCollection($collectionName);
                $filesDirPath = $this->params->get('app.files_dir_path');
                if (!is_dir($filesDirPath)) {
                    mkdir($filesDirPath);
                }
                $now = new \DateTime();

                $countTotal = 0;
                $items = $collection->find([])->toArray();
                if (count($items) == 0) {
                    $io->error('Collection is empty.');
                    break;
                }

                foreach ($items as $entity) {
                    if (!empty($entity[$imageFieldName]) && !empty($entity[$imageFieldName . '__1']) && !empty($entity[$imageFieldName . '__2'])) {
                        continue;
                    }
                    try {
                        $result = file_get_contents($apiUrl . '&q=' . rawurlencode($entity['title']));
                    } catch (\Exception $e) {
                        $io->error($e->getMessage());
                        break;
                    }
                    $result = json_decode($result, true);
                    if (empty($result['items'])) {
                        continue;
                    }
                    $count = 0;
                    $resultsTotal = count($result['items']);
                    foreach ($result['items'] as $index => $image) {
                        if ($count === 0 && !empty($entity[$imageFieldName])) {
                            $count++;
                            continue;
                        }
                        if ($count === 1 && !empty($entity[$imageFieldName . '__1'])) {
                            $count++;
                            continue;
                        }
                        if ($count >= $maxResults) {
                            $io->note("Uploaded MAX images {$count}/{$resultsTotal} - {$entity['title']}.");
                            break;
                        }
                        $extension = UtilsService::getExtension($image['link']);
                        if (!$extension || !in_array($extension, ['jpg', 'jpeg', 'png'])) {
                            $io->note("Bad image extension: {$extension}.");
                            continue;
                        }

                        $fileDocument = new FileDocument();
                        $fileDocument
                            ->setUploadRootDir($filesDirPath)
                            ->setCreatedDate($now)
                            ->setOwnerType('products')
                            ->setOwnerDocId($entity['_id'])
                            ->setUserId(1)
                            ->setUniqueFileName()
                            ->setExtension($extension)
                            ->setOriginalFileName(basename($image['link']));

                        $originalName = $fileDocument->getOriginalFileName();
                        $title = mb_substr($originalName, 0, mb_strrpos($originalName, '.'));
                        $fileDocument->setTitle($title);

                        $filePath = $fileDocument->getUploadedPath();
                        try {
                            file_put_contents($filePath, file_get_contents($image['link']));
                        } catch (\Exception $e) {
                            $io->error($e->getMessage());
                            continue;
                        }

                        $fileDocument->setSize(filesize($filePath));

                        $this->dm->persist($fileDocument);
                        $this->dm->flush();

                        $imageFieldNameCur = $imageFieldName . ($count ? '__' . $count : '');
                        $entity[$imageFieldNameCur] = $fileDocument->getRecordData();
                        $collection->updateOne(['_id' => $entity['_id']], ['$set' => $entity]);

                        $count++;
                        $countTotal++;

                        $io->note("UPLOADED {$count}/{$resultsTotal} - $imageFieldNameCur - {$entity['title']}: {$image['link']}");
                    }
                }

                $io->success("TOTAL UPLOADED: {$countTotal} images.");

                break;
            default:

                $io->error('Action not found.');
        }

        $time_end = microtime(true);
        $time = round($time_end - $time_start, 3);

        $io->note("The operation has been processed in time {$time} sec.");

        return 1;
    }
}
