<?php

namespace AppBundle\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;
use Symfony\Component\Translation\TranslatorInterface;
use Symfony\Component\Validator\Constraints as Assert;
use Doctrine\Bundle\MongoDBBundle\Validator\Constraints\Unique as MongoDBUnique;
use Symfony\Component\Security\Core\User\AdvancedUserInterface;

/**
 * @MongoDB\Document(collection="user", repositoryClass="AppBundle\Repository\UserRepository")
 * @MongoDBUnique(fields="email")
 * @MongoDB\HasLifecycleCallbacks()
 */
class User implements AdvancedUserInterface, \Serializable
{
    /**
     * @MongoDB\Id(type="int", strategy="INCREMENT")
     */
    protected $id;

    /**
     * @MongoDB\Field(type="string", nullable=true)
     */
    private $username;

    /**
     * @MongoDB\Field(type="string")
     * @Assert\NotBlank()
     * @Assert\Email()
     */
    protected $email;

    /**
     * @MongoDB\Field(type="string", nullable=true)
     */
    protected $fullName;

    /**
     * @MongoDB\Field(type="string", nullable=true)
     */
    protected $phone;

    /**
     * @MongoDB\Field(type="collection", nullable=true)
     */
    protected $options;

    /**
     * @MongoDB\Field(type="date", nullable=true)
     */
    protected $createdDate;

    /**
     * @MongoDB\Field(type="date", nullable=true)
     */
    protected $updatedDate;

    /**
     * @MongoDB\Field(type="string")
     * @Assert\NotBlank()
     */
    protected $password;

    /**
     * @MongoDB\Field(type="string", nullable=true)
     */
    protected $newPassword;

    /**
     * @MongoDB\Field(type="string", nullable=true)
     */
    protected $secretCode;

    /**
     * @MongoDB\Field(type="string")
     */
    private $salt;// Not used

    /**
     * @MongoDB\Field(type="boolean")
     */
    protected $isActive;

    /**
     * @MongoDB\Field(type="collection")
     */
    protected $roles;

    public function __construct()
    {
        $this->isActive = true;
    }

    /**
     * @MongoDB\PrePersist()
     */
    public function prePersist()
    {
        $this->createdDate = new \DateTime();
        $this->updatedDate = new \DateTime();
    }

    /**
     * @MongoDB\PreUpdate()
     */
    public function preUpdate()
    {
        $this->updatedDate = new \DateTime();
    }

    public function getId()
    {
        return $this->id;
    }

    /**
     * @return string
     */
    public function getEmail()
    {
        return $this->email;
    }

    /**
     * @param $email
     * @return $this
     */
    public function setEmail($email)
    {
        $this->email = $email;
        return $this;
    }

    /**
     * @return string
     */
    public function getPassword()
    {
        return $this->password;
    }

    /**
     * @param $password
     * @return $this
     */
    public function setPassword($password)
    {
        $this->password = $password;
        return $this;
    }

    /**
     * @param bool $addDefault
     * @return array
     */
    public function getRoles($addDefault = true)
    {
        $roles = $this->roles ? $this->roles : [];
        if( $addDefault ){
            $roles[] = 'ROLE_USER';
        }
        return array_unique($roles);
    }

    /**
     * @param array $roles
     * @return User
     */
    public function setRoles(array $roles)
    {
        $this->roles = array_unique(array_values($roles));
        return $this;
    }

    public function eraseCredentials()
    {
        //$this->setPassword(null);
    }

    public function isAccountNonExpired()
    {
        return true;
    }

    public function isAccountNonLocked()
    {
        return true;
    }

    public function isCredentialsNonExpired()
    {
        return true;
    }

    public function isEnabled()
    {
        return $this->isActive;
    }

    /** @see \Serializable::serialize() */
    public function serialize()
    {
        return serialize(array(
            $this->id,
            $this->email,
            $this->password,
            $this->isActive,
            // see section on salt below
            // $this->salt,
        ));
    }

    /** @see \Serializable::unserialize() */
    public function unserialize($serialized)
    {
        list (
            $this->id,
            $this->email,
            $this->password,
            $this->isActive,
            // see section on salt below
            // $this->salt
            ) = unserialize($serialized);
    }

