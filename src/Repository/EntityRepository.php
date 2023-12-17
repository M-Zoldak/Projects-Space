<?php

namespace App\Repository;

use App\Entity\Entity;
use DateTimeImmutable;
use Doctrine\ORM\EntityManager;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;

/** 
 * @template T
 * @extends ServiceEntityRepository<T>
 * 
 * @method T|null find($id, $lockMode = null, $lockVersion = null)
 * @method T|null findOneBy(array $criteria, array $orderBy = null)
 * @method T|null findOneById(int $id)
 * @method T[]    findAll()
 * @method T[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
abstract class EntityRepository extends ServiceEntityRepository {
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

        $this->entityManager->persist($object);
        $this->entityManager->flush();

        return $object;
    }

    public function delete(Entity $object) {
        $this->entityManager->remove($object);
        $this->entityManager->flush();
    }
}
