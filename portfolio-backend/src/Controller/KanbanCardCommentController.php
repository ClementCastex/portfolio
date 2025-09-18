<?php

namespace App\Controller;

use App\Entity\KanbanCardComment;
use App\Repository\KanbanCardRepository;
use App\Repository\KanbanCardCommentRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Serializer\SerializerInterface;

#[IsGranted('ROLE_ADMIN')]
class KanbanCardCommentController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private KanbanCardRepository $cardRepository,
        private KanbanCardCommentRepository $commentRepository,
        private SerializerInterface $serializer
    ) {}

    #[Route('/api/cards/{cardId}/comments', name: 'create_card_comment', methods: ['POST'])]
    public function createComment(int $cardId, Request $request): JsonResponse
    {
        $user = $this->getUser();
        $card = $this->cardRepository->findOneBy(['id' => $cardId]);
        
        if (!$card || $card->getColumn()->getKanban()->getOwner() !== $user) {
            return new JsonResponse(['message' => 'Card not found'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);

        $comment = new KanbanCardComment();
        $comment->setCard($card);
        $comment->setAuthor($user);
        $comment->setContent($data['content'] ?? '');

        $this->entityManager->persist($comment);
        $this->entityManager->flush();

        $responseData = $this->serializer->serialize($comment, 'json', ['groups' => 'comment:read']);
        
        return new JsonResponse($responseData, Response::HTTP_CREATED, [], true);
    }

    #[Route('/api/comments/{id}', name: 'update_comment', methods: ['PATCH'])]
    public function updateComment(int $id, Request $request): JsonResponse
    {
        $user = $this->getUser();
        $comment = $this->commentRepository->findOneBy(['id' => $id]);
        
        if (!$comment || $comment->getCard()->getColumn()->getKanban()->getOwner() !== $user) {
            return new JsonResponse(['message' => 'Comment not found'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);

        if (isset($data['content'])) {
            $comment->setContent($data['content']);
        }

        $this->entityManager->flush();

        $responseData = $this->serializer->serialize($comment, 'json', ['groups' => 'comment:read']);
        
        return new JsonResponse($responseData, Response::HTTP_OK, [], true);
    }

    #[Route('/api/comments/{id}', name: 'delete_comment', methods: ['DELETE'])]
    public function deleteComment(int $id): JsonResponse
    {
        $user = $this->getUser();
        $comment = $this->commentRepository->findOneBy(['id' => $id]);
        
        if (!$comment || $comment->getCard()->getColumn()->getKanban()->getOwner() !== $user) {
            return new JsonResponse(['message' => 'Comment not found'], Response::HTTP_NOT_FOUND);
        }

        $this->entityManager->remove($comment);
        $this->entityManager->flush();

        return new JsonResponse(['message' => 'Comment deleted successfully']);
    }
}
