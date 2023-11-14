<?php

namespace App\Repository;

use Error;
use App\Entity\Entity;
use DateTimeImmutable;
use Doctrine\ORM\EntityManager;
use App\Helpers\ValidatorHelper;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Validator\Validation;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\Validator\ConstraintViolationListInterface;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;

class EntityRepository extends ServiceEntityRepository {
    private EntityManager $entityManager;

    public function __construct(
        ManagerRegistry $registry,
        #[Autowire(Entity::class)]
        string $class
    ) {
        parent::__construct($registry, $class);
        $this->entityManager = $this->getEntityManager();
    }

    public function getData() {
        $results = $this->findAll();
        $json_results = array_map(function ($el) {
            return $el->getData();
        }, $results);
        return $json_results;
    }

    public function save(Entity $object) {
        if (is_null($object->getId())) $object->setCreatedAt(new DateTimeImmutable());
        $object->setModifiedAt(new DateTimeImmutable());

        // try {
        $this->entityManager->persist($object);
        // } catch (Error $err) {
        // $this->entityManager->merge($object);
        // }
        $this->entityManager->flush();
    }

    public function delete(Entity $object) {
        $this->entityManager->remove($object);
        $this->entityManager->flush();
    }
}
