<?php

namespace App\Controller;

use App\Entity\KanbanCard;
use App\Entity\KanbanCardFile;
use App\Entity\KanbanCardLink;
use App\Repository\KanbanCardRepository;
use App\Repository\KanbanColumnRepository;
use App\Repository\KanbanCardTagRepository;
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

#[IsGranted('ROLE_ADMIN')]
class KanbanCardController extends AbstractController
{
    private string $uploadDirectory;

    // Types MIME autorisés pour la sécurité
    private const ALLOWED_MIME_TYPES = [
        'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
        'application/pdf', 'text/plain', 'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    // Extensions autorisées
    private const ALLOWED_EXTENSIONS = [
        'jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf', 'txt', 'doc', 'docx'
    ];

    // Taille maximale (10MB)
    private const MAX_FILE_SIZE = 10 * 1024 * 1024;

    public function __construct(
        private EntityManagerInterface $entityManager,
        private KanbanCardRepository $cardRepository,
        private KanbanColumnRepository $columnRepository,
        private KanbanCardTagRepository $tagRepository,
        private SerializerInterface $serializer,
        private SluggerInterface $slugger
    ) {
        $this->uploadDirectory = __DIR__ . '/../../public/uploads/kanban';
        if (!is_dir($this->uploadDirectory)) {
            mkdir($this->uploadDirectory, 0755, true);
        }
    }

    /**
     * Valide un fichier uploadé selon les critères de sécurité
     */
    private function validateUploadedFile(UploadedFile $file): array
    {
        $errors = [];

        // Vérifier la taille
        if ($file->getSize() > self::MAX_FILE_SIZE) {
            $errors[] = 'Fichier trop volumineux (maximum 10MB)';
        }

        // Vérifier le type MIME déclaré
        $declaredMime = $file->getMimeType();
        if (!in_array($declaredMime, self::ALLOWED_MIME_TYPES)) {
            $errors[] = 'Type de fichier non autorisé: ' . $declaredMime;
        }

        // Vérifier le type MIME réel (plus sécurisé)
        $realMime = mime_content_type($file->getPathname());
        if (!in_array($realMime, self::ALLOWED_MIME_TYPES)) {
            $errors[] = 'Type de fichier réel non autorisé: ' . $realMime;
        }

        // Vérifier l'extension
        $extension = $file->guessExtension();
        if (!in_array($extension, self::ALLOWED_EXTENSIONS)) {
            $errors[] = 'Extension de fichier non autorisée: ' . $extension;
        }

        // Vérifier que les types MIME déclaré et réel correspondent
        if ($declaredMime !== $realMime) {
            $errors[] = 'Incohérence entre type déclaré et type réel du fichier';
        }

        return $errors;
    }

    #[Route('/api/columns/{columnId}/cards', name: 'create_card', methods: ['POST'])]
    public function createCard(int $columnId, Request $request): JsonResponse
    {
        $user = $this->getUser();
        $column = $this->columnRepository->findOneBy(['id' => $columnId]);
        
        if (!$column || $column->getKanban()->getOwner() !== $user) {
            return new JsonResponse(['message' => 'Column not found'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);

        $card = new KanbanCard();
        $card->setTitle($data['title'] ?? 'Nouvelle carte');
        $card->setDescriptionHtml($data['descriptionHtml'] ?? '');
        $card->setPosition($data['position'] ?? $column->getCards()->count());
        $card->setColumn($column);

        if (isset($data['dueAt'])) {
            $card->setDueAt(new \DateTimeImmutable($data['dueAt']));
        }

        if (isset($data['priority'])) {
            $card->setPriority($data['priority']);
        }

        if (isset($data['estimatedHours'])) {
            $card->setEstimatedHours($data['estimatedHours']);
        }

        if (isset($data['loggedHours'])) {
            $card->setLoggedHours($data['loggedHours']);
        }

        if (isset($data['checklist'])) {
            $card->setChecklist($data['checklist']);
        }

        // Gestion des tags
        if (isset($data['tagIds']) && is_array($data['tagIds'])) {
            foreach ($data['tagIds'] as $tagId) {
                $tag = $this->tagRepository->findOneBy(['id' => $tagId]);
                if ($tag && $tag->getKanban() === $column->getKanban()) {
                    $card->addTag($tag);
                }
            }
        }

        $this->entityManager->persist($card);
        $this->entityManager->flush();

        $responseData = $this->serializer->serialize($card, 'json', ['groups' => 'card:read']);
        
        return new JsonResponse($responseData, Response::HTTP_CREATED, [], true);
    }

    #[Route('/api/cards/{id}', name: 'update_card', methods: ['PATCH'])]
    public function updateCard(int $id, Request $request): JsonResponse
    {
        $user = $this->getUser();
        $card = $this->cardRepository->findOneBy(['id' => $id]);
        
        if (!$card || $card->getColumn()->getKanban()->getOwner() !== $user) {
            return new JsonResponse(['message' => 'Card not found'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);

        if (isset($data['title'])) {
            $card->setTitle($data['title']);
        }

        if (isset($data['descriptionHtml'])) {
            $card->setDescriptionHtml($data['descriptionHtml']);
        }

        if (isset($data['dueAt'])) {
            $card->setDueAt($data['dueAt'] ? new \DateTimeImmutable($data['dueAt']) : null);
        }

        if (isset($data['priority'])) {
            $card->setPriority($data['priority']);
        }

        if (isset($data['estimatedHours'])) {
            $card->setEstimatedHours($data['estimatedHours']);
        }

        if (isset($data['loggedHours'])) {
            $card->setLoggedHours($data['loggedHours']);
        }

        if (isset($data['checklist'])) {
            $card->setChecklist($data['checklist']);
        }

        if (isset($data['position'])) {
            $card->setPosition($data['position']);
        }

        // Changement de colonne
        if (isset($data['columnId'])) {
            $newColumn = $this->columnRepository->findOneBy(['id' => $data['columnId']]);
            if ($newColumn && $newColumn->getKanban()->getOwner() === $user) {
                $card->setColumn($newColumn);
            }
        }

        // Gestion des tags
        if (isset($data['tagIds'])) {
            // Supprimer tous les tags existants
            foreach ($card->getTags() as $tag) {
                $card->removeTag($tag);
            }
            
            // Ajouter les nouveaux tags
            foreach ($data['tagIds'] as $tagId) {
                $tag = $this->tagRepository->findOneBy(['id' => $tagId]);
                if ($tag && $tag->getKanban() === $card->getColumn()->getKanban()) {
                    $card->addTag($tag);
                }
            }
        }

        $this->entityManager->flush();

        $responseData = $this->serializer->serialize($card, 'json', ['groups' => 'card:read']);
        
        return new JsonResponse($responseData, Response::HTTP_OK, [], true);
    }

    #[Route('/api/cards/{id}', name: 'delete_card', methods: ['DELETE'])]
    public function deleteCard(int $id): JsonResponse
    {
        $user = $this->getUser();
        $card = $this->cardRepository->findOneBy(['id' => $id]);
        
        if (!$card || $card->getColumn()->getKanban()->getOwner() !== $user) {
            return new JsonResponse(['message' => 'Card not found'], Response::HTTP_NOT_FOUND);
        }

        $this->entityManager->remove($card);
        $this->entityManager->flush();

        return new JsonResponse(['message' => 'Card deleted successfully']);
    }

    #[Route('/api/cards/{id}/files', name: 'upload_card_file', methods: ['POST'])]
    public function uploadFile(int $id, Request $request): JsonResponse
    {
        $user = $this->getUser();
        $card = $this->cardRepository->findOneBy(['id' => $id]);
        
        if (!$card || $card->getColumn()->getKanban()->getOwner() !== $user) {
            return new JsonResponse(['message' => 'Card not found'], Response::HTTP_NOT_FOUND);
        }

        $uploadedFile = $request->files->get('file');
        
        if (!$uploadedFile) {
            return new JsonResponse(['message' => 'No file uploaded'], Response::HTTP_BAD_REQUEST);
        }

        // Validation sécurisée du fichier
        $validationErrors = $this->validateUploadedFile($uploadedFile);
        if (!empty($validationErrors)) {
            return new JsonResponse([
                'message' => 'Fichier non valide',
                'errors' => $validationErrors
            ], Response::HTTP_BAD_REQUEST);
        }

        $originalFilename = pathinfo($uploadedFile->getClientOriginalName(), PATHINFO_FILENAME);
        $safeFilename = $this->slugger->slug($originalFilename);
        $newFilename = $safeFilename . '-' . uniqid() . '.' . $uploadedFile->guessExtension();

        try {
            $uploadedFile->move($this->uploadDirectory, $newFilename);
        } catch (FileException $e) {
            return new JsonResponse(['message' => 'Upload failed'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        $file = new KanbanCardFile();
        $file->setCard($card);
        $file->setFilename($newFilename);
        $file->setMime($uploadedFile->getMimeType());
        $file->setSize($uploadedFile->getSize());
        $file->setStoragePath($this->uploadDirectory . '/' . $newFilename);

        $this->entityManager->persist($file);
        $this->entityManager->flush();

        $responseData = $this->serializer->serialize($file, 'json', ['groups' => 'file:read']);
        
        return new JsonResponse($responseData, Response::HTTP_CREATED, [], true);
    }

    #[Route('/api/cards/{id}/links', name: 'create_card_link', methods: ['POST'])]
    public function createLink(int $id, Request $request): JsonResponse
    {
        $user = $this->getUser();
        $card = $this->cardRepository->findOneBy(['id' => $id]);
        
        if (!$card || $card->getColumn()->getKanban()->getOwner() !== $user) {
            return new JsonResponse(['message' => 'Card not found'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);
        $url = $data['url'] ?? '';

        if (!filter_var($url, FILTER_VALIDATE_URL)) {
            return new JsonResponse(['message' => 'Invalid URL'], Response::HTTP_BAD_REQUEST);
        }

        $link = new KanbanCardLink();
        $link->setCard($card);
        $link->setUrl($url);

        // Fetch metadata (title, favicon) from URL
        $link->setTitle($this->fetchUrlTitle($url));

        $this->entityManager->persist($link);
        $this->entityManager->flush();

        $responseData = $this->serializer->serialize($link, 'json', ['groups' => 'link:read']);
        
        return new JsonResponse($responseData, Response::HTTP_CREATED, [], true);
    }

    #[Route('/api/calendar', name: 'get_calendar_cards', methods: ['GET'])]
    public function getCalendarCards(Request $request): JsonResponse
    {
        $user = $this->getUser();
        $from = new \DateTimeImmutable($request->query->get('from', 'now'));
        $to = new \DateTimeImmutable($request->query->get('to', '+1 month'));

        $cards = $this->cardRepository->findCardsWithDueDates($user, $from, $to);
        
        $data = $this->serializer->serialize($cards, 'json', ['groups' => 'card:read']);
        
        return new JsonResponse($data, Response::HTTP_OK, [], true);
    }

    #[Route('/api/files/{id}', name: 'delete_card_file', methods: ['DELETE'])]
    public function deleteFile(int $id): JsonResponse
    {
        $user = $this->getUser();
        $file = $this->entityManager->getRepository(KanbanCardFile::class)->find($id);
        
        if (!$file || $file->getCard()->getColumn()->getKanban()->getOwner() !== $user) {
            return new JsonResponse(['message' => 'File not found'], Response::HTTP_NOT_FOUND);
        }

        // Supprimer le fichier physique
        if (file_exists($file->getStoragePath())) {
            unlink($file->getStoragePath());
        }

        $this->entityManager->remove($file);
        $this->entityManager->flush();

        return new JsonResponse(['message' => 'File deleted successfully']);
    }

    #[Route('/api/links/{id}', name: 'delete_card_link', methods: ['DELETE'])]
    public function deleteLink(int $id): JsonResponse
    {
        $user = $this->getUser();
        $link = $this->entityManager->getRepository(KanbanCardLink::class)->find($id);
        
        if (!$link || $link->getCard()->getColumn()->getKanban()->getOwner() !== $user) {
            return new JsonResponse(['message' => 'Link not found'], Response::HTTP_NOT_FOUND);
        }

        $this->entityManager->remove($link);
        $this->entityManager->flush();

        return new JsonResponse(['message' => 'Link deleted successfully']);
    }

    private function fetchUrlTitle(string $url): ?string
    {
        try {
            $context = stream_context_create([
                'http' => [
                    'timeout' => 5,
                    'user_agent' => 'Mozilla/5.0 (compatible; Portfolio-Bot/1.0)',
                ]
            ]);
            
            $html = file_get_contents($url, false, $context);
            if ($html && preg_match('/<title[^>]*>(.*?)<\/title>/is', $html, $matches)) {
                return trim(html_entity_decode($matches[1]));
            }
        } catch (\Exception $e) {
            // Silently fail and return URL as title
        }
        
        return parse_url($url, PHP_URL_HOST) ?: $url;
    }
}
