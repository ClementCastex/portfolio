<?php

namespace App\Controller;

use App\Entity\KanbanColumn;
use App\Repository\KanbanColumnRepository;
use App\Repository\KanbanRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Serializer\SerializerInterface;

#[IsGranted('ROLE_ADMIN')]
class KanbanColumnController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private KanbanRepository $kanbanRepository,
        private KanbanColumnRepository $columnRepository,
        private SerializerInterface $serializer
    ) {}

    #[Route('/api/kanbans/{kanbanId}/columns', name: 'create_column', methods: ['POST'])]
    public function createColumn(int $kanbanId, Request $request): JsonResponse
    {
        $user = $this->getUser();
        $kanban = $this->kanbanRepository->findOneBy(['id' => $kanbanId, 'owner' => $user]);
        
        if (!$kanban) {
            return new JsonResponse(['message' => 'Kanban not found'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);

        $column = new KanbanColumn();
        $column->setName($data['name'] ?? 'Nouvelle colonne');
        $column->setPosition($data['position'] ?? $kanban->getColumns()->count());
        $column->setKanban($kanban);

        $this->entityManager->persist($column);
        $this->entityManager->flush();

        $responseData = $this->serializer->serialize($column, 'json', ['groups' => 'column:read']);
        
        return new JsonResponse($responseData, Response::HTTP_CREATED, [], true);
    }

    #[Route('/api/columns/{id}', name: 'update_column', methods: ['PATCH'])]
    public function updateColumn(int $id, Request $request): JsonResponse
    {
        $user = $this->getUser();
        $column = $this->columnRepository->findOneBy(['id' => $id]);
        
        if (!$column || $column->getKanban()->getOwner() !== $user) {
            return new JsonResponse(['message' => 'Column not found'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);

        if (isset($data['name'])) {
            $column->setName($data['name']);
        }

        if (isset($data['position'])) {
            $column->setPosition($data['position']);
        }

        $this->entityManager->flush();

        $responseData = $this->serializer->serialize($column, 'json', ['groups' => 'column:read']);
        
        return new JsonResponse($responseData, Response::HTTP_OK, [], true);
    }

    #[Route('/api/columns/{id}', name: 'delete_column', methods: ['DELETE'])]
    public function deleteColumn(int $id): JsonResponse
    {
        $user = $this->getUser();
        $column = $this->columnRepository->findOneBy(['id' => $id]);
        
        if (!$column || $column->getKanban()->getOwner() !== $user) {
            return new JsonResponse(['message' => 'Column not found'], Response::HTTP_NOT_FOUND);
        }

        // Vérifier que la colonne est vide
        if ($column->getCards()->count() > 0) {
            return new JsonResponse(['message' => 'Cannot delete column with cards'], Response::HTTP_BAD_REQUEST);
        }

        $this->entityManager->remove($column);
        $this->entityManager->flush();

        return new JsonResponse(['message' => 'Column deleted successfully']);
    }
}
