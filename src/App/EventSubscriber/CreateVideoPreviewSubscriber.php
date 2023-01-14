<?php

namespace App\EventSubscriber;

use App\Events;
use App\MainBundle\Document\FileDocument;
use App\Service\UtilsService;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\EventDispatcher\GenericEvent;

class CreateVideoPreviewSubscriber implements EventSubscriberInterface
{
    /** @var ParameterBagInterface */
    protected $params;

    public function __construct(ContainerInterface $container, ParameterBagInterface $params) {
        $this->params = $params;
    }

    public static function getSubscribedEvents()
    {
        return [
            Events::FILE_AFTER_CREATED => 'onFileAfterCreated'
        ];
    }

    /**
     * @param GenericEvent $event
     * @return bool|void
     */
    public function onFileAfterCreated(GenericEvent $event)
    {
        $ffmpegPath = $this->params->has('app.ffmpeg_path') ? $this->params->get('app.ffmpeg_path') : '';
        /** @var FileDocument $fileDocument */
        $fileDocument = $event->getSubject();
        if (strpos($fileDocument->getMimeType(), 'video/') === false || !$ffmpegPath) {
            return true;
        }

        $filesDirPath = $this->params->get('app.files_dir_path');
        $fileDocument->setUploadRootDir($filesDirPath);
        $filePath = $fileDocument->getUploadedPath();

        $ext = UtilsService::getExtension($filePath);
        $baseName = basename($filePath);
        $imageFileName = str_replace('.' . $ext, '_video_preview.jpg', $baseName);

        if (function_exists('shell_exec')) {
            $frameImageOutputPath = dirname($filePath) . DIRECTORY_SEPARATOR . $imageFileName;
            $cmd = sprintf("%s -i \"%s\" -ss %s \\\n-vframes 1 -pix_fmt yuvj422p \\\n-y \"%s\" 2>&1",
                $ffmpegPath, $filePath, 1, $frameImageOutputPath);
            shell_exec($cmd);
        }
        return true;
    }
}
