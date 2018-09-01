<?php

namespace AppBundle\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @MongoDB\Document(collection="file",repositoryClass="AppBundle\Repository\FileDocumentRepository")
 * @MongoDB\HasLifecycleCallbacks()
 */
class FileDocument
{
    const OWNER_DOCUMENT = 'document';
    const OWNER_TEMPORARY = 'temporary';
    const OWNER_ORDER_TEMPORARY = 'order_temporary';
    const OWNER_ORDER_PRODUCT = 'order_product';

    /**
     * @MongoDB\Id(type="int", strategy="INCREMENT")
     * @Groups({"details", "list"})
     */
    protected $id;

    /**
     * @MongoDB\Field(type="string")
     * @Groups({"details", "list"})
     */
    protected $title;

    /**
     * @MongoDB\Field(type="string")
     * @Groups({"details", "list"})
     */
    protected $fileName;

    /**
     * @MongoDB\Field(type="string")
     * @Groups({"details", "list"})
     */
    protected $extension;

    /**
     * @MongoDB\Field(type="string")
     * @Groups({"details", "list"})
     */
    protected $mimeType;

    /**
     * @MongoDB\Field(type="string", nullable=true)
     * @Groups({"details"})
     */
    protected $ownerType;

    /**
     * @MongoDB\Field(type="integer")
     * @Groups({"details", "list"})
     */
    protected $size;

    /**
     * @MongoDB\Field(type="integer")
     * @Groups({"details", "list"})
     */
    protected $userId;

    /**
     * @MongoDB\Field(type="string", nullable=true)
     * @Groups({"details"})
     */
    protected $ownerId;

    /**
     * @MongoDB\Field(type="date", nullable=true)
     * @Groups({"details", "list"})
     */
    protected $createdDate;

    /**
     * @MongoDB\ReferenceOne(targetDocument="OrderContent")
     * @var ContentType
     */
    protected $orderContent;

    private $uploadRootDir = '';
    private $file;

    /**
     * Get id
     *
     * @return int $id
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set title
     *
     * @param string $title
     * @return self
     */
    public function setTitle($title)
    {
        $this->title = $title;
        return $this;
    }

    /**
     * Get title
     *
     * @return string $title
     */
    public function getTitle()
    {
        return $this->title;
    }

    /**
     * Set extension
     *
     * @param string $extension
     * @return self
     */
    public function setExtension($extension)
    {
        $this->extension = $extension;
        return $this;
    }

    /**
     * Get extension
     *
     * @return string $extension
     */
    public function getExtension()
    {
        return $this->extension;
    }

    /**
     * Set mimeType
     *
     * @param string $mimeType
     * @return self
     */
    public function setMimeType($mimeType)
    {
        $this->mimeType = $mimeType;
        return $this;
    }

    /**
     * Get mimeType
     *
     * @return string $mimeType
     */
    public function getMimeType()
    {
        return $this->mimeType;
    }

    /**
     * Set ownerType
     *
     * @param string $ownerType
     * @return self
     */
    public function setOwnerType($ownerType)
    {
        $this->ownerType = $ownerType;
        return $this;
    }

    /**
     * Get ownerType
     *
     * @return string $ownerType
     */
    public function getOwnerType()
    {
        return $this->ownerType;
    }

    /**
     * Set size
     *
     * @param integer $size
     * @return self
     */
    public function setSize($size)
    {
        $this->size = $size;
        return $this;
    }

    /**
     * Get size
     *
     * @return integer $size
     */
    public function getSize()
    {
        return $this->size;
    }

    /**
     * Set userId
     *
     * @param integer $userId
     * @return self
     */
    public function setUserId($userId)
    {
        $this->userId = $userId;
        return $this;
    }

    /**
     * Get userId
     *
     * @return integer $userId
     */
    public function getUserId()
    {
        return $this->userId;
    }

    /**
     * Set ownerId
     *
     * @param integer $ownerId
     * @return self
     */
    public function setOwnerId($ownerId)
    {
        $this->ownerId = $ownerId;
        return $this;
    }

    /**
     * Get ownerId
     *
     * @return integer $ownerId
     */
    public function getOwnerId()
    {
        return $this->ownerId;
    }

    /**
     * Set fileName
     *
     * @param string $fileName
     * @return self
     */
    public function setFileName($fileName)
    {
        $this->fileName = $fileName;
        return $this;
    }

    /**
     * Get fileName
     *
     * @return string $fileName
     */
    public function getFileName()
    {
        return $this->fileName;
    }

    /**
     * Set createdDate
     *
     * @param \DateTime $createdDate
     * @return self
     */
    public function setCreatedDate($createdDate)
    {
        $this->createdDate = $createdDate;
        return $this;
    }

    /**
     * Get createdDate
     *
     * @return \DateTime $createdDate
     */
    public function getCreatedDate()
    {
        return $this->createdDate;
    }

