<?php

namespace App\MainBundle\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Contracts\Translation\TranslatorInterface;
use Symfony\Component\Validator\Constraints as Assert;
use Doctrine\Bundle\MongoDBBundle\Validator\Constraints\Unique as MongoDBUnique;
use Symfony\Component\Security\Core\User\AdvancedUserInterface;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Security\Core\Role\Role;

/**
 * @MongoDB\Document(collection="user", repositoryClass="App\Repository\UserRepository")
 * @MongoDBUnique(fields="email", message="This email is already used.")
 * @MongoDB\HasLifecycleCallbacks()
 */
class User implements UserInterface, \Serializable
{
    /**
     * @MongoDB\Id(type="int", strategy="INCREMENT")
     * @Groups({"details", "list"})
     * @var int
     */
    protected $id;

    /**
     * @MongoDB\Field(type="string", nullable=true)
     * @Groups({"details", "list"})
     * @var string
     */
    private $username;

    /**
     * @MongoDB\Field(type="string")
     * @Groups({"details", "list"})
     * @Assert\NotBlank()
     * @Assert\Email()
     * @var string
     */
    protected $email;

    /**
     * @MongoDB\Field(type="string", nullable=true)
     * @Groups({"details", "list"})
     * @var string
     */
    protected $fullName;

    /**
     * @MongoDB\Field(type="string", nullable=true)
     * @Groups({"details", "list"})
     * @var string
     */
    protected $phone;

    /**
     * @MongoDB\Field(type="collection", nullable=true)
     * @Groups({"details", "list"})
     * @var array
     */
    protected $options;

    /**
     * @MongoDB\Field(type="date", nullable=true)
     * @Groups({"details", "list"})
     * @var \DateTime
     */
    protected $createdDate;

    /**
     * @MongoDB\Field(type="date", nullable=true)
     * @Groups({"details", "list"})
     * @var \DateTime
     */
    protected $updatedDate;

    /**
     * @MongoDB\Field(type="string")
     * @Assert\NotBlank(message="Password should not be blank.")
     * @var string
     */
    protected $password;

    /**
     * @Assert\Length(min=6, max=50)
     * @var string
     */
    protected $plainPassword;

    /**
     * @MongoDB\Field(type="string", nullable=true)
     * @var string
     */
    protected $newPassword;

    /**
     * @MongoDB\Field(type="string", nullable=true)
     * @Groups({"details"})
     * @var string
     */
    protected $secretCode;

    /**
     * @MongoDB\Field(type="string")
     * @var string
     */
    private $salt;

    /**
     * @MongoDB\Field(type="boolean")
     * @Groups({"details", "list"})
     * @var boolean
     */
    protected $isActive;

    /**
     * @MongoDB\Field(type="collection")
     * @Groups({"details", "list"})
     * @Assert\NotBlank(message="Role should not be blank.")
     * @var string[]
     */
    protected $roles;

    /**
     * @Groups({"details", "list"})
     * @var string
     */
    protected $role;

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

    /**
     * Get int
     * @return int
     */
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
        $this->email = mb_strtolower($email);
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
     * @param string $password
     * @return $this
     */
    public function setPassword($password)
    {
        $this->password = $password;
        return $this;
    }

    /**
     * @return string
     */
    public function getPlainPassword()
    {
        return $this->plainPassword;
    }

    /**
     * @param $plainPassword
     * @return $this
     */
    public function setPlainPassword($plainPassword)
    {
        $this->plainPassword = $plainPassword;
        return $this;
    }

    /**
     * @param bool $addDefault
     * @return string[]
     */
    public function getRoles($addDefault = true)
    {
        $roles = !empty($this->roles) ? $this->roles : [];
        if($addDefault){
            $roles[] = 'ROLE_USER';
        }
        return array_unique($roles);
    }

    /**
     * @return string
     */
    public function getRole()
    {
        $roles = $this->getRoles();
        return current($roles);
    }

    /**
     * @param array $roles
     * @return $this
     */
    public function setRoles(array $roles)
    {
        if (!in_array('ROLE_USER', $roles)) {
            $roles[] = 'ROLE_USER';
        }
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
            $this->isActive
        ));
    }

    /** @see \Serializable::unserialize() */
    public function unserialize($serialized)
    {
        list (
            $this->id,
            $this->email,
            $this->password,
            $this->isActive
            ) = unserialize($serialized);
    }

    /**
     * Set isActive
     *
     * @param boolean $isActive
     * @return $this
     */
    public function setIsActive($isActive)
    {
        $this->isActive = $isActive;
        return $this;
    }

    /**
     * Get isActive
     *
     * @return boolean
     */
    public function getIsActive()
    {
        return $this->isActive;
    }

    /**
     * Set fullName
     *
     * @param string $fullName
     * @return $this
     */
    public function setFullName($fullName)
    {
        $this->fullName = $fullName;
        return $this;
    }

    /**
     * Get fullName
     *
     * @return string
     */
    public function getFullName()
    {
        return $this->fullName;
    }

    /**
     * Set username
     *
     * @param string $username
     * @return $this
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
     * @return $this
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
     * @return string
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
     * @return string
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
     * @return string
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
     * @return \DateTime
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
     * @return \DateTime
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
     * @return array
     */
    public function getOptions()
    {
        return $this->options ?: [];
    }

    /**
     * @param string $key
     * @param mixed $value
     * @param string $title
     * @return $this
     */
    public function setOptionValue($key, $value, $title = '')
    {
        $newOption = [
            'name' => $key,
            'value' => $value,
            'title' => $title
        ];
        $options = $this->getOptions();
        $index = array_search($key, array_column($options, 'name'));
        if ($index !== false) {
            $options[$index] = $newOption;
        } else {
            $options[] = $newOption;
        }
        $this->setOptions($options);
        return $this;
    }

    /**
     * @param $key
     * @return string|null
     */
    public function getOptionValue($key)
    {
        $options = $this->getOptions();
        $index = array_search($key, array_column($options, 'name'));
        return $index !== false ? $options[$index]['value'] : null;
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
     * @param bool
     */
    public function updateOption($option, $addValue = false)
    {
        if (!is_array($this->options)) {
            $this->options = [];
        }
        $optIndex = array_search($option['name'], array_column($this->options, 'name'));
        if ($optIndex > -1) {
            if (isset($option['title'])) {
                $this->options[$optIndex]['title'] = $option['title'];
            }
            if ($addValue && $this->options[$optIndex]['value']) {
                $this->options[$optIndex]['value'] .= ',' . $option['value'];
            } else {
                $this->options[$optIndex]['value'] = $option['value'];
            }
        } else {
            array_push($this->options, $option);
        }
    }

    /**
     * @return bool
     */
    public function getIsAdmin()
    {
        return in_array('ROLE_ADMIN', $this->getRoles());
    }

    /**
     * @return bool
     */
    public function getIsSuperAdmin()
    {
        return in_array('ROLE_SUPER_ADMIN', $this->getRoles());
    }
}
