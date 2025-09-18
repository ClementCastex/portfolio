<?php

namespace App\Entity;

use App\Repository\KanbanCardFileRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: KanbanCardFileRepository::class)]
#[ORM\Table(name: 'kanban_card_file')]
class KanbanCardFile
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['kanban:read', 'card:read', 'file:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['kanban:read', 'card:read', 'file:read'])]
    private ?string $filename = null;

    #[ORM\Column(length: 100)]
    #[Groups(['kanban:read', 'card:read', 'file:read'])]
    private ?string $mime = null;

    #[ORM\Column]
    #[Groups(['kanban:read', 'card:read', 'file:read'])]
    private ?int $size = null;

    #[ORM\Column(length: 500)]
    private ?string $storagePath = null;

    #[ORM\Column]
    #[Groups(['kanban:read', 'card:read', 'file:read'])]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\ManyToOne(targetEntity: KanbanCard::class, inversedBy: 'files')]
    #[ORM\JoinColumn(nullable: false)]
    private ?KanbanCard $card = null;

    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getFilename(): ?string
    {
        return $this->filename;
    }

    public function setFilename(string $filename): static
    {
        $this->filename = $filename;
        return $this;
    }

    public function getMime(): ?string
    {
        return $this->mime;
    }

    public function setMime(string $mime): static
    {
        $this->mime = $mime;
        return $this;
    }

    public function getSize(): ?int
    {
        return $this->size;
    }

    public function setSize(int $size): static
    {
        $this->size = $size;
        return $this;
    }

    public function getStoragePath(): ?string
    {
        return $this->storagePath;
    }

    public function setStoragePath(string $storagePath): static
    {
        $this->storagePath = $storagePath;
        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function getCard(): ?KanbanCard
    {
        return $this->card;
    }

    public function setCard(?KanbanCard $card): static
    {
        $this->card = $card;
        return $this;
    }

    #[Groups(['kanban:read', 'card:read', 'file:read'])]
    public function getUrl(): string
    {
        return '/uploads/kanban/' . $this->filename;
    }

    #[Groups(['kanban:read', 'card:read', 'file:read'])]
    public function getIsImage(): bool
    {
        return str_starts_with($this->mime ?? '', 'image/');
    }
}
