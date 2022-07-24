<?php

namespace App\Command;

use App\MainBundle\Document\FileDocument;
use App\Service\CatalogService;
use App\Service\DataBaseUtilService;
use App\Service\UtilsService;
use Doctrine\ODM\MongoDB\DocumentManager;
use Doctrine\ODM\MongoDB\LockException;
use Doctrine\ODM\MongoDB\Mapping\MappingException;
use Doctrine\ODM\MongoDB\MongoDBException;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

class ImagesSearchCommand extends Command
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
            ->setName('app:images_search')
            ->setDescription('Search and upload images for products using Google.')
            ->setHelp('USAGE: app:images_search <api_key> <custom_search_id> [<collection> [<max_count>]]')
            ->addArgument('api_key', InputArgument::REQUIRED, 'API Key')
            ->addArgument('custom_search_id', InputArgument::REQUIRED, 'Custom Search engine ID')
            ->addArgument('collection', InputArgument::OPTIONAL, 'Collection name', 'products')
            ->addArgument('max_count', InputArgument::OPTIONAL, 'Max images', 5);
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

        $apiKey = $input->getArgument('api_key');
        $customSearchId = $input->getArgument('custom_search_id');
        $collectionName = $input->getArgument('collection');
        $maxResults = $input->getArgument('max_count');

        // Docs: https://developers.google.com/custom-search/v1/reference/rest/v1/cse/list
        $imageFieldName = 'image';
        $imgSize = 'HUGE';// HUGE|LARGE
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
            return 0;
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

        $time_end = microtime(true);
        $time = round($time_end - $time_start, 3);

        $io->note("The operation has been processed in time {$time} sec.");

        return 1;
    }
}
