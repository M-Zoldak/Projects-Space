<?php

namespace App\Repository;

use App\Entity\SiteOptions;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;

/**
 * @extends ServiceEntityRepository<SiteOptions>
 *
 * @method SiteOptions|null find($id, $lockMode = null, $lockVersion = null)
 * @method SiteOptions|null findOneBy(array $criteria, array $orderBy = null)
 * @method SiteOptions[]    findAll()
 * @method SiteOptions[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class SiteOptionsRepository extends EntityRepository {
    public function __construct(ManagerRegistry $registry) {
        parent::__construct($registry, SiteOptions::class);
    }

    //    /**
    //     * @return SiteOptions[] Returns an array of SiteOptions objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('s')
    //            ->andWhere('s.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('s.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?SiteOptions
    //    {
    //        return $this->createQueryBuilder('s')
    //            ->andWhere('s.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
