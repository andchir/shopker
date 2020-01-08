<?php

namespace App\Service;

use Doctrine\ODM\MongoDB\DocumentManager;
use MongoDB\Client;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

class DataBaseUtilService
{

    /** @var ParameterBagInterface */
    protected $params;
    /** @var DocumentManager */
    protected $dm;

    public function __construct(
        ParameterBagInterface $params,
        DocumentManager $dm
    )
    {
        $this->params = $params;
        $this->dm = $dm;
    }

    /**
     * @param string $zipFilePath
     * @param string $mongoExportToolPath
     * @return bool
     * @throws \Exception
     */
    public function databaseExport($zipFilePath, $mongoExportToolPath = 'mongoexport')
    {
        $dataBasePassword = $this->params->get('mongodb_password');
        $dataBaseName = $this->params->get('mongodb_database');
        $targetDirPath = dirname($zipFilePath) . DIRECTORY_SEPARATOR . pathinfo($zipFilePath, PATHINFO_FILENAME);

        if (strpos(exec($mongoExportToolPath . " 2>&1"), 'mongoexport --help') === false) {
            throw new \Exception('mongoexport tool not found.');
        }
        if (!is_dir($targetDirPath)) {
            mkdir($targetDirPath);
        }

        self::cleanDirectory($targetDirPath);

        /** @var \MongoDB\Database $dataBase */
        $dataBase = $this->getClient()->selectDatabase($dataBaseName);

        $collections = $dataBase->listCollections();

        foreach ($collections as $collection) {
            $outputFilePath = $targetDirPath . DIRECTORY_SEPARATOR . "{$collection->getName()}.json";

            $cmd = "{$mongoExportToolPath} --db {$dataBaseName}";
            $cmd .= ' \\' . PHP_EOL . "--collection {$collection->getName()} --type json";
            $cmd .= ' \\' . PHP_EOL . "--jsonArray --pretty";
            if ($dataBasePassword) {
                $cmd .= ' \\' . PHP_EOL . "--authenticationDatabase admin";
                $cmd .= ' \\' . PHP_EOL . "--username \"{$dataBaseName}\"";
                $cmd .= ' \\' . PHP_EOL . "--password \"{$dataBasePassword}\"";
            }
            // $cmd .= ' \\' . PHP_EOL . "--out {$outputFilePath}";
            $cmd .= " --quiet > {$outputFilePath}";

            exec($cmd . ' 2>&1');
        }

        if (!self::zipFolder($targetDirPath, $zipFilePath)) {
            throw new \Exception('Data is empty.');
        }

        // Delete temporary files
        $dir = new \DirectoryIterator($targetDirPath);
        foreach ($dir as $fileinfo) {
            if (!$fileinfo->isDot()) {
                if (is_file($fileinfo->getPathname())) {
                    if ($fileinfo->getExtension() !== 'zip') {
                        unlink($fileinfo->getPathname());
                    }
                }
            }
        }
        rmdir($targetDirPath);

        return true;
    }

    /**
     * @param string $collectionName
     * @param string $filePath
     * @param string $mode
     * @param string $mongoImportToolPath
     * @return bool
     * @throws \Exception
     */
    public function databaseImport($collectionName, $filePath, $mode = 'insert', $mongoImportToolPath = 'mongoimport')
    {
        $dataBasePassword = $this->params->get('mongodb_password');
        $dataBaseName = $this->params->get('mongodb_database');

        if (strpos(exec($mongoImportToolPath . " 2>&1"), 'mongoimport --help') === false) {
            throw new \Exception('mongoimport tool not found.');
        }

        $cmd = "{$mongoImportToolPath} --db \"{$dataBaseName}\"";
        $cmd .= ' \\' . PHP_EOL . "--collection \"{$collectionName}\" --type json";
        $cmd .= ' \\' . PHP_EOL . "--file \"{$filePath}\"";
        $cmd .= ' \\' . PHP_EOL . "--jsonArray";
        $cmd .= ' \\' . PHP_EOL . "--mode {$mode}";
        if ($dataBasePassword) {
            $cmd .= ' \\' . PHP_EOL . "--authenticationDatabase \"admin\"";
            $cmd .= ' \\' . PHP_EOL . "--username \"{$dataBaseName}\"";
            $cmd .= ' \\' . PHP_EOL . "--password \"{$dataBasePassword}\"";
        }
        exec($cmd . ' 2>&1');

        return true;
    }

    /**
     * @param string $dirPath
     * @param string $mode
     * @param string $mongoImportToolPath
     * @return bool
     * @throws \Exception
     */
    public function databaseImportFromDir($dirPath, $mode = 'insert', $mongoImportToolPath = 'mongoimport')
    {
        $count = 0;

        $dir = new \DirectoryIterator($dirPath);
        foreach ($dir as $fileinfo) {
            if (!$fileinfo->isDot() && $fileinfo->isFile()) {
                $this->databaseImport(
                    pathinfo($fileinfo->getPathname(), PATHINFO_FILENAME),
                    $fileinfo->getPathname(),
                    $mode,
                    $mongoImportToolPath
                );
                $count++;
            }
        }

        return $count;
    }

    /**
     * @return Client
     */
    public function getClient()
    {
        return $this->dm->getClient();
    }

    /**
     * @param $dirPath
     */
    public static function cleanDirectory($dirPath)
    {
        if (!is_dir($dirPath)) {
            return;
        }
        $dir = new \DirectoryIterator($dirPath);
        foreach ($dir as $fileinfo) {
            if (!$fileinfo->isDot()) {
                if (is_file($fileinfo->getPathname())) {
                    unlink($fileinfo->getPathname());
                }
            }
        }
    }

    /**
     * @param $dirPath
     * @param $zipFilePath
     * @return bool
     */
    public static function zipFolder($dirPath, $zipFilePath)
    {
        if (!is_dir($dirPath)) {
            return false;
        }

        $files = new \RecursiveIteratorIterator(
            new \RecursiveDirectoryIterator($dirPath),
            \RecursiveIteratorIterator::LEAVES_ONLY
        );
        if (count(iterator_to_array($files)) === 2) {
            return false;
        }
        $zip = new \ZipArchive();
        $zip->open($zipFilePath, \ZipArchive::CREATE | \ZipArchive::OVERWRITE);

        foreach ($files as $name => $file)
        {
            if (!$file->isDir())
            {
                $filePath = $file->getRealPath();
                $relativePath = substr($filePath, strlen($dirPath) + 1);
                $zip->addFile($filePath, $relativePath);
            }
        }
        return $zip->close();
    }
}
