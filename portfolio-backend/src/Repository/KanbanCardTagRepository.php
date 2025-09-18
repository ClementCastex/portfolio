<?php

namespace App\Repository;

use App\Entity\KanbanCardTag;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<KanbanCardTag>
 */
class KanbanCardTagRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, KanbanCardTag::class);
    }
}
