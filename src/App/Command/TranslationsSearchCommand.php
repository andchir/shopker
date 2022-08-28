<?php

namespace App\Command;

use App\Service\CatalogService;
use App\Service\DataBaseUtilService;
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

class TranslationsSearchCommand extends Command
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
            ->setName('app:translations_search')
            ->setDescription('Search for strings for translation in templates.')
            ->setHelp('USAGE: app:translations_search <language> <theme>')
            ->addArgument('language', InputArgument::REQUIRED, 'Language')
            ->addArgument('theme', InputArgument::REQUIRED, 'Templates theme name');
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



        $time_end = microtime(true);
        $time = round($time_end - $time_start, 3);

        $io->note("The operation has been processed in time {$time} sec.");

        return 1;
    }
}
