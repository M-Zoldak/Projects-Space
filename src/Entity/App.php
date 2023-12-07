<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Repository\AppRepository;
use Doctrine\Common\Collections\Collection;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: AppRepository::class)]
class App extends Entity {

    #[Assert\NotBlank()]
    #[ORM\Column(length: 255, nullable: false)]
    private ?string $name = null;

    #[ORM\ManyToMany(targetEntity: User::class, inversedBy: 'apps', cascade: ["persist"])]
    private Collection $users;

    #[ORM\OneToMany(mappedBy: 'app', targetEntity: Site::class, orphanRemoval: true)]
    private Collection $sites;

    #[ORM\OneToOne(mappedBy: 'app', cascade: ['persist', 'remove'], orphanRemoval: true)]
    private ?SiteOptions $siteOptions = null;

    #[ORM\OneToMany(mappedBy: 'app', cascade: ['persist', 'remove'], targetEntity: AppRole::class, orphanRemoval: true)]
    private Collection $roles;

    #[ORM\OneToMany(mappedBy: 'app', targetEntity: Project::class, orphanRemoval: true)]
    private Collection $projects;

    #[ORM\OneToMany(mappedBy: 'selectedApp', targetEntity: UserOptions::class, orphanRemoval: true)]
    private Collection $userOptions;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: true)]
    private ?AppRole $defaultRole = null;

    #[ORM\ManyToMany(targetEntity: User::class, inversedBy: 'appInvitations')]
    #[ORM\JoinTable(name: "app_users_invitation")]
    private Collection $invitedUsers;

    #[ORM\ManyToOne(inversedBy: 'ownedApps', cascade: ['persist'])]
    #[ORM\JoinColumn(nullable: true)]
    private ?User $owner = null;

    public function __construct() {
        parent::__construct();
        $this->users = new ArrayCollection();
        $this->sites = new ArrayCollection();
        $this->roles = new ArrayCollection();
        $this->projects = new ArrayCollection();
        $this->invitedUsers = new ArrayCollection();
    }

    public function getData(): array {
        return [
            "id" => $this->getId(),
            "ownerId" => $this->getOwner()->getId(),
            "name" => $this->getName(),
            "defaultRoleId" => $this->getDefaultRole()?->getId(),
            "statistics" => [
                "usersCount" => $this->getUsers()->count()
            ],
            "invitedUsers" => $this->getInvitedUsers()->toArray(),
        ];
    }

    public function getName(): ?string {
        return $this->name;
    }

    public function setName(string $name): static {
        $this->name = $name;

        return $this;
    }

    /**
     * @return Collection<int, User>
     */
    public function getUsers(): Collection {
        return $this->users;
    }

    public function addUser(User $user): static {
        if (!$this->users->contains($user)) {
            $this->users->add($user);
        }

        return $this;
    }

    public function removeUser(User $user): static {
        $this->users->removeElement($user);

        return $this;
    }

    public function hasUser(User $user): bool {
        $usersIds = array_map((
            fn (User $user) => $user->getId()
        ), $this->getUsers()->getValues());

        return in_array(
            $user->getId(),
            $usersIds
        );
    }

    /**
     * @return Collection<int, Site>
     */
    public function getSites(): Collection {
        return $this->sites;
    }

    public function addSite(Site $site): static {
        if (!$this->sites->contains($site)) {
            $this->sites->add($site);
            $site->setApp($this);
        }

        return $this;
    }

    public function removeSite(Site $site): static {
        if ($this->sites->removeElement($site)) {
            // set the owning side to null (unless already changed)
            if ($site->getApp() === $this) {
                $site->setApp(null);
            }
        }

        return $this;
    }

    public function getSiteOptions(): ?SiteOptions {
        return $this->siteOptions;
    }

    public function setSiteOptions(?SiteOptions $siteOptions): static {
        // unset the owning side of the relation if necessary
        if ($siteOptions === null && $this->siteOptions !== null) {
            $this->siteOptions->setApp(null);
        }

        // set the owning side of the relation if necessary
        if ($siteOptions !== null && $siteOptions->getApp() !== $this) {
            $siteOptions->setApp($this);
        }

        $this->siteOptions = $siteOptions;

        return $this;
    }

    /**
     * @return Collection<int, AppRole[]>
     */
    public function getRoles(): Collection {
        return $this->roles;
    }

    public function getAdminRole() {
        $roles = array_filter($this->getRoles()->toArray(), function (AppRole $role) {
            return $role->isOwnerRole();
        });
        return $roles[0] ?? null;
    }

    public function addRole(AppRole $role): static {
        if (!$this->roles->contains($role)) {
            $this->roles->add($role);
            $role->setApp($this);
        }

        return $this;
    }

    public function removeRole(AppRole $role): static {
        if ($this->roles->removeElement($role)) {
            // set the owning side to null (unless already changed)
            if ($role->getApp() === $this) {
                $role->setApp(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Project>
     */
    public function getProjects(): Collection {
        return $this->projects;
    }

    public function addProject(Project $project): static {
        if (!$this->projects->contains($project)) {
            $this->projects->add($project);
            $project->setApp($this);
        }

        return $this;
    }

    public function removeProject(Project $project): static {
        if ($this->projects->removeElement($project)) {
            // set the owning side to null (unless already changed)
            if ($project->getApp() === $this) {
                $project->setApp(null);
            }
        }

        return $this;
    }

    public function getDefaultRole(): ?AppRole {
        if (!$this->defaultRole?->getId()) $this->setDefaultRole($this->getAdminRole());
        return $this->defaultRole;
    }

    public function setDefaultRole(?AppRole $defaultRole): static {
        $this->defaultRole = $defaultRole;

        return $this;
    }

    /**
     * @return Collection<int, User>
     */
    public function getInvitedUsers(): Collection {
        return $this->invitedUsers;
    }

    public function addInvitedUser(User $invitedUser): static {
        if (!$this->invitedUsers->contains($invitedUser)) {
            $this->invitedUsers->add($invitedUser);
        }

        return $this;
    }

    public function removeInvitedUser(User $invitedUser): static {
        $this->invitedUsers->removeElement($invitedUser);

        return $this;
    }

    public function getOwner(): ?User {
        return $this->owner;
    }

    public function setOwner(?User $owner): static {
        $this->owner = $owner;

        return $this;
    }
}
