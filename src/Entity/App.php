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
    private ?string $Name = null;

    #[ORM\ManyToMany(targetEntity: User::class, inversedBy: 'apps')]
    private Collection $Users;

    #[ORM\OneToMany(mappedBy: 'App', targetEntity: Customer::class)]
    private Collection $customers;

    #[ORM\OneToMany(mappedBy: 'App', targetEntity: Site::class)]
    private Collection $sites;

    #[ORM\OneToOne(mappedBy: 'app', cascade: ['persist', 'remove'])]
    private ?SiteOptions $siteOptions = null;

    #[ORM\OneToMany(mappedBy: 'app', targetEntity: AppRole::class)]
    private Collection $roles;

    #[ORM\Column(length: 255)]
    private ?string $appHeadAdminName = null;

    #[ORM\OneToMany(mappedBy: 'app', targetEntity: Project::class)]
    private Collection $projects;

    public function __construct() {
        parent::__construct();
        $this->Users = new ArrayCollection();
        $this->customers = new ArrayCollection();
        $this->sites = new ArrayCollection();
        $this->roles = new ArrayCollection();
        $this->projects = new ArrayCollection();
    }

    public function getData(): array {
        return [
            "id" => $this->getId(),
            "name" => $this->getName(),
            "copyable" => false,
            "hasView" => true,
            "destroyable" => true,
            "hasView" => true
        ];
    }

    public function getName(): ?string {
        return $this->Name;
    }

    public function setName(string $Name): static {
        $this->Name = $Name;

        return $this;
    }

    /**
     * @return Collection<int, User>
     */
    public function getUsers(): Collection {
        return $this->Users;
    }

    public function addUser(User $user): static {
        if (!$this->Users->contains($user)) {
            $this->Users->add($user);
        }

        return $this;
    }

    public function removeUser(User $user): static {
        $this->Users->removeElement($user);

        return $this;
    }

    /**
     * @return Collection<int, Customer>
     */
    public function getCustomers(): Collection {
        return $this->customers;
    }

    public function addCustomer(Customer $customer): static {
        if (!$this->customers->contains($customer)) {
            $this->customers->add($customer);
            $customer->setApp($this);
        }

        return $this;
    }

    public function removeCustomer(Customer $customer): static {
        if ($this->customers->removeElement($customer)) {
            // set the owning side to null (unless already changed)
            if ($customer->getApp() === $this) {
                $customer->setApp(null);
            }
        }

        return $this;
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
     * @return Collection<int, Roles>
     */
    public function getRoles(): Collection {
        return $this->roles;
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

    public function getAppHeadAdminName(): ?string {
        return $this->appHeadAdminName;
    }

    public function setAppHeadAdminName(string $appHeadAdminName): static {
        $this->appHeadAdminName = $appHeadAdminName;

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
}
