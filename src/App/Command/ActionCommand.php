<?php

namespace App\Command;

use App\MainBundle\Document\Category;
use App\Service\CatalogService;
use App\Service\DataBaseUtilService;
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
                $rootPath = realpath($this->params->get('kernel.root_dir').'/../..');
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
            default:

                $io->error('Action not found.');
        }

        $time_end = microtime(true);
        $time = round($time_end - $time_start, 3);

        $io->note("The operation has been processed in time {$time} sec.");
    }
}
