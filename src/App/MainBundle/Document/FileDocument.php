<?php

namespace App\MainBundle\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @MongoDB\Document(collection="file",repositoryClass="App\Repository\FileDocumentRepository")
 * @MongoDB\HasLifecycleCallbacks()
 */
class FileDocument
{
    const OWNER_CATEGORY = 'category';
    const OWNER_DOCUMENT = 'document';
    const OWNER_TEMPORARY = 'temporary';
    const OWNER_ORDER_TEMPORARY = 'order_temporary';
    const OWNER_ORDER_PRODUCT = 'order_product';

    /**
     * @MongoDB\Id(type="int", strategy="INCREMENT")
     * @Groups({"details", "list"})
     * @var int
     */
    protected $id;

    /**
     * @MongoDB\Field(type="string")
     * @Groups({"details", "list"})
     * @var string
     */
    protected $title;

    /**
     * @MongoDB\Field(type="string")
     * @Groups({"details", "list"})
     * @var string
     */
    protected $fileName;

    /**
     * @MongoDB\Field(type="string")
     * @Groups({"details", "list"})
     * @var string
     */
    protected $originalFileName;

    /**
     * @MongoDB\Field(type="string")
     * @Groups({"details", "list"})
     * @var string
     */
    protected $extension;

    /**
     * @MongoDB\Field(type="string")
     * @Groups({"details", "list"})
     * @var string
     */
    protected $mimeType;

    /**
     * @MongoDB\Field(type="integer")
     * @Groups({"details", "list"})
     * @var int
     */
    protected $size;

    /**
     * @MongoDB\Field(type="integer")
     * @Groups({"details", "list"})
     * @var int
     */
    protected $downloads;

    /**
     * @MongoDB\Field(type="integer")
     * @Groups({"details", "list"})
     * @var int
     */
    protected $userId;

    /**
     * @MongoDB\Field(type="string")
     * @Groups({"details"})
     * @var string
     */
    protected $ownerType;

    /**
     * @MongoDB\Field(type="string")
     * @Groups({"details"})
     * @var string
     */
    protected $ownerId;

    /**
     * @MongoDB\Field(type="int")
     * @Groups({"details"})
     * @var string
     */
    protected $ownerDocId;

    /**
     * @MongoDB\Field(type="date")
     * @Groups({"details", "list"})
     * @var \DateTime
     */
    protected $createdDate;

    /**
     * @MongoDB\ReferenceOne(targetDocument="App\MainBundle\Document\Order", storeAs="id")
     * @var Order
     */
    protected $order;

    /** @var string */
    private $uploadRootDir = '';
    /** @var  UploadedFile */
    private $file;

    /**
     * Get id
     *
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set title
     *
     * @param string $title
     * @return $this
     */
    public function setTitle($title)
    {
        $this->title = $title;
        return $this;
    }

    /**
     * Get title
     *
     * @return string
     */
    public function getTitle()
    {
        return $this->title;
    }

    /**
     * Set extension
     *
     * @param string $extension
     * @return $this
     */
    public function setExtension($extension)
    {
        $this->extension = $extension;
        return $this;
    }

    /**
     * Get extension
     *
     * @return string
     */
    public function getExtension()
    {
        return $this->extension;
    }

    /**
     * Set mimeType
     *
     * @param string $mimeType
     * @return $this
     */
    public function setMimeType($mimeType)
    {
        $this->mimeType = $mimeType;
        return $this;
    }

    /**
     * Get mimeType
     *
     * @return string
     */
    public function getMimeType()
    {
        return $this->mimeType;
    }

    /**
     * Set ownerType
     *
     * @param string $ownerType
     * @return $this
     */
    public function setOwnerType($ownerType)
    {
        $this->ownerType = $ownerType;
        return $this;
    }

    /**
     * Get ownerType
     *
     * @return string
     */
    public function getOwnerType()
    {
        return $this->ownerType;
    }

    /**
     * Set size
     *
     * @param integer $size
     * @return $this
     */
    public function setSize($size)
    {
        $this->size = $size;
        return $this;
    }

    /**
     * Get size
     *
     * @return integer
     */
    public function getSize()
    {
        return $this->size;
    }

    /**
     * Set downloads
     *
     * @param $downloads
     * @return $this
     */
    public function setDownloads($downloads)
    {
        $this->downloads = $downloads;
        return $this;
    }

    /**
     * Get downloads
     *
     * @return integer
     */
    public function getDownloads()
    {
        return $this->downloads;
    }

    /**
     * Downloads number increment
     *
     * @param int $number
     * @return $this
     */
    public function incrementDownloads($number = 1)
    {
        if (!$this->downloads) {
            $this->downloads = 0;
        }
        $this->downloads += $number;
        return $this;
    }

    /**
     * Set userId
     *
     * @param integer $userId
     * @return $this
     */
    public function setUserId($userId)
    {
        $this->userId = $userId;
        return $this;
    }

    /**
     * Get userId
     *
     * @return integer
     */
    public function getUserId()
    {
        return $this->userId;
    }

    /**
     * Set ownerId
     *
     * @param string $ownerId
     * @return $this
     */
    public function setOwnerId($ownerId)
    {
        $this->ownerId = $ownerId;
        return $this;
    }

    /**
     * Get ownerId
     *
     * @return string
     */
    public function getOwnerId()
    {
        return $this->ownerId;
    }

    /**
     * Set ownerDocId
     *
     * @param int $ownerDocId
     * @return $this
     */
    public function setOwnerDocId($ownerDocId)
    {
        $this->ownerDocId = $ownerDocId;
        return $this;
    }

    /**
     * Get ownerDocId
     *
     * @return int
     */
    public function getOwnerDocId()
    {
        return $this->ownerDocId;
    }

    /**
     * Set fileName
     *
     * @param string $fileName
     * @return $this
     */
    public function setFileName($fileName)
    {
        $this->fileName = $fileName;
        return $this;
    }

    /**
     * Get fileName
     *
     * @return string
     */
    public function getFileName()
    {
        return $this->fileName;
    }

    /**
     * Set originalFileName
     *
     * @param string $originalFileName
     * @return $this
     */
    public function setOriginalFileName($originalFileName)
    {
        $this->originalFileName = $originalFileName;
        return $this;
    }

    /**
     * Get originalFileName
     *
     * @return string
     */
    public function getOriginalFileName()
    {
        return $this->originalFileName;
    }

    /**
     * Set createdDate
     *
     * @param \DateTime $createdDate
     * @return $this
     */
    public function setCreatedDate($createdDate)
    {
        $this->createdDate = $createdDate;
        return $this;
    }

    /**
     * Get createdDate
     *
     * @return \DateTime
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
            if (!$this->getOriginalFileName()) {
                $this->setOriginalFileName($this->getFile()->getClientOriginalName());
            }
        }
        $filePath = $this->getUploadedPath();
        if ($filePath && file_exists($filePath)) {
            $this->setSize(filesize($filePath));
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
     * Set order
     *
     * @param Order $order
     * @return $this
     */
    public function setOrder(Order $order)
    {
        $this->order = $order;
        return $this;
    }

    /**
     * Get order
     *
     * @return Order
     */
    public function getOrder()
    {
        return $this->order;
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
