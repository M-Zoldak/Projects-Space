<?php

namespace App\Entity;

use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use App\Repository\UserRepository;
use App\Utils\EntityCollectionUtil;
use Doctrine\Common\Collections\Collection;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[UniqueEntity("email")]
class User extends Entity implements UserInterface, PasswordAuthenticatedUserInterface {
    #[Assert\Email]
    #[Assert\NotBlank()]
    #[ORM\Column(length: 180, unique: true)]
    private ?string $email = null;

    #[ORM\Column]
    private array $roles = [];

    /**
     * @var string The hashed password
     */
    #[ORM\Column]
    private ?string $password = null;

    #[Assert\Length(["min" => 2])]
    #[ORM\Column(length: 255)]
    private ?string $firstName = null;

    #[Assert\NotBlank()]
    #[Assert\Length(["min" => 2])]
    #[ORM\Column(length: 255)]
    private ?string $lastName = null;

    #[Assert\NotBlank(null, "This field can not be empty.")]
    #[ORM\Column(type: Types::DATE_MUTABLE)]
    private ?\DateTimeInterface $birthDate = null;

    #[ORM\ManyToMany(targetEntity: App::class, mappedBy: 'users')]
    private Collection $apps;

    #[ORM\ManyToMany(targetEntity: AppRole::class, mappedBy: 'users', cascade: ["persist"], orphanRemoval: true)]
    private Collection $appRoles;

    #[ORM\OneToMany(mappedBy: 'user', targetEntity: ProjectRole::class, orphanRemoval: true)]
    private Collection $projectRoles;

    #[ORM\OneToOne(mappedBy: 'user', cascade: ['persist', 'remove'])]
    private ?UserOptions $userOptions = null;

    #[ORM\ManyToMany(targetEntity: App::class, mappedBy: 'invitedUsers')]
    #[ORM\JoinTable(name: "apps_users_invitation")]
    private Collection $appInvitations;

    #[ORM\OneToMany(mappedBy: 'user', targetEntity: UserNotification::class, cascade: ["persist", "remove"])]
    private Collection $notifications;

    public function __construct() {
        parent::__construct();
        $this->apps = new ArrayCollection();
        $this->appRoles = new ArrayCollection();
        $this->projectRoles = new ArrayCollection();
        $this->setUserOptions(new UserOptions());
        $this->appInvitations = new ArrayCollection();
        $this->notifications = new ArrayCollection();
    }

    public function getData(App $app = null): array {
        $userPermissions = $app ? $this->getCurrentAppRole($app) : null;
        return [
            "id" => $this->getId(),
            "name" => $this->getFirstName() . " " . $this->getLastName(),
            "appRole" => $userPermissions
        ];
    }

    public function getCurrentUserData(App $app = null): array {
        $userPermissions = $app ? $this->getCurrentAppRole($app) : null;
        return [
            "id" => $this->getId(),
            "name" => $this->getFirstName() . " " . $this->getLastName(),
            "currentAppRole" => $userPermissions,
            "userOptions" => $this->getUserOptions()->getData()
        ];
    }

    public function getEmail(): ?string {
        return $this->email;
    }

    public function setEmail(string $email): static {
        $this->email = $email;

        return $this;
    }

    public function getFullName() {
        return $this->getFirstName() . " " . $this->getLastName();
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string {
        return (string) $this->email;
    }

    /**
     * @see UserInterface
     */
    public function getRoles(): array {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    public function setRoles(array $roles): static {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see PasswordAuthenticatedUserInterface
     */
    public function getPassword(): string {
        return $this->password;
    }

    public function setPassword(string $password): static {
        $this->password = $password;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials(): void {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }

    public function getFirstName(): ?string {
        return $this->firstName;
    }

    public function setFirstName(string $firstName): static {
        $this->firstName = $firstName;

        return $this;
    }

    public function getLastName(): ?string {
        return $this->lastName;
    }

    public function setLastName(string $lastName): static {
        $this->lastName = $lastName;

        return $this;
    }

    public function getBirthDate(): ?\DateTimeInterface {
        return $this->birthDate;
    }

    public function setBirthDate(\DateTimeInterface $birthDate): static {
        $this->birthDate = $birthDate;

        return $this;
    }

    /**
     * @return Collection<int, App>
     */
    public function getApps(): Collection {
        return $this->apps;
    }

    public function addApp(App $app): static {
        if (!$this->apps->contains($app)) {
            $this->apps->add($app);
            $app->addUser($this);
        }

        return $this;
    }

    public function removeApp(App $app): static {
        if ($this->apps->removeElement($app)) {
            $app->removeUser($this);
        }

        return $this;
    }

    /**
     * @return Collection<int, AppRole>
     */
    public function getAppRoles(): Collection {
        return $this->appRoles;
    }

    public function getCurrentAppRole(App $app) {
        $roles = $app->getRoles()->toArray();

        $role = array_filter($roles, function (AppRole $role) {
            return in_array($this, $role->getUsers()->toArray());
        });
        return (object) $role[0]->getData();
    }

    public function addAppRole(AppRole $appRole): static {
        if (!$this->appRoles->contains($appRole)) {
            $this->appRoles->add($appRole);
            $appRole->addUser($this);
        }

        return $this;
    }

    public function removeAppRole(AppRole $appRole): static {
        if ($this->appRoles->removeElement($appRole)) {
            $appRole->removeUser($this);
        }

        return $this;
    }

    /**
     * @return Collection<int, ProjectRole>
     */
    public function getProjectRoles(): Collection {
        return $this->projectRoles;
    }

    public function addProjectRole(ProjectRole $projectRole): static {
        if (!$this->projectRoles->contains($projectRole)) {
            $this->projectRoles->add($projectRole);
            $projectRole->setUser($this);
        }

        return $this;
    }

    public function removeProjectRole(ProjectRole $projectRole): static {
        if ($this->projectRoles->removeElement($projectRole)) {
            // set the owning side to null (unless already changed)
            if ($projectRole->getUser() === $this) {
                $projectRole->setUser(null);
            }
        }

        return $this;
    }

    public function getUserOptions(): ?UserOptions {
        return $this->userOptions;
    }

    public function setUserOptions(UserOptions $userOptions): static {
        // set the owning side of the relation if necessary
        if ($userOptions->getUser() !== $this) {
            $userOptions->setUser($this);
        }

        $this->userOptions = $userOptions;

        return $this;
    }

    /**
     * @return Collection<int, App>
     */
    public function getAppInvitations(): Collection {
        return $this->appInvitations;
    }

    public function addAppInvitation(App $appInvitation): static {
        if (!$this->appInvitations->contains($appInvitation)) {
            $this->appInvitations->add($appInvitation);
            $appInvitation->addInvitedUser($this);
        }

        return $this;
    }

    public function removeAppInvitation(App $appInvitation): static {
        if ($this->appInvitations->removeElement($appInvitation)) {
            $appInvitation->removeInvitedUser($this);
        }

        return $this;
    }

    /**
     * @return Collection<int, UserNotification>
     */
    public function getNotifications(): Collection {
        return $this->notifications;
    }

    public function addNotification(UserNotification $notification): static {
        if (!$this->notifications->contains($notification)) {
            $this->notifications->add($notification);
            $notification->setUser($this);
        }

        return $this;
    }

    public function removeNotification(UserNotification $notification): static {
        if ($this->notifications->removeElement($notification)) {
            // set the owning side to null (unless already changed)
            if ($notification->getUser() === $this) {
                $notification->setUser(null);
            }
        }

        return $this;
    }
}
