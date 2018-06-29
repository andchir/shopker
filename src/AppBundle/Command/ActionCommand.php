<?php

namespace AppBundle\Command;

use AppBundle\Controller\Admin\ProductController;
use AppBundle\Document\Category;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;

class ActionCommand extends ContainerAwareCommand
{
    protected function configure()
    {
        $this
            ->setName('app:action')
            ->setDescription('Application actions commands.')
            ->setHelp('Migrations to update database content.')
            ->addArgument('action', InputArgument::REQUIRED, 'Action name.')
            ->addArgument('option', InputArgument::OPTIONAL, 'Action option.');
    }

    /**
     * @param InputInterface $input
     * @param OutputInterface $output
     */
    protected function execute(InputInterface $input, OutputInterface $output)
    {

        $action = $input->getArgument('action');
        $option = $input->getArgument('option');

        switch ($action) {
            case 'update_filters':

                $count = 0;

                $productController = new ProductController();
                $productController->setContainer($this->getContainer());

                /** @var \AppBundle\Repository\CategoryRepository $categoryRepository */
                $categoryRepository = $this->getContainer()->get('doctrine_mongodb')
                    ->getManager()
                    ->getRepository(Category::class);

                $categories = $categoryRepository->findAll();
                foreach ($categories as $category) {
                    $productController->updateFiltersData($category);
                    $count++;
                }

                $output->writeln('Updated filters for categories: ' . $count);

                break;
        }

    }
}

