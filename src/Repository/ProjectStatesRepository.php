<?php

namespace App\Repository;

use App\Entity\ProjectStates;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;

/**
 * @extends ServiceEntityRepository<ProjectStates>
 *
 * @method ProjectStates|null find($id, $lockMode = null, $lockVersion = null)
 * @method ProjectStates|null findOneBy(array $criteria, array $orderBy = null)
 * @method ProjectStates[]    findAll()
 * @method ProjectStates[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ProjectStatesRepository extends EntityRepository {
    public function __construct(ManagerRegistry $registry) {
        parent::__construct($registry, ProjectStates::class);
    }

    //    /**
    //     * @return ProjectStates[] Returns an array of ProjectStates objects
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

    //    public function findOneBySomeField($value): ?ProjectStates
    //    {
    //        return $this->createQueryBuilder('p')
    //            ->andWhere('p.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
