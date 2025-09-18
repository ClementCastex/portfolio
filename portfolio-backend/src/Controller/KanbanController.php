<?php

namespace App\Controller;

use App\Entity\Kanban;
use App\Entity\KanbanColumn;
use App\Repository\KanbanRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/api/kanbans')]
#[IsGranted('ROLE_ADMIN')]
class KanbanController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private KanbanRepository $kanbanRepository,
        private SerializerInterface $serializer
    ) {}

    #[Route('', name: 'get_kanbans', methods: ['GET'])]
    public function getKanbans(Request $request): JsonResponse
    {
        $user = $this->getUser();
        $search = $request->query->get('search');
        $sortBy = $request->query->get('sortBy', 'recent');

        $kanbans = $this->kanbanRepository->findByOwnerWithSearch($user, $search, $sortBy);
        
        $data = $this->serializer->serialize($kanbans, 'json', ['groups' => 'kanban:read']);
        
        return new JsonResponse($data, Response::HTTP_OK, [], true);
    }

    #[Route('/{id}', name: 'get_kanban', methods: ['GET'])]
    public function getKanban(int $id): JsonResponse
    {
        $user = $this->getUser();
        $kanban = $this->kanbanRepository->findOneBy(['id' => $id, 'owner' => $user]);
        
        if (!$kanban) {
            return new JsonResponse(['message' => 'Kanban not found'], Response::HTTP_NOT_FOUND);
        }

        $data = $this->serializer->serialize($kanban, 'json', ['groups' => 'kanban:read']);
        
        return new JsonResponse($data, Response::HTTP_OK, [], true);
    }

    #[Route('', name: 'create_kanban', methods: ['POST'])]
    public function createKanban(Request $request): JsonResponse
    {
        $user = $this->getUser();
        $data = json_decode($request->getContent(), true);

        $kanban = new Kanban();
        $kanban->setName($data['name'] ?? 'Nouveau tableau');
        $kanban->setOwner($user);

        // Créer les colonnes par défaut
        $defaultColumns = ['À faire', 'En cours', 'Terminé'];
        foreach ($defaultColumns as $index => $columnName) {
            $column = new KanbanColumn();
            $column->setName($columnName);
            $column->setPosition($index);
            $column->setKanban($kanban);
            $kanban->addColumn($column);
            $this->entityManager->persist($column);
        }

        $this->entityManager->persist($kanban);
        $this->entityManager->flush();

        $responseData = $this->serializer->serialize($kanban, 'json', ['groups' => 'kanban:read']);
        
        return new JsonResponse($responseData, Response::HTTP_CREATED, [], true);
    }

    #[Route('/{id}', name: 'update_kanban', methods: ['PATCH'])]
    public function updateKanban(int $id, Request $request): JsonResponse
    {
        $user = $this->getUser();
        $kanban = $this->kanbanRepository->findOneBy(['id' => $id, 'owner' => $user]);
        
        if (!$kanban) {
            return new JsonResponse(['message' => 'Kanban not found'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);

        if (isset($data['name'])) {
            $kanban->setName($data['name']);
        }

        $this->entityManager->flush();

        $responseData = $this->serializer->serialize($kanban, 'json', ['groups' => 'kanban:read']);
        
        return new JsonResponse($responseData, Response::HTTP_OK, [], true);
    }

    #[Route('/{id}', name: 'delete_kanban', methods: ['DELETE'])]
    public function deleteKanban(int $id): JsonResponse
    {
        $user = $this->getUser();
        $kanban = $this->kanbanRepository->findOneBy(['id' => $id, 'owner' => $user]);
        
        if (!$kanban) {
            return new JsonResponse(['message' => 'Kanban not found'], Response::HTTP_NOT_FOUND);
        }

        $this->entityManager->remove($kanban);
        $this->entityManager->flush();

        return new JsonResponse(['message' => 'Kanban deleted successfully']);
    }
}
