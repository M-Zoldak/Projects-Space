<?php

namespace App\Repository;

use App\Entity\SectionPermissions;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;

/**
 * @extends EntityRepository<SectionPermissions>
 *
 * @method SectionPermissions|null find($id, $lockMode = null, $lockVersion = null)
 * @method SectionPermissions|null findOneBy(array $criteria, array $orderBy = null)
 * @method SectionPermissions[]    findAll()
 * @method SectionPermissions[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class SectionPermissionsRepository extends EntityRepository {
    public function __construct(ManagerRegistry $registry) {
        parent::__construct($registry, SectionPermissions::class);
    }

    //    /**
    //     * @return SectionPermissions[] Returns an array of SectionPermissions objects
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

    //    public function findOneBySomeField($value): ?SectionPermissions
    //    {
    //        return $this->createQueryBuilder('s')
    //            ->andWhere('s.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
