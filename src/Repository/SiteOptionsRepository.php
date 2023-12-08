<?php

namespace App\Repository;

use App\Entity\WebsiteOptions;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;

/**
 * @extends ServiceEntityRepository<WebsiteOptions>
 *
 * @method WebsiteOptions|null find($id, $lockMode = null, $lockVersion = null)
 * @method WebsiteOptions|null findOneBy(array $criteria, array $orderBy = null)
 * @method WebsiteOptions[]    findAll()
 * @method WebsiteOptions[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class WebsiteOptionsRepository extends EntityRepository {
    public function __construct(ManagerRegistry $registry) {
        parent::__construct($registry, WebsiteOptions::class);
    }

    //    /**
    //     * @return WebsiteOptions[] Returns an array of WebsiteOptions objects
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

    //    public function findOneBySomeField($value): ?WebsiteOptions
    //    {
    //        return $this->createQueryBuilder('s')
    //            ->andWhere('s.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
