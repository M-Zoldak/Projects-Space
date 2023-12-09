<?php

namespace App\Repository;

use App\Entity\Website;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends EntityRepository<Website>
 *
 * @method Website|null find($id, $lockMode = null, $lockVersion = null)
 * @method Website|null findOneBy(array $criteria, array $orderBy = null)
 * @method Website[]    findAll()
 * @method Website[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class WebsiteRepository extends EntityRepository {

    public function __construct(ManagerRegistry $registry) {
        parent::__construct($registry, Website::class);
    }
}
