<?php

namespace App\Repository;

use App\Entity\ProjectOptions;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<ProjectOptions>
 *
 * @method ProjectOptions|null find($id, $lockMode = null, $lockVersion = null)
 * @method ProjectOptions|null findOneBy(array $criteria, array $orderBy = null)
 * @method ProjectOptions[]    findAll()
 * @method ProjectOptions[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ProjectOptionsRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ProjectOptions::class);
    }

//    /**
//     * @return ProjectOptions[] Returns an array of ProjectOptions objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('p')
//            ->andWhere('p.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('p.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?ProjectOptions
//    {
//        return $this->createQueryBuilder('p')
//            ->andWhere('p.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
