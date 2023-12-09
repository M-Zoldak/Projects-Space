<?php

namespace App\Repository;

use App\Entity\ProjectCategories;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;

/**
 * @extends EntityRepository<ProjectCategories>
 *
 * @method ProjectCategories|null find($id, $lockMode = null, $lockVersion = null)
 * @method ProjectCategories|null findOneBy(array $criteria, array $orderBy = null)
 * @method ProjectCategories[]    findAll()
 * @method ProjectCategories[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ProjectCategoriesRepository extends EntityRepository {
    public function __construct(ManagerRegistry $registry) {
        parent::__construct($registry, ProjectCategories::class);
    }

    //    /**
    //     * @return ProjectCategories[] Returns an array of ProjectCategories objects
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

    //    public function findOneBySomeField($value): ?ProjectCategories
    //    {
    //        return $this->createQueryBuilder('p')
    //            ->andWhere('p.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
