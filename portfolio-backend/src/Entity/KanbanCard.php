<?php

namespace App\Entity;

use App\Repository\KanbanCardRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: KanbanCardRepository::class)]
#[ORM\Table(name: 'kanban_card')]
class KanbanCard
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['kanban:read', 'card:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['kanban:read', 'card:read', 'card:write'])]
    private ?string $title = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['kanban:read', 'card:read', 'card:write'])]
    private ?string $descriptionHtml = null;

    #[ORM\Column(type: Types::DATETIME_IMMUTABLE, nullable: true)]
    #[Groups(['kanban:read', 'card:read', 'card:write'])]
    private ?\DateTimeImmutable $dueAt = null;

    #[ORM\Column]
    #[Groups(['kanban:read', 'card:read', 'card:write'])]
    private ?int $position = null;

    #[ORM\Column]
    #[Groups(['kanban:read', 'card:read'])]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column]
    #[Groups(['kanban:read', 'card:read'])]
    private ?\DateTimeImmutable $updatedAt = null;

    #[ORM\Column(length: 20, nullable: true)]
    #[Groups(['kanban:read', 'card:read', 'card:write'])]
    private ?string $priority = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['kanban:read', 'card:read', 'card:write'])]
    private ?int $estimatedHours = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['kanban:read', 'card:read', 'card:write'])]
    private ?int $loggedHours = null;

    #[ORM\Column(type: Types::JSON, nullable: true)]
    #[Groups(['kanban:read', 'card:read', 'card:write'])]
    private ?array $checklist = null;

    #[ORM\Column(type: Types::JSON, nullable: true)]
    #[Groups(['kanban:read', 'card:read'])]
    private ?array $assignedUserIds = null;

    #[ORM\ManyToOne(targetEntity: KanbanColumn::class, inversedBy: 'cards')]
    #[ORM\JoinColumn(nullable: false)]
    private ?KanbanColumn $column = null;

    #[ORM\OneToMany(mappedBy: 'card', targetEntity: KanbanCardFile::class, orphanRemoval: true)]
    #[Groups(['kanban:read', 'card:read'])]
    private Collection $files;

    #[ORM\OneToMany(mappedBy: 'card', targetEntity: KanbanCardLink::class, orphanRemoval: true)]
    #[Groups(['kanban:read', 'card:read'])]
    private Collection $links;

    #[ORM\ManyToMany(targetEntity: KanbanCardTag::class, inversedBy: 'cards')]
    #[ORM\JoinTable(name: 'kanban_card_tag_links')]
    #[Groups(['kanban:read', 'card:read', 'card:write'])]
    private Collection $tags;

    #[ORM\OneToMany(mappedBy: 'card', targetEntity: KanbanCardComment::class, orphanRemoval: true)]
    #[ORM\OrderBy(['createdAt' => 'DESC'])]
    #[Groups(['kanban:read', 'card:read'])]
    private Collection $comments;

    public function __construct()
    {
        $this->files = new ArrayCollection();
        $this->links = new ArrayCollection();
        $this->tags = new ArrayCollection();
        $this->comments = new ArrayCollection();
        $this->createdAt = new \DateTimeImmutable();
        $this->updatedAt = new \DateTimeImmutable();
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

    public function getDescriptionHtml(): ?string
    {
        return $this->descriptionHtml;
    }

    public function setDescriptionHtml(?string $descriptionHtml): static
    {
        $this->descriptionHtml = $descriptionHtml;
        $this->updatedAt = new \DateTimeImmutable();
        return $this;
    }

    public function getDueAt(): ?\DateTimeImmutable
    {
        return $this->dueAt;
    }

    public function setDueAt(?\DateTimeImmutable $dueAt): static
    {
        $this->dueAt = $dueAt;
        $this->updatedAt = new \DateTimeImmutable();
        return $this;
    }

    public function getPosition(): ?int
    {
        return $this->position;
    }

    public function setPosition(int $position): static
    {
        $this->position = $position;
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

    public function getColumn(): ?KanbanColumn
    {
        return $this->column;
    }

    public function setColumn(?KanbanColumn $column): static
    {
        $this->column = $column;
        return $this;
    }

    /**
     * @return Collection<int, KanbanCardFile>
     */
    public function getFiles(): Collection
    {
        return $this->files;
    }

    public function addFile(KanbanCardFile $file): static
    {
        if (!$this->files->contains($file)) {
            $this->files->add($file);
            $file->setCard($this);
        }
        return $this;
    }

    public function removeFile(KanbanCardFile $file): static
    {
        if ($this->files->removeElement($file)) {
            if ($file->getCard() === $this) {
                $file->setCard(null);
            }
        }
        return $this;
    }

    /**
     * @return Collection<int, KanbanCardLink>
     */
    public function getLinks(): Collection
    {
        return $this->links;
    }

    public function addLink(KanbanCardLink $link): static
    {
        if (!$this->links->contains($link)) {
            $this->links->add($link);
            $link->setCard($this);
        }
        return $this;
    }

    public function removeLink(KanbanCardLink $link): static
    {
        if ($this->links->removeElement($link)) {
            if ($link->getCard() === $this) {
                $link->setCard(null);
            }
        }
        return $this;
    }

    /**
     * @return Collection<int, KanbanCardTag>
     */
    public function getTags(): Collection
    {
        return $this->tags;
    }

    public function addTag(KanbanCardTag $tag): static
    {
        if (!$this->tags->contains($tag)) {
            $this->tags->add($tag);
        }
        return $this;
    }

    public function removeTag(KanbanCardTag $tag): static
    {
        $this->tags->removeElement($tag);
        return $this;
    }

    /**
     * @return Collection<int, KanbanCardComment>
     */
    public function getComments(): Collection
    {
        return $this->comments;
    }

    public function addComment(KanbanCardComment $comment): static
    {
        if (!$this->comments->contains($comment)) {
            $this->comments->add($comment);
            $comment->setCard($this);
        }
        return $this;
    }

    public function removeComment(KanbanCardComment $comment): static
    {
        if ($this->comments->removeElement($comment)) {
            if ($comment->getCard() === $this) {
                $comment->setCard(null);
            }
        }
        return $this;
    }

    public function getPriority(): ?string
    {
        return $this->priority;
    }

    public function setPriority(?string $priority): static
    {
        $this->priority = $priority;
        $this->updatedAt = new \DateTimeImmutable();
        return $this;
    }

    public function getEstimatedHours(): ?int
    {
        return $this->estimatedHours;
    }

    public function setEstimatedHours(?int $estimatedHours): static
    {
        $this->estimatedHours = $estimatedHours;
        $this->updatedAt = new \DateTimeImmutable();
        return $this;
    }

    public function getLoggedHours(): ?int
    {
        return $this->loggedHours;
    }

    public function setLoggedHours(?int $loggedHours): static
    {
        $this->loggedHours = $loggedHours;
        $this->updatedAt = new \DateTimeImmutable();
        return $this;
    }

    public function getChecklist(): ?array
    {
        return $this->checklist;
    }

    public function setChecklist(?array $checklist): static
    {
        $this->checklist = $checklist;
        $this->updatedAt = new \DateTimeImmutable();
        return $this;
    }

    public function getAssignedUserIds(): ?array
    {
        return $this->assignedUserIds;
    }

    public function setAssignedUserIds(?array $assignedUserIds): static
    {
        $this->assignedUserIds = $assignedUserIds;
        $this->updatedAt = new \DateTimeImmutable();
        return $this;
    }

    #[Groups(['kanban:read', 'card:read'])]
    public function getIsOverdue(): bool
    {
        return $this->dueAt && $this->dueAt < new \DateTimeImmutable();
    }

    #[Groups(['kanban:read', 'card:read'])]
    public function getChecklistProgress(): array
    {
        if (!$this->checklist) {
            return ['completed' => 0, 'total' => 0, 'percentage' => 0];
        }

        $total = count($this->checklist);
        $completed = count(array_filter($this->checklist, fn($item) => $item['completed'] ?? false));
        $percentage = $total > 0 ? round(($completed / $total) * 100) : 0;

        return [
            'completed' => $completed,
            'total' => $total,
            'percentage' => $percentage,
        ];
    }

    #[Groups(['kanban:read', 'card:read'])]
    public function getPriorityColor(): string
    {
        return match($this->priority) {
            'high' => '#f44336',    // Rouge
            'medium' => '#ff9800',  // Orange
            'low' => '#4caf50',     // Vert
            default => '#9e9e9e',   // Gris
        };
    }

    #[ORM\PreUpdate]
    public function updateTimestamp(): void
    {
        $this->updatedAt = new \DateTimeImmutable();
    }
}
