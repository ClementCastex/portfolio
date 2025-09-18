<?php

namespace App\Controller;

use App\Entity\KanbanCardTag;
use App\Repository\KanbanRepository;
use App\Repository\KanbanCardTagRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Serializer\SerializerInterface;

#[IsGranted('ROLE_ADMIN')]
class KanbanCardTagController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private KanbanRepository $kanbanRepository,
        private KanbanCardTagRepository $tagRepository,
        private SerializerInterface $serializer
    ) {}

    #[Route('/api/kanbans/{kanbanId}/tags', name: 'create_kanban_tag', methods: ['POST'])]
    public function createTag(int $kanbanId, Request $request): JsonResponse
    {
        $user = $this->getUser();
        $kanban = $this->kanbanRepository->findOneBy(['id' => $kanbanId, 'owner' => $user]);
        
        if (!$kanban) {
            return new JsonResponse(['message' => 'Kanban not found'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);

        $tag = new KanbanCardTag();
        $tag->setName($data['name'] ?? 'Nouveau tag');
        $tag->setColorHex($data['colorHex'] ?? '#3f51b5');
        $tag->setKanban($kanban);

        $this->entityManager->persist($tag);
        $this->entityManager->flush();

        $responseData = $this->serializer->serialize($tag, 'json', ['groups' => 'tag:read']);
        
        return new JsonResponse($responseData, Response::HTTP_CREATED, [], true);
    }

    #[Route('/api/kanban-tags/{id}', name: 'update_kanban_tag', methods: ['PATCH'])]
    public function updateTag(int $id, Request $request): JsonResponse
    {
        $user = $this->getUser();
        $tag = $this->tagRepository->findOneBy(['id' => $id]);
        
        if (!$tag || $tag->getKanban()->getOwner() !== $user) {
            return new JsonResponse(['message' => 'Tag not found'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);

        if (isset($data['name'])) {
            $tag->setName($data['name']);
        }

        if (isset($data['colorHex'])) {
            $tag->setColorHex($data['colorHex']);
        }

        $this->entityManager->flush();

        $responseData = $this->serializer->serialize($tag, 'json', ['groups' => 'tag:read']);
        
        return new JsonResponse($responseData, Response::HTTP_OK, [], true);
    }

    #[Route('/api/kanban-tags/{id}', name: 'delete_kanban_tag', methods: ['DELETE'])]
    public function deleteTag(int $id): JsonResponse
    {
        $user = $this->getUser();
        $tag = $this->tagRepository->findOneBy(['id' => $id]);
        
        if (!$tag || $tag->getKanban()->getOwner() !== $user) {
            return new JsonResponse(['message' => 'Tag not found'], Response::HTTP_NOT_FOUND);
        }

        $this->entityManager->remove($tag);
        $this->entityManager->flush();

        return new JsonResponse(['message' => 'Tag deleted successfully']);
    }
}
