<?php

namespace App\Repository;

use App\Entity\ProjectCategory;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;

/**
 * @extends EntityRepository<ProjectCategory>
 *
 * @method ProjectCategory|null find($id, $lockMode = null, $lockVersion = null)
 * @method ProjectCategory|null findOneBy(array $criteria, array $orderBy = null)
 * @method ProjectCategory[]    findAll()
 * @method ProjectCategory[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ProjectCategoryRepository extends EntityRepository {
    public function __construct(ManagerRegistry $registry) {
        parent::__construct($registry, ProjectCategory::class);
    }

    //    /**
    //     * @return ProjectCategory[] Returns an array of ProjectCategory objects
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

    //    public function findOneBySomeField($value): ?ProjectCategory
    //    {
    //        return $this->createQueryBuilder('p')
    //            ->andWhere('p.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
