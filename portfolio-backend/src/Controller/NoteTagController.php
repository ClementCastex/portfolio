<?php

namespace App\Controller;

use App\Entity\NoteTag;
use App\Repository\NoteTagRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/api/note-tags')]
#[IsGranted('ROLE_ADMIN')]
class NoteTagController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private NoteTagRepository $noteTagRepository,
        private SerializerInterface $serializer
    ) {}

    #[Route('', name: 'get_note_tags', methods: ['GET'])]
    public function getTags(): JsonResponse
    {
        $user = $this->getUser();
        $tags = $this->noteTagRepository->findByOwner($user);
        
        $data = $this->serializer->serialize($tags, 'json', ['groups' => 'tag:read']);
        
        return new JsonResponse($data, Response::HTTP_OK, [], true);
    }

    #[Route('', name: 'create_note_tag', methods: ['POST'])]
    public function createTag(Request $request): JsonResponse
    {
        $user = $this->getUser();
        $data = json_decode($request->getContent(), true);

        $tag = new NoteTag();
        $tag->setName($data['name'] ?? 'Nouveau tag');
        $tag->setColorHex($data['colorHex'] ?? '#2196F3');
        $tag->setOwner($user);

        $this->entityManager->persist($tag);
        $this->entityManager->flush();

        $responseData = $this->serializer->serialize($tag, 'json', ['groups' => 'tag:read']);
        
        return new JsonResponse($responseData, Response::HTTP_CREATED, [], true);
    }

    #[Route('/{id}', name: 'update_note_tag', methods: ['PATCH'])]
    public function updateTag(int $id, Request $request): JsonResponse
    {
        $user = $this->getUser();
        $tag = $this->noteTagRepository->findOneBy(['id' => $id, 'owner' => $user]);
        
        if (!$tag) {
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

    #[Route('/{id}', name: 'delete_note_tag', methods: ['DELETE'])]
    public function deleteTag(int $id): JsonResponse
    {
        $user = $this->getUser();
        $tag = $this->noteTagRepository->findOneBy(['id' => $id, 'owner' => $user]);
        
        if (!$tag) {
            return new JsonResponse(['message' => 'Tag not found'], Response::HTTP_NOT_FOUND);
        }

        $this->entityManager->remove($tag);
        $this->entityManager->flush();

        return new JsonResponse(['message' => 'Tag deleted successfully']);
    }
}
