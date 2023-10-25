<?php

namespace App\Repository;

use App\Entity\Site;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;

class DefaultRepository extends ServiceEntityRepository {

    private EntityManager $entityManager;

    public function __construct(ManagerRegistry $registry, string $class) {
        parent::__construct($registry, $class);
        $this->entityManager = $this->getEntityManager();
    }

    public function getData() {
        $results = parent::findAll();
        $json_results = array_map(function ($el) {
            return $el->getData();
        }, $results);
        return $json_results;
    }

    public function save($object) {
        $this->entityManager->persist($object);
        $this->entityManager->flush();
    }

    public function delete($object) {
        $this->entityManager->remove($object);
        $this->entityManager->flush();
    }
}
