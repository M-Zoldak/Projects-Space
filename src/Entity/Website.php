<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Repository\WebsiteRepository;
use Doctrine\Common\Collections\Collection;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: WebsiteRepository::class)]
class Website extends Entity {

    #[Assert\NotBlank()]
    #[Assert\Regex("/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/", message: "Domain should contain only letters and at least one dot. No spaces allowed.")]
    #[ORM\Column(length: 255)]
    private ?string $domain = null;

    #[ORM\ManyToOne(inversedBy: 'websites')]
    private ?App $app = null;

    #[ORM\ManyToOne(inversedBy: 'websites')]
    private ?Client $client = null;

    #[ORM\ManyToOne(inversedBy: 'websites')]
    private ?WebsiteHosting $hosting = null;

    #[ORM\OneToMany(mappedBy: 'website', targetEntity: Project::class)]
    private Collection $projects;

    public function __construct() {
        parent::__construct();
        $this->projects = new ArrayCollection();
    }

    public function getDomain(): ?string {
        return $this->domain;
    }

    public function setDomain(string $domain): static {
        $this->domain = $domain;

        return $this;
    }

    public function getData(): array {
        return [
            "id" => $this->getId(),
            "domain" => $this->getDomain(),
            "hosting" => $this->getHosting()?->getData(),
            "client" => $this->getClient()?->getData()
        ];
    }

    public function getApp(): ?App {
        return $this->app;
    }

    public function setApp(?App $app): static {
        $this->app = $app;

        return $this;
    }

    public function getClient(): ?Client {
        return $this->client;
    }

    public function setClient(?Client $client): static {
        $this->client = $client;

        return $this;
    }

    public function getHosting(): ?WebsiteHosting {
        return $this->hosting;
    }

    public function setHosting(?WebsiteHosting $hosting): static {
        $this->hosting = $hosting;

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
            $project->setWebsite($this);
        }

        return $this;
    }

    public function removeProject(Project $project): static {
        if ($this->projects->removeElement($project)) {
            // set the owning side to null (unless already changed)
            if ($project->getWebsite() === $this) {
                $project->setWebsite(null);
            }
        }

        return $this;
    }
}
