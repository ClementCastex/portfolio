<?php

namespace App\Controller;

use App\Entity\Note;
use App\Entity\NoteAsset;
use App\Entity\NoteTag;
use App\Repository\NoteRepository;
use App\Repository\NoteTagRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\String\Slugger\SluggerInterface;
use Symfony\Component\HttpFoundation\File\Exception\FileException;

#[Route('/api/notes')]
#[IsGranted('ROLE_ADMIN')]
class NoteController extends AbstractController
{
    private string $uploadDirectory;

    public function __construct(
        private EntityManagerInterface $entityManager,
        private NoteRepository $noteRepository,
        private NoteTagRepository $noteTagRepository,
        private SerializerInterface $serializer,
        private SluggerInterface $slugger
    ) {
        $this->uploadDirectory = __DIR__ . '/../../public/uploads/notes';
        if (!is_dir($this->uploadDirectory)) {
            mkdir($this->uploadDirectory, 0755, true);
        }
    }

    #[Route('', name: 'get_notes', methods: ['GET'])]
    public function getNotes(Request $request): JsonResponse
    {
        $user = $this->getUser();
        $search = $request->query->get('search');
        $tagId = $request->query->getInt('tagId');
        $archived = $request->query->getBoolean('archived', false);

        $notes = $this->noteRepository->findByOwnerWithFilters($user, $search, $tagId ?: null, $archived);
        
        $data = $this->serializer->serialize($notes, 'json', ['groups' => 'note:read']);
        
        return new JsonResponse($data, Response::HTTP_OK, [], true);
    }

    #[Route('/{id}', name: 'get_note', methods: ['GET'])]
    public function getNote(int $id): JsonResponse
    {
        $user = $this->getUser();
        $note = $this->noteRepository->findOneBy(['id' => $id, 'owner' => $user]);
        
        if (!$note) {
            return new JsonResponse(['message' => 'Note not found'], Response::HTTP_NOT_FOUND);
        }

        $data = $this->serializer->serialize($note, 'json', ['groups' => 'note:read']);
        
        return new JsonResponse($data, Response::HTTP_OK, [], true);
    }

    #[Route('', name: 'create_note', methods: ['POST'])]
    public function createNote(Request $request): JsonResponse
    {
        $user = $this->getUser();
        $data = json_decode($request->getContent(), true);

        $note = new Note();
        $note->setTitle($data['title'] ?? 'Nouvelle note');
        $note->setContentHtml($data['contentHtml'] ?? '');
        $note->setOwner($user);

        // Gestion des tags
        if (isset($data['tagIds']) && is_array($data['tagIds'])) {
            foreach ($data['tagIds'] as $tagId) {
                $tag = $this->noteTagRepository->findOneBy(['id' => $tagId, 'owner' => $user]);
                if ($tag) {
                    $note->addTag($tag);
                }
            }
        }

        $this->entityManager->persist($note);
        $this->entityManager->flush();

        $responseData = $this->serializer->serialize($note, 'json', ['groups' => 'note:read']);
        
        return new JsonResponse($responseData, Response::HTTP_CREATED, [], true);
    }

