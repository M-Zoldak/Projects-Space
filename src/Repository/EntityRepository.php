<?php

namespace App\Repository;

use DateTime;
use App\Entity\Entity;
use DateTimeImmutable;
use Doctrine\ORM\EntityManager;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
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

    protected function getData() {
        $results = $this->findAll();
        $json_results = array_map(function ($el) {
            return $el->getData();
        }, $results);
        return $json_results;
    }

    protected function save(Entity $object) {
        if (is_null($object->getId())) $object->setCreatedAt(new DateTimeImmutable());
        $object->setModifiedAt(new DateTimeImmutable());
        $this->entityManager->persist($object);
        $this->entityManager->flush();
    }

    protected function delete(Entity $object) {
        $this->entityManager->remove($object);
        $this->entityManager->flush();
    }
}
