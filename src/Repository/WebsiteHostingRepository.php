<?php

namespace App\Repository;

use App\Entity\WebsiteHosting;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;

/**
 * @extends EntityRepository<WebsiteHosting>
 *
 * @method WebsiteHosting|null find($id, $lockMode = null, $lockVersion = null)
 * @method WebsiteHosting|null findOneBy(array $criteria, array $orderBy = null)
 * @method WebsiteHosting[]    findAll()
 * @method WebsiteHosting[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class WebsiteHostingRepository extends EntityRepository {
    public function __construct(ManagerRegistry $registry) {
        parent::__construct($registry, WebsiteHosting::class);
    }

    //    /**
    //     * @return WebsiteHosting[] Returns an array of WebsiteHosting objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('w')
    //            ->andWhere('w.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('w.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?WebsiteHosting
    //    {
    //        return $this->createQueryBuilder('w')
    //            ->andWhere('w.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
