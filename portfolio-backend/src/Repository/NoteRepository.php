<?php

namespace App\Repository;

use App\Entity\Note;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Note>
 */
class NoteRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Note::class);
    }

    /**
     * Find notes by owner with optional filters
     */
    public function findByOwnerWithFilters(User $owner, ?string $search = null, ?int $tagId = null, bool $archived = false): array
    {
        $qb = $this->createQueryBuilder('n')
            ->leftJoin('n.tags', 't')
            ->where('n.owner = :owner')
            ->andWhere('n.isArchived = :archived')
            ->setParameter('owner', $owner)
            ->setParameter('archived', $archived)
            ->orderBy('n.updatedAt', 'DESC');

        if ($search) {
            $qb->andWhere('n.title LIKE :search OR n.contentHtml LIKE :search')
               ->setParameter('search', '%' . $search . '%');
        }

        if ($tagId) {
            $qb->andWhere('t.id = :tagId')
               ->setParameter('tagId', $tagId);
        }

        return $qb->getQuery()->getResult();
    }

    /**
     * Find notes that need sync (updated after last sync)
     */
    public function findNotesNeedingSync(User $owner): array
    {
        return $this->createQueryBuilder('n')
            ->where('n.owner = :owner')
            ->andWhere('n.updatedAt > n.lastSyncAt OR n.lastSyncAt IS NULL')
            ->setParameter('owner', $owner)
            ->getQuery()
            ->getResult();
    }
}
