<?php

namespace App\Service;

use Doctrine\ODM\MongoDB\DocumentManager;
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
     * @param string $dataBaseName
     * @param string $dataBasePassword
     * @param string $zipFilePath
     * @return bool
     * @throws \MongoException
     */
    public function databaseExport($dataBaseName, $dataBasePassword, $zipFilePath)
    {
        $targetDirPath = dirname($zipFilePath);

        self::cleanDirectory($targetDirPath);

        /** @var \MongoDB $dataBase */
        $dataBase = $this->getClient()->selectDatabase($dataBaseName);

        $collectionNames = $dataBase->getCollectionNames();
        foreach ($collectionNames as $collectionName) {
            $outputFilePath = $targetDirPath . DIRECTORY_SEPARATOR . "{$collectionName}.json";

            $cmd = "mongoexport --db \"{$dataBaseName}\"";
            $cmd .= ' \\' . PHP_EOL . "--collection \"{$collectionName}\" --type \"json\"";
            $cmd .= ' \\' . PHP_EOL . "--out \"{$outputFilePath}\"";
            $cmd .= ' \\' . PHP_EOL . "--jsonArray --pretty";
            $cmd .= ' \\' . PHP_EOL . "--authenticationDatabase \"admin\"";
            $cmd .= ' \\' . PHP_EOL . "--username \"{$dataBaseName}\"";
            $cmd .= ' \\' . PHP_EOL . "--password \"{$dataBasePassword}\"";
            exec($cmd);

            if (file_exists($outputFilePath)) {
                @chmod($outputFilePath, 0777);
            }
        }

        self::zipFolder($targetDirPath, $zipFilePath);

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

        return true;
    }

    /**
     * @param string $dataBaseName
     * @param string $dataBasePassword
     * @param string $collectionName
     * @param array $arrayContent
     * @param string $filePath
     * @param string $mode
     * @return bool
     */
    public function databaseImport($dataBaseName, $dataBasePassword, $collectionName, $arrayContent = [], $filePath = '', $mode = 'insert')
    {
        $cmd = "mongoimport --db \"{$dataBaseName}\"";
        $cmd .= ' \\' . PHP_EOL . "--collection \"{$collectionName}\" --type json";
        $cmd .= ' \\' . PHP_EOL . "--file \"{$filePath}\"";
        $cmd .= ' \\' . PHP_EOL . "--jsonArray";
        $cmd .= ' \\' . PHP_EOL . "--mode {$mode}";
        $cmd .= ' \\' . PHP_EOL . "--authenticationDatabase \"admin\"";
        $cmd .= ' \\' . PHP_EOL . "--username \"{$dataBaseName}\"";
        $cmd .= ' \\' . PHP_EOL . "--password \"{$dataBasePassword}\"";
        exec($cmd);

        return true;
    }

    /**
     * @return \MongoDB\Client
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

        $zip = new \ZipArchive();
        $zip->open($zipFilePath, \ZipArchive::CREATE | \ZipArchive::OVERWRITE);

        $files = new \RecursiveIteratorIterator(
            new \RecursiveDirectoryIterator($dirPath),
            \RecursiveIteratorIterator::LEAVES_ONLY
        );

        foreach ($files as $name => $file)
        {
            if (!$file->isDir())
            {
                $filePath = $file->getRealPath();
                $relativePath = substr($filePath, strlen($dirPath) + 1);
                $zip->addFile($filePath, $relativePath);
            }
        }
        $zip->close();
        return true;
    }
}
