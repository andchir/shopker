<?php

namespace App\Service;

use App\MainBundle\Document\Setting;
use Composer\Json\JsonFile;
use Composer\Repository\InstalledFilesystemRepository;
use Symfony\Component\Console\Application;
use Symfony\Component\Console\Input\ArrayInput;
use Symfony\Component\Console\Output\BufferedOutput;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpKernel\KernelInterface;
use Symfony\Component\Yaml\Yaml;
use Symfony\Component\Yaml\Exception\ParseException;

class ComposerService
{

    /** @var ContainerInterface */
    protected $container;

    /** @param ContainerInterface $container */
    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
    }

    /**
     * @param string $type
     * @return array
     */
    public function getPackagesList($type = 'library')
    {
        $rootPath = realpath($this->container->getParameter('kernel.root_dir').'/../..');
        $vendorDir = $rootPath . DIRECTORY_SEPARATOR . 'vendor';
        $repoJsonFile = new JsonFile($vendorDir . '/composer/installed.json');
        if (!$repoJsonFile->exists()) {
            return [];
        }
        $composerRepository = new InstalledFilesystemRepository($repoJsonFile);

        $packages = [];
        foreach ($composerRepository->getPackages() as $package) {
            if ($package->getType() !== $type) {
                continue;
            }
            $packages[] = [
                'name' => $package->getName(),
                'version' => $package->getVersion(),
                'prettyVersion' => $package->getPrettyVersion()
            ];
        }

        usort($packages, function($a, $b) {
            return $a['name'] <=> $b['name'];
        });

        return $packages;
    }

}
