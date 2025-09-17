<?php

namespace App\Repository;

use App\Entity\NoteTag;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<NoteTag>
 */
class NoteTagRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, NoteTag::class);
    }

    /**
     * Find all tags for a specific owner
     */
    public function findByOwner(User $owner): array
    {
        return $this->createQueryBuilder('t')
            ->where('t.owner = :owner')
            ->setParameter('owner', $owner)
            ->orderBy('t.name', 'ASC')
            ->getQuery()
            ->getResult();
    }
}
