<?php

namespace App\Controller;

use App\Entity\Bookmark;
use App\Entity\Project;
use App\Repository\BookmarkRepository;
use App\Repository\ProjectRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/api/bookmarks')]
class BookmarkController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private BookmarkRepository $bookmarkRepository,
        private ProjectRepository $projectRepository,
        private SerializerInterface $serializer
    ) {
    }

    #[Route('', name: 'get_user_bookmarks', methods: ['GET'])]
    public function getUserBookmarks(): JsonResponse
    {
        $this->denyAccessUnlessGranted('ROLE_USER');
        $user = $this->getUser();
        
        $bookmarks = $this->bookmarkRepository->findBy(['user' => $user]);
        $data = $this->serializer->serialize($bookmarks, 'json', ['groups' => 'bookmark:read']);
        
        return new JsonResponse($data, Response::HTTP_OK, [], true);
    }

    #[Route('/project/{projectId}', name: 'toggle_bookmark', methods: ['POST'])]
    public function toggleBookmark(int $projectId): JsonResponse
    {
        $this->denyAccessUnlessGranted('ROLE_USER');
        $user = $this->getUser();
        
        $project = $this->projectRepository->find($projectId);
        if (!$project) {
            return new JsonResponse(['message' => 'Project not found'], Response::HTTP_NOT_FOUND);
        }
        
        $existingBookmark = $this->bookmarkRepository->findOneBy([
            'user' => $user,
            'project' => $project
        ]);
        
        if ($existingBookmark) {
            $this->entityManager->remove($existingBookmark);
            $this->entityManager->flush();
            return new JsonResponse(['message' => 'Bookmark removed'], Response::HTTP_OK);
        }
        
        $bookmark = new Bookmark();
        $bookmark->setUser($user);
        $bookmark->setProject($project);
        
        $this->entityManager->persist($bookmark);
        $this->entityManager->flush();
        
        $data = $this->serializer->serialize($bookmark, 'json', ['groups' => 'bookmark:read']);
        
        return new JsonResponse($data, Response::HTTP_CREATED, [], true);
    }

    #[Route('/project/{projectId}', name: 'check_bookmark', methods: ['GET'])]
    public function checkBookmark(int $projectId): JsonResponse
    {
        $this->denyAccessUnlessGranted('ROLE_USER');
        $user = $this->getUser();
        
        $project = $this->projectRepository->find($projectId);
        if (!$project) {
            return new JsonResponse(['message' => 'Project not found'], Response::HTTP_NOT_FOUND);
        }
        
        $bookmark = $this->bookmarkRepository->findOneBy([
            'user' => $user,
            'project' => $project
        ]);
        
        return new JsonResponse(['bookmarked' => $bookmark !== null], Response::HTTP_OK);
    }
} 