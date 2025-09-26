<?php

namespace App\Entity;

use App\Repository\NoteRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: NoteRepository::class)]
#[ORM\Table(name: 'note')]
class Note
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['note:read', 'note:write'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['note:read', 'note:write'])]
    private ?string $title = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['note:read', 'note:write'])]
    private ?string $contentHtml = null;

    #[ORM\Column]
    #[Groups(['note:read'])]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column]
    #[Groups(['note:read'])]
    private ?\DateTimeImmutable $updatedAt = null;

    #[ORM\Column]
    #[Groups(['note:read', 'note:write'])]
    private ?bool $isArchived = false;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $owner = null;

    #[ORM\OneToMany(mappedBy: 'note', targetEntity: NoteAsset::class, orphanRemoval: true)]
    #[Groups(['note:read'])]
    private Collection $assets;

    #[ORM\ManyToMany(targetEntity: NoteTag::class, inversedBy: 'notes')]
    #[ORM\JoinTable(name: 'note_tag_links')]
    #[Groups(['note:read', 'note:write'])]
    private Collection $tags;

    #[ORM\Column]
    #[Groups(['note:read'])]
    private ?\DateTimeImmutable $lastSyncAt = null;

    public function __construct()
    {
        $this->assets = new ArrayCollection();
        $this->tags = new ArrayCollection();
        $this->createdAt = new \DateTimeImmutable();
        $this->updatedAt = new \DateTimeImmutable();
        $this->lastSyncAt = new \DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): static
    {
        $this->title = $title;
        $this->updatedAt = new \DateTimeImmutable();
        return $this;
    }

    public function getContentHtml(): ?string
    {
        return $this->contentHtml;
    }

    public function setContentHtml(?string $contentHtml): static
    {
        $this->contentHtml = $contentHtml;
        $this->updatedAt = new \DateTimeImmutable();
        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function getUpdatedAt(): ?\DateTimeImmutable
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(\DateTimeImmutable $updatedAt): static
    {
        $this->updatedAt = $updatedAt;
        return $this;
    }

    public function isArchived(): ?bool
    {
        return $this->isArchived;
    }

    public function setArchived(bool $isArchived): static
    {
        $this->isArchived = $isArchived;
        return $this;
    }

    public function getOwner(): ?User
    {
        return $this->owner;
    }

    public function setOwner(?User $owner): static
    {
        $this->owner = $owner;
        return $this;
    }

    /**
     * @return Collection<int, NoteAsset>
     */
    public function getAssets(): Collection
    {
        return $this->assets;
    }

    public function addAsset(NoteAsset $asset): static
    {
        if (!$this->assets->contains($asset)) {
            $this->assets->add($asset);
            $asset->setNote($this);
        }
        return $this;
    }

    public function removeAsset(NoteAsset $asset): static
    {
        if ($this->assets->removeElement($asset)) {
            if ($asset->getNote() === $this) {
                $asset->setNote(null);
            }
        }
        return $this;
    }

    /**
     * @return Collection<int, NoteTag>
     */
    public function getTags(): Collection
    {
        return $this->tags;
    }

    public function addTag(NoteTag $tag): static
    {
        if (!$this->tags->contains($tag)) {
            $this->tags->add($tag);
        }
        return $this;
    }

    public function removeTag(NoteTag $tag): static
    {
        $this->tags->removeElement($tag);
        return $this;
    }

    public function getLastSyncAt(): ?\DateTimeImmutable
    {
        return $this->lastSyncAt;
    }

    public function setLastSyncAt(\DateTimeImmutable $lastSyncAt): static
    {
        $this->lastSyncAt = $lastSyncAt;
        return $this;
    }

    #[ORM\PreUpdate]
    public function updateTimestamp(): void
    {
        $this->updatedAt = new \DateTimeImmutable();
    }
}
