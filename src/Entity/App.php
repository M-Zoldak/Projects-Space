<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Repository\AppRepository;
use App\Utils\EntityCollectionUtil;
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

    #[ORM\OneToMany(mappedBy: 'app', cascade: ["persist", "remove"], targetEntity: Website::class, orphanRemoval: true)]
    private Collection $websites;

    #[ORM\OneToOne(mappedBy: 'app', cascade: ['persist', 'remove'], orphanRemoval: true)]
    private ?WebsiteOptions $websiteOptions = null;

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

    #[ORM\OneToMany(mappedBy: 'app', targetEntity: Client::class, cascade: ["persist"], orphanRemoval: true)]
    private Collection $clients;

    #[ORM\OneToMany(mappedBy: 'app', targetEntity: ProjectState::class, cascade: ["persist", "remove"], orphanRemoval: true)]
    private Collection $projectState;

    public function __construct() {
        parent::__construct();
        $this->users = new ArrayCollection();
        $this->websites = new ArrayCollection();
        $this->roles = new ArrayCollection();
        $this->projects = new ArrayCollection();
        $this->invitedUsers = new ArrayCollection();
        $this->clients = new ArrayCollection();
        $this->websiteOptions = new WebsiteOptions();
        $this->projectState = new ArrayCollection();
    }

    public function getData(?User $user = null): array {
        return [
            "id" => $this->getId(),
            "ownerId" => $this->getOwner()->getId(),
            "defaultRoleId" => $this->getDefaultRole()?->getId(),
            "name" => $this->getName(),
            "websiteOptions" => $this->getWebsiteOptions()?->getData(),
            "statistics" => [
                "usersCount" => $this->getUsers()->count()
            ],
            "users" => EntityCollectionUtil::createCollectionData($this->getUsers()),
            "currentUserRole" => $user?->getCurrentAppRole($this),
            "projectStates" => EntityCollectionUtil::createCollectionData($this->getProjectStates())
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
     * @return Collection<int, Website>
     */
    public function getWebsites(): Collection {
        return $this->websites;
    }

    public function addWebsite(Website $website): static {
        if (!$this->websites->contains($website)) {
            $this->websites->add($website);
            $website->setApp($this);
        }

        return $this;
    }

    public function removeWebsite(Website $website): static {
        if ($this->websites->removeElement($website)) {
            // set the owning side to null (unless already changed)
            if ($website->getApp() === $this) {
                $website->setApp(null);
            }
        }

        return $this;
    }

    public function getWebsiteOptions(): ?WebsiteOptions {
        if (!$this->websiteOptions) $this->setWebsiteOptions(new WebsiteOptions());
        return $this->websiteOptions;
    }

    public function setWebsiteOptions(?WebsiteOptions $websiteOptions): static {
        // unset the owning side of the relation if necessary
        if ($websiteOptions === null && $this->websiteOptions !== null) {
            $this->websiteOptions->setApp(null);
        }

        // set the owning side of the relation if necessary
        if ($websiteOptions !== null && $websiteOptions->getApp() !== $this) {
            $websiteOptions->setApp($this);
        }

        $this->websiteOptions = $websiteOptions;

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

    /**
     * @return Collection<int, Client>
     */
    public function getClients(): Collection {
        return $this->clients;
    }

    public function addClient(Client $client): static {
        if (!$this->clients->contains($client)) {
            $this->clients->add($client);
            $client->setApp($this);
        }

        return $this;
    }

    public function removeClient(Client $client): static {
        if ($this->clients->removeElement($client)) {
            // set the owning side to null (unless already changed)
            if ($client->getApp() === $this) {
                $client->setApp(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, ProjectState>
     */
    public function getProjectStates(): Collection {
        return $this->projectState;
    }

    public function addProjectState(ProjectState $projectState): static {
        if (!$this->projectState->contains($projectState)) {
            $this->projectState->add($projectState);
            $projectState->setApp($this);
        }

        return $this;
    }

    public function removeProjectState(ProjectState $projectState): static {
        if ($this->projectState->removeElement($projectState)) {
            // set the owning side to null (unless already changed)
            if ($projectState->getApp() === $this) {
                $projectState->setApp(null);
            }
        }

        return $this;
    }
}
