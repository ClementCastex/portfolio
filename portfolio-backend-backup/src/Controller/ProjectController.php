<?php

namespace App\Controller;

use App\Entity\Project;
use App\Repository\ProjectRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\String\Slugger\SluggerInterface;

#[Route('/api/projects')]
class ProjectController extends AbstractController
{
    private string $uploadDirectory;

    public function __construct(
        private EntityManagerInterface $entityManager,
        private ProjectRepository $projectRepository,
        private SerializerInterface $serializer,
        private SluggerInterface $slugger
    ) {
        $this->uploadDirectory = __DIR__ . '/../../public/uploads/projects';
    }

    #[Route('', name: 'get_projects', methods: ['GET'])]
    public function getProjects(): JsonResponse
    {
        $projects = $this->projectRepository->findAll();
        $data = $this->serializer->serialize($projects, 'json', ['groups' => 'project:read']);
        
        return new JsonResponse($data, Response::HTTP_OK, [], true);
    }

    #[Route('/{id}', name: 'get_project', methods: ['GET'])]
    public function getProject(int $id): JsonResponse
    {
        $project = $this->projectRepository->find($id);
        
        if (!$project) {
            return new JsonResponse(['message' => 'Project not found'], Response::HTTP_NOT_FOUND);
        }

        $data = $this->serializer->serialize($project, 'json', ['groups' => 'project:read']);
        
        return new JsonResponse($data, Response::HTTP_OK, [], true);
    }

    #[Route('', name: 'create_project', methods: ['POST'])]
    public function createProject(Request $request): JsonResponse
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');
        
        $data = json_decode($request->getContent(), true);
        $project = new Project();
        
        // Set project properties from request data
        $project->setTitle($data['title']);
        $project->setShortDescription($data['shortDescription']);
        $project->setLongDescription($data['longDescription']);
        $project->setStatus($data['status']);
        $project->setCategories($data['categories']);
        if (isset($data['websiteUrl'])) {
            $project->setWebsiteUrl($data['websiteUrl']);
        }
        if (isset($data['githubUrl'])) {
            $project->setGithubUrl($data['githubUrl']);
        }
        
        $this->entityManager->persist($project);
        $this->entityManager->flush();
        
        $data = $this->serializer->serialize($project, 'json', ['groups' => 'project:read']);
        
        return new JsonResponse($data, Response::HTTP_CREATED, [], true);
    }

    #[Route('/{id}', name: 'update_project', methods: ['PUT'])]
    public function updateProject(Request $request, int $id): JsonResponse
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');
        
        $project = $this->projectRepository->find($id);
        if (!$project) {
            return new JsonResponse(['message' => 'Project not found'], Response::HTTP_NOT_FOUND);
        }
        
        $data = json_decode($request->getContent(), true);
        
        // Update project properties
        if (isset($data['title'])) {
            $project->setTitle($data['title']);
        }
        if (isset($data['shortDescription'])) {
            $project->setShortDescription($data['shortDescription']);
        }
        if (isset($data['longDescription'])) {
            $project->setLongDescription($data['longDescription']);
        }
        if (isset($data['status'])) {
            $project->setStatus($data['status']);
        }
        if (isset($data['categories'])) {
            $project->setCategories($data['categories']);
        }
        if (isset($data['websiteUrl'])) {
            $project->setWebsiteUrl($data['websiteUrl']);
        }
        if (isset($data['githubUrl'])) {
            $project->setGithubUrl($data['githubUrl']);
        }
        
        $this->entityManager->flush();
        
        $data = $this->serializer->serialize($project, 'json', ['groups' => 'project:read']);
        
        return new JsonResponse($data, Response::HTTP_OK, [], true);
    }

    #[Route('/{id}', name: 'delete_project', methods: ['DELETE'])]
    public function deleteProject(int $id): JsonResponse
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');
        
        $project = $this->projectRepository->find($id);
        if (!$project) {
            return new JsonResponse(['message' => 'Project not found'], Response::HTTP_NOT_FOUND);
        }
        
        $this->entityManager->remove($project);
        $this->entityManager->flush();
        
        return new JsonResponse(null, Response::HTTP_NO_CONTENT);
    }

    #[Route('/{id}/images', name: 'upload_project_images', methods: ['POST'])]
    public function uploadImages(Request $request, int $id): JsonResponse
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');
        
        $project = $this->projectRepository->find($id);
        if (!$project) {
            return new JsonResponse(['message' => 'Project not found'], Response::HTTP_NOT_FOUND);
        }

        $uploadedFiles = $request->files->get('images');
        if (!$uploadedFiles) {
            return new JsonResponse(['message' => 'No images provided'], Response::HTTP_BAD_REQUEST);
        }

        $images = [];
        foreach ($uploadedFiles as $uploadedFile) {
            $originalFilename = pathinfo($uploadedFile->getClientOriginalName(), PATHINFO_FILENAME);
            $safeFilename = $this->slugger->slug($originalFilename);
            $newFilename = $safeFilename . '-' . uniqid() . '.' . $uploadedFile->guessExtension();

            try {
                $uploadedFile->move(
                    $this->uploadDirectory,
                    $newFilename
                );
                $images[] = '/uploads/projects/' . $newFilename;
            } catch (\Exception $e) {
                return new JsonResponse(['message' => 'Error uploading file'], Response::HTTP_INTERNAL_SERVER_ERROR);
            }
        }

        // Ajouter les nouvelles images aux images existantes
        $currentImages = $project->getImages();
        $project->setImages(array_merge($currentImages, $images));
        $project->setUpdatedAt();
        
        $this->entityManager->flush();

        $data = $this->serializer->serialize($project, 'json', ['groups' => 'project:read']);
        return new JsonResponse($data, Response::HTTP_OK, [], true);
    }

    #[Route('/{id}/images/{index}', name: 'delete_project_image', methods: ['DELETE'])]
    public function deleteImage(int $id, int $index): JsonResponse
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');
        
        $project = $this->projectRepository->find($id);
        if (!$project) {
            return new JsonResponse(['message' => 'Project not found'], Response::HTTP_NOT_FOUND);
        }

        $images = $project->getImages();
        if (!isset($images[$index])) {
            return new JsonResponse(['message' => 'Image not found'], Response::HTTP_NOT_FOUND);
        }

        // Supprimer le fichier physique
        $imagePath = $this->getParameter('kernel.project_dir') . '/public' . $images[$index];
        if (file_exists($imagePath)) {
            unlink($imagePath);
        }

        // Supprimer l'image du tableau
        array_splice($images, $index, 1);
        $project->setImages($images);
        $project->setUpdatedAt();
        
        $this->entityManager->flush();

        return new JsonResponse(null, Response::HTTP_NO_CONTENT);
    }
} 