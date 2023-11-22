<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Repository\SectionPermissionsRepository;

#[ORM\Entity(repositoryClass: SectionPermissionsRepository::class)]
class SectionPermissions extends Entity {

    #[ORM\ManyToOne(inversedBy: 'sectionPermissions', cascade: ["persist"])]
    #[ORM\JoinColumn(nullable: false)]
    private ?AppRole $appRole = null;

    #[ORM\Column(nullable: true)]
    private ?bool $destroy = null;

    #[ORM\Column(nullable: true)]
    private ?bool $edit = null;

    #[ORM\Column(nullable: true)]
    private ?bool $review = null;

    #[ORM\Column(length: 255)]
    private ?string $sectionName = null;

    public function __construct(AppRole $appRole, string $sectionName, bool $isDestroyable = false, bool $isReviewable = false, bool $isEditable = false) {
        parent::__construct();
        $this->setAppRole($appRole);
        $this->setSectionName($sectionName);
        $this->setDestroy($isDestroyable);
        $this->setReview($isReviewable);
        $this->setEdit($isEditable);
    }

    public function getData(): object {
        return (object) [
            $this->getSectionName() =>  [
                "id" => $this->getId(),
                "roleId" => $this->getAppRole()->getId(),
                "hasShow" => $this->isReview(),
                "deleteable" => $this->isDestroy(),
                "hasOptions" => $this->isEdit()
            ]
        ];
    }

    public function getAppRole(): ?AppRole {
        return $this->appRole;
    }

    public function setAppRole(?AppRole $appRole): static {
        $this->appRole = $appRole;

        return $this;
    }

    public function getSectionName(): ?string {
        return $this->sectionName;
    }

    public function setSectionName(string $sectionName): static {
        $this->sectionName = $sectionName;

        return $this;
    }

    public function isDestroy(): ?bool {
        return $this->destroy;
    }

    public function setDestroy(?bool $destroy): static {
        $this->destroy = $destroy;

        return $this;
    }

    public function isEdit(): ?bool {
        return $this->edit;
    }

    public function setEdit(?bool $edit): static {
        $this->edit = $edit;

        return $this;
    }

    public function isReview(): ?bool {
        return $this->review;
    }

    public function setReview(?bool $review): static {
        $this->review = $review;

        return $this;
    }
}