    /**
     * Sets file
     * @param UploadedFile|null $file
     * @return $this
     */
    public function setFile(UploadedFile $file = null)
    {
        $this->file = $file;
        return $this;
    }

    /**
     * Get file.
     *
     * @return UploadedFile
     */
    public function getFile()
    {
        return $this->file;
    }

    /**
     * @return string
     */
    public function getFullFileName()
    {
        return $this->getFileName() . '.' . $this->getExtension();
    }

    /**
     * @return $this
     */
    public function setUniqueFileName(){
        $filename = time() . '_' . uniqid(true);
        $this->setFileName($filename);
        return $this;
    }

    /**
     * @param $uploadRootDir
     * @return $this
     */
    public function setUploadRootDir($uploadRootDir)
    {
        $this->uploadRootDir = $uploadRootDir;
        return $this;
    }

    /**
     * @return string
     */
    public function getUploadRootDir()
    {
        return $this->uploadRootDir;
    }

    public function getDirBasePath()
    {
        return $this->getCreatedDate()->format('Y/m/d');
    }

    /**
     * @return bool|null|string
     */
    public function getUploadDir()
    {
        if (!$this->getCreatedDate()) {
            $this->setCreatedDate(new \DateTime());
        }
        $uploadRootDirPath = $this->getUploadRootDir();
        if (!$uploadRootDirPath) {
            return null;
        }
        if(!is_dir($uploadRootDirPath)){
            mkdir($uploadRootDirPath);
            chmod($uploadRootDirPath, 0777);
        }
        $uploadRootDirPath = realpath($uploadRootDirPath);
        $dateArr = explode('/', $this->getDirBasePath());

        foreach ($dateArr as $num) {
            $uploadRootDirPath .= DIRECTORY_SEPARATOR . $num;
            if (!is_dir($uploadRootDirPath)) {
                mkdir($uploadRootDirPath);
                chmod($uploadRootDirPath, 0777);
            }
        }
        return $uploadRootDirPath;
    }

    /**
     * @return null|string
     */
    public function getUploadedPath()
    {
        if (!$this->getUploadDir()) {
            return null;
        }
        return $this->getUploadDir() . '/' . $this->getFullFileName();
    }

    /**
     * @MongoDB\PrePersist()
     * @MongoDB\PreUpdate()
     */
    public function preUpload()
    {
        if (null !== $this->getFile()) {
            $this
                ->setUniqueFileName()
                ->setExtension(strtolower($this->getFile()->getClientOriginalExtension()))
                ->setMimeType($this->getFile()->getMimeType())
                ->setSize($this->getFile()->getSize());

            if (!$this->getTitle()) {
                $originalName = $this->getFile()->getClientOriginalName();
                $title = mb_substr($originalName, 0, mb_strrpos($originalName, '.'));
                $this->setTitle($title);
            }
        }
    }

    /**
     * @MongoDB\PostPersist()
     * @MongoDB\PostUpdate()
     * @return bool
     */
    public function upload()
    {
        if (null === $this->getFile()) {
            return false;
        }
        if(!$this->getFileName()){
            $this
                ->setUniqueFileName()
                ->setExtension(strtolower($this->getFile()->getClientOriginalExtension()));
        }

        $uploadDirPath = $this->getUploadDir();
        if (!is_dir($uploadDirPath)) {
            return false;
        }

        $fullFileName = $this->getFullFileName();
        $this->getFile()->move($uploadDirPath, $fullFileName);

        chmod($this->getUploadedPath(), 0775);

        $this->file = null;
        return true;
    }

    /**
     * @MongoDB\PreRemove()
     * @return bool
     */
    public function removeFile()
    {
        $fileUploadedPath = $this->getUploadedPath();
        if ($fileUploadedPath && file_exists($fileUploadedPath)) {
            unlink($fileUploadedPath);
            return true;
        }
        return false;
    }

    /**
     * Set order content
     *
     * @param OrderContent $orderContent
     * @return $this
     */
    public function setOrderContent(OrderContent $orderContent)
    {
        $this->orderContent = $orderContent;
        return $this;
    }

    /**
     * Get order content
     *
     * @return ContentType
     */
    public function getOrderContent()
    {
        return $this->orderContent;
    }

    /**
     * @return array
     */
    public function toArray()
    {
        return [
            'id' => $this->getId(),
            'title' => $this->getTitle(),
            'name' => $this->getFileName(),
            'size' => $this->getSize(),
            'extension' => $this->getExtension(),
            'mimeType' => $this->getMimeType(),
            'ownerType' => $this->getOwnerType(),
            'ownerId' => $this->getOwnerId(),
            'createdDate' => $this->getCreatedDate()
        ];
    }

    /**
     * @return array
     */
    public function getRecordData()
    {
        return [
            'fileId' => $this->getId(),
            'title' => $this->getTitle(),
            'fileName' => $this->getFileName(),
            'extension' => $this->getExtension(),
            'dirPath' => $this->getDirBasePath(),
            'size' => $this->getSize()
        ];
    }
}