    /**
     * Set isActive
     *
     * @param boolean $isActive
     * @return self
     */
    public function setIsActive($isActive)
    {
        $this->isActive = $isActive;
        return $this;
    }

    /**
     * Get isActive
     *
     * @return boolean $isActive
     */
    public function getIsActive()
    {
        return $this->isActive;
    }

    /**
     * Set fullName
     *
     * @param string $fullName
     * @return self
     */
    public function setFullName($fullName)
    {
        $this->fullName = $fullName;
        return $this;
    }

    /**
     * Get fullName
     *
     * @return string $fullName
     */
    public function getFullName()
    {
        return $this->fullName;
    }

    /**
     * Set username
     *
     * @param string $username
     * @return self
     */
    public function setUsername($username)
    {
        $this->username = $username;
        return $this;
    }

    /**
     * @return string
     */
    public function getUsername()
    {
        return $this->email;
    }

    /**
     * Set salt
     *
     * @param string $salt
     * @return self
     */
    public function setSalt($salt)
    {
        $this->salt = $salt;
        return $this;
    }

    /**
     * @return null
     */
    public function getSalt()
    {
        return null;// Not used
    }

    /**
     * Set newPassword
     *
     * @param string $newPassword
     * @return $this
     */
    public function setNewPassword($newPassword)
    {
        $this->newPassword = $newPassword;
        return $this;
    }

    /**
     * Get newPassword
     *
     * @return string $newPassword
     */
    public function getNewPassword()
    {
        return $this->newPassword;
    }

    /**
     * Set secretCode
     *
     * @param string $secretCode
     * @return $this
     */
    public function setSecretCode($secretCode)
    {
        $this->secretCode = $secretCode;
        return $this;
    }

    /**
     * Get secretCode
     *
     * @return string $secretCode
     */
    public function getSecretCode()
    {
        return $this->secretCode;
    }

    /**
     * @return array
     */
    public function toArray()
    {
        $output = [
            'id' => $this->getId(),
            'email' => $this->getEmail(),
            'fullName' => $this->getFullName(),
            'phone' => $this->getPhone(),
            'options' => $this->getOptions(),
            'roles' => $this->getRoles(),
            'isActive' => $this->getIsActive(),
            'role' => current($this->getRoles())
        ];
        return $output;
    }

    /**
     * Set phone
     *
     * @param string $phone
     * @return $this
     */
    public function setPhone($phone)
    {
        $this->phone = $phone;
        return $this;
    }

    /**
     * Get phone
     *
     * @return string $phone
     */
    public function getPhone()
    {
        return $this->phone;
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
     * @return \DateTime $createdDate
     */
    public function getCreatedDate()
    {
        return $this->createdDate;
    }

    /**
     * Set updatedDate
     *
     * @param \DateTime $updatedDate
     * @return $this
     */
    public function setUpdatedDate($updatedDate)
    {
        $this->updatedDate = $updatedDate;
        return $this;
    }

    /**
     * Get updatedDate
     *
     * @return \DateTime $updatedDate
     */
    public function getUpdatedDate()
    {
        return $this->updatedDate;
    }

    /**
     * Set options
     *
     * @param array $options
     * @return $this
     */
    public function setOptions($options)
    {
        $this->options = $options;
        return $this;
    }

    /**
     * Get options
     *
     * @return array $options
     */
    public function getOptions()
    {
        return $this->options;
    }

    /**
     * @return array
     */
    public function getOptionsStructured()
    {
        $output = [];
        foreach ($this->options as $option) {
            $output[$option['name']] = $option['value'];
        }
        return $output;
    }

    /**
     * @param array $option
     * @param bool $addValue
     */
    public function updateOption($option, $addValue = false)
    {
        $optIndex = array_search($option['name'], array_column($this->options, 'name'));
        if ($optIndex > -1) {
            $this->options[$optIndex]['title'] = $option['title'];
            if ($addValue && $this->options[$optIndex]['value']) {
                $this->options[$optIndex]['value'] .= ',' . $option['value'];
            } else {
                $this->options[$optIndex]['value'] = $option['value'];
            }
        } else {
            array_push($this->options, $option);
        }
    }
}
