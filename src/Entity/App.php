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

    public function __construct() {
        $this->Users = new ArrayCollection();
        $this->customers = new ArrayCollection();
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

    public function getData() {
        return [
            "id" => $this->getId(),
            "name" => $this->getName(),
            "copyable" => false,
            "hasOptions" => true,
            "deleteable" => true,
            "editable" => true
        ];
    }
}
