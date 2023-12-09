<?php

namespace App\Repository;

use App\Entity\UserNotification;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;

/**
 * @extends EntityRepository<UserNotification>
 *
 * @method UserNotification|null find($id, $lockMode = null, $lockVersion = null)
 * @method UserNotification|null findOneBy(array $criteria, array $orderBy = null)
 * @method UserNotification[]    findAll()
 * @method UserNotification[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class UserNotificationsRepository extends EntityRepository {
    public function __construct(ManagerRegistry $registry) {
        parent::__construct($registry, UserNotification::class);
    }

    //    /**
    //     * @return UserNotification[] Returns an array of UserNotification objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('u')
    //            ->andWhere('u.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('u.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?UserNotification
    //    {
    //        return $this->createQueryBuilder('u')
    //            ->andWhere('u.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