    #[Route('/{id}', name: 'update_note', methods: ['PATCH'])]
    public function updateNote(int $id, Request $request): JsonResponse
    {
        $user = $this->getUser();
        $note = $this->noteRepository->findOneBy(['id' => $id, 'owner' => $user]);
        
        if (!$note) {
            return new JsonResponse(['message' => 'Note not found'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);

        if (isset($data['title'])) {
            $note->setTitle($data['title']);
        }

        if (isset($data['contentHtml'])) {
            $note->setContentHtml($data['contentHtml']);
        }

        if (isset($data['isArchived'])) {
            $note->setArchived($data['isArchived']);
        }

        // Gestion des tags
        if (isset($data['tagIds'])) {
            // Supprimer tous les tags existants
            foreach ($note->getTags() as $tag) {
                $note->removeTag($tag);
            }
            
            // Ajouter les nouveaux tags
            foreach ($data['tagIds'] as $tagId) {
                $tag = $this->noteTagRepository->findOneBy(['id' => $tagId, 'owner' => $user]);
                if ($tag) {
                    $note->addTag($tag);
                }
            }
        }

        // Marquer comme synchronisé
        $note->setLastSyncAt(new \DateTimeImmutable());

        $this->entityManager->flush();

        $responseData = $this->serializer->serialize($note, 'json', ['groups' => 'note:read']);
        
        return new JsonResponse($responseData, Response::HTTP_OK, [], true);
    }

    #[Route('/{id}', name: 'delete_note', methods: ['DELETE'])]
    public function deleteNote(int $id): JsonResponse
    {
        $user = $this->getUser();
        $note = $this->noteRepository->findOneBy(['id' => $id, 'owner' => $user]);
        
        if (!$note) {
            return new JsonResponse(['message' => 'Note not found'], Response::HTTP_NOT_FOUND);
        }

        $this->entityManager->remove($note);
        $this->entityManager->flush();

        return new JsonResponse(['message' => 'Note deleted successfully']);
    }

    #[Route('/{id}/duplicate', name: 'duplicate_note', methods: ['POST'])]
    public function duplicateNote(int $id): JsonResponse
    {
        $user = $this->getUser();
        $originalNote = $this->noteRepository->findOneBy(['id' => $id, 'owner' => $user]);
        
        if (!$originalNote) {
            return new JsonResponse(['message' => 'Note not found'], Response::HTTP_NOT_FOUND);
        }

        $duplicatedNote = new Note();
        $duplicatedNote->setTitle($originalNote->getTitle() . ' (Copie)');
        $duplicatedNote->setContentHtml($originalNote->getContentHtml());
        $duplicatedNote->setOwner($user);

        // Copier les tags
        foreach ($originalNote->getTags() as $tag) {
            $duplicatedNote->addTag($tag);
        }

        $this->entityManager->persist($duplicatedNote);
        $this->entityManager->flush();

        $responseData = $this->serializer->serialize($duplicatedNote, 'json', ['groups' => 'note:read']);
        
        return new JsonResponse($responseData, Response::HTTP_CREATED, [], true);
    }

    #[Route('/{id}/assets', name: 'upload_note_asset', methods: ['POST'])]
    public function uploadAsset(int $id, Request $request): JsonResponse
    {
        $user = $this->getUser();
        $note = $this->noteRepository->findOneBy(['id' => $id, 'owner' => $user]);
        
        if (!$note) {
            return new JsonResponse(['message' => 'Note not found'], Response::HTTP_NOT_FOUND);
        }

        $uploadedFile = $request->files->get('file');
        
        if (!$uploadedFile) {
            return new JsonResponse(['message' => 'No file uploaded'], Response::HTTP_BAD_REQUEST);
        }

        // Vérification de la taille (max 10MB)
        if ($uploadedFile->getSize() > 10 * 1024 * 1024) {
            return new JsonResponse(['message' => 'File too large (max 10MB)'], Response::HTTP_BAD_REQUEST);
        }

        $originalFilename = pathinfo($uploadedFile->getClientOriginalName(), PATHINFO_FILENAME);
        $safeFilename = $this->slugger->slug($originalFilename);
        $newFilename = $safeFilename . '-' . uniqid() . '.' . $uploadedFile->guessExtension();

        try {
            $uploadedFile->move($this->uploadDirectory, $newFilename);
        } catch (FileException $e) {
            return new JsonResponse(['message' => 'Upload failed'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        $asset = new NoteAsset();
        $asset->setNote($note);
        $asset->setFilename($newFilename);
        $asset->setType(str_starts_with($uploadedFile->getMimeType(), 'image/') ? 'image' : 'file');
        $asset->setMime($uploadedFile->getMimeType());
        $asset->setSize($uploadedFile->getSize());
        $asset->setStoragePath($this->uploadDirectory . '/' . $newFilename);

        $this->entityManager->persist($asset);
        $this->entityManager->flush();

        $responseData = $this->serializer->serialize($asset, 'json', ['groups' => 'asset:read']);
        
        return new JsonResponse($responseData, Response::HTTP_CREATED, [], true);
    }
}
