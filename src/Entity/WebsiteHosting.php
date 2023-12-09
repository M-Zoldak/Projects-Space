<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\Collection;
use App\Repository\WebsiteHostingRepository;
use Doctrine\Common\Collections\ArrayCollection;

#[ORM\Entity(repositoryClass: WebsiteHostingRepository::class)]
class WebsiteHosting extends Entity {
    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[ORM\ManyToOne(inversedBy: 'hostings')]
    private ?WebsiteOptions $websiteOptions = null;

    #[ORM\OneToMany(mappedBy: 'hosting', targetEntity: Website::class, cascade: ["persist"])]
    private Collection $websites;

    public function __construct(string $name) {
        parent::__construct();
        $this->setName($name);
        $this->websites = new ArrayCollection();
    }

    public function getData() {
        return [
            "id" => $this->getId(),
            "name" => $this->getName()
        ];
    }

    public function getName(): ?string {
        return $this->name;
    }

    public function setName(string $name): static {
        $this->name = $name;

        return $this;
    }

    public function getWebsiteOptions(): ?WebsiteOptions {
        return $this->websiteOptions;
    }

    public function setWebsiteOptions(?WebsiteOptions $websiteOptions): static {
        $this->websiteOptions = $websiteOptions;

        return $this;
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
            $website->setHosting($this);
        }

        return $this;
    }

    public function removeWebsite(Website $website): static {
        if ($this->websites->removeElement($website)) {
            // set the owning side to null (unless already changed)
            if ($website->getHosting() === $this) {
                $website->setHosting(null);
            }
        }

        return $this;
    }
}
