<?php

namespace App\Repository;

use App\Entity\Kanban;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Kanban>
 */
class KanbanRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Kanban::class);
    }

    /**
     * Find kanbans by owner with optional search
     */
    public function findByOwnerWithSearch(User $owner, ?string $search = null, string $sortBy = 'recent'): array
    {
        $qb = $this->createQueryBuilder('k')
            ->where('k.owner = :owner')
            ->setParameter('owner', $owner);

        if ($search) {
            $qb->andWhere('k.name LIKE :search')
               ->setParameter('search', '%' . $search . '%');
        }

        // Tri
        switch ($sortBy) {
            case 'alphabetical':
                $qb->orderBy('k.name', 'ASC');
                break;
            case 'recent':
            default:
                $qb->orderBy('k.updatedAt', 'DESC');
                break;
        }

        return $qb->getQuery()->getResult();
    }
}
