<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Repository\ClientRepository;
use Doctrine\Common\Collections\Collection;
use Doctrine\Common\Collections\ArrayCollection;

#[ORM\Entity(repositoryClass: ClientRepository::class)]
class Client extends Entity {
    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[ORM\Column(length: 255)]
    private ?string $fax = null;

    #[ORM\Column(length: 255)]
    private ?string $phone = null;

    #[ORM\Column(length: 255)]
    private ?string $mobile = null;

    #[ORM\OneToMany(mappedBy: 'client', targetEntity: Address::class, cascade: ["persist"], orphanRemoval: true)]
    private Collection $addresses;

    public function __construct() {
        $this->addresses = new ArrayCollection();
    }

    public function getName(): ?string {
        return $this->name;
    }

    public function setName(string $name): static {
        $this->name = $name;

        return $this;
    }

    public function getFax(): ?string {
        return $this->fax;
    }

    public function setFax(string $fax): static {
        $this->fax = $fax;

        return $this;
    }

    public function getPhone(): ?string {
        return $this->phone;
    }

    public function setPhone(string $phone): static {
        $this->phone = $phone;

        return $this;
    }

    public function getMobile(): ?string {
        return $this->mobile;
    }

    public function setMobile(string $mobile): static {
        $this->mobile = $mobile;

        return $this;
    }

    /**
     * @return Collection<int, Address>
     */
    public function getAddresses(): Collection {
        return $this->addresses;
    }

    public function addAddress(Address $address): static {
        if (!$this->addresses->contains($address)) {
            $this->addresses->add($address);
            $address->setClient($this);
        }

        return $this;
    }

    public function removeAddress(Address $address): static {
        if ($this->addresses->removeElement($address)) {
            // set the owning side to null (unless already changed)
            if ($address->getClient() === $this) {
                $address->setClient(null);
            }
        }

        return $this;
    }
}
