<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Repository\ProjectStatesRepository;

#[ORM\Entity(repositoryClass: ProjectStatesRepository::class)]
class ProjectStates extends Entity {
    #[ORM\Column]
    private array $states = [];

    public function __construct() {
        parent::__construct();
    }

    public function getStates(): array {
        return $this->states;
    }

    public function setStates(array $states): static {
        $this->states = $states;

        return $this;
    }
}
