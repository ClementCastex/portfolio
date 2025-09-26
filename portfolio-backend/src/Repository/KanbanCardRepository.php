<?php

namespace App\Repository;

use App\Entity\KanbanCard;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<KanbanCard>
 */
class KanbanCardRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, KanbanCard::class);
    }

    /**
     * Find cards with due dates in a date range (for calendar view)
     */
    public function findCardsWithDueDates(User $owner, \DateTimeInterface $from, \DateTimeInterface $to): array
    {
        return $this->createQueryBuilder('c')
            ->join('c.column', 'col')
            ->join('col.kanban', 'k')
            ->where('k.owner = :owner')
            ->andWhere('c.dueAt BETWEEN :from AND :to')
            ->setParameter('owner', $owner)
            ->setParameter('from', $from)
            ->setParameter('to', $to)
            ->orderBy('c.dueAt', 'ASC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Search cards globally across all kanbans for a user
     */
    public function searchCards(User $owner, string $search): array
    {
        return $this->createQueryBuilder('c')
            ->join('c.column', 'col')
            ->join('col.kanban', 'k')
            ->where('k.owner = :owner')
            ->andWhere('c.title LIKE :search OR c.descriptionHtml LIKE :search')
            ->setParameter('owner', $owner)
            ->setParameter('search', '%' . $search . '%')
            ->orderBy('c.updatedAt', 'DESC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Find overdue cards for a user
     */
    public function findOverdueCards(User $owner): array
    {
        return $this->createQueryBuilder('c')
            ->join('c.column', 'col')
            ->join('col.kanban', 'k')
            ->where('k.owner = :owner')
            ->andWhere('c.dueAt < :now')
            ->setParameter('owner', $owner)
            ->setParameter('now', new \DateTimeImmutable())
            ->orderBy('c.dueAt', 'ASC')
            ->getQuery()
            ->getResult();
    }
}
