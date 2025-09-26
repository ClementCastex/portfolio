<?php

namespace App\Entity;

use App\Repository\NoteAssetRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: NoteAssetRepository::class)]
#[ORM\Table(name: 'note_asset')]
class NoteAsset
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['note:read', 'asset:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 20)]
    #[Groups(['note:read', 'asset:read'])]
    private ?string $type = null; // 'image' | 'file'

    #[ORM\Column(length: 255)]
    #[Groups(['note:read', 'asset:read'])]
    private ?string $filename = null;

    #[ORM\Column(length: 100)]
    #[Groups(['note:read', 'asset:read'])]
    private ?string $mime = null;

    #[ORM\Column]
    #[Groups(['note:read', 'asset:read'])]
    private ?int $size = null;

    #[ORM\Column(length: 500)]
    private ?string $storagePath = null;

    #[ORM\Column]
    #[Groups(['note:read', 'asset:read'])]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\ManyToOne(targetEntity: Note::class, inversedBy: 'assets')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Note $note = null;

    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(string $type): static
    {
        $this->type = $type;
        return $this;
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

    public function getNote(): ?Note
    {
        return $this->note;
    }

    public function setNote(?Note $note): static
    {
        $this->note = $note;
        return $this;
    }

    #[Groups(['note:read', 'asset:read'])]
    public function getUrl(): string
    {
        return '/uploads/notes/' . $this->filename;
    }
}
