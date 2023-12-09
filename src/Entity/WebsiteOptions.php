<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Utils\EntityCollectionUtil;
use Doctrine\Common\Collections\Collection;
use App\Repository\WebsiteOptionsRepository;
use Doctrine\Common\Collections\ArrayCollection;

#[ORM\Entity(repositoryClass: WebsiteOptionsRepository::class)]
class WebsiteOptions extends Entity {

    #[ORM\OneToOne(inversedBy: 'websiteOptions', cascade: ['persist'])]
    private ?App $app = null;

    #[ORM\OneToMany(mappedBy: 'websiteOptions', cascade: ["persist", "remove"], targetEntity: WebsiteHosting::class, orphanRemoval: true)]
    private Collection $hostings;

    public function __construct() {
        parent::__construct();
        $this->hostings = new ArrayCollection();
    }


    public function getData(): array {
        return [
            "id" => $this->getId(),
            "hostings" => EntityCollectionUtil::createCollectionData($this->getHostings())
        ];
    }

    public function getApp(): ?App {
        return $this->app;
    }

    public function setApp(?App $app): static {
        $this->app = $app;

        return $this;
    }

    /**
     * @return Collection<int, WebsiteHosting>
     */
    public function getHostings(): Collection {
        return $this->hostings;
    }

    public function addHosting(WebsiteHosting $hoting): static {
        if (!$this->hostings->contains($hoting)) {
            $this->hostings->add($hoting);
            $hoting->setWebsiteOptions($this);
        }

        return $this;
    }

    public function removeHosting(WebsiteHosting $hoting): static {
        if ($this->hostings->removeElement($hoting)) {
            // set the owning side to null (unless already changed)
            if ($hoting->getWebsiteOptions() === $this) {
                $hoting->setWebsiteOptions(null);
            }
        }

        return $this;
    }
}
