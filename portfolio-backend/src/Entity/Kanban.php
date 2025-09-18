<?php

namespace App\Entity;

use App\Repository\KanbanRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: KanbanRepository::class)]
#[ORM\Table(name: 'kanban')]
class Kanban
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['kanban:read', 'kanban:write'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['kanban:read', 'kanban:write'])]
    private ?string $name = null;

    #[ORM\Column]
    #[Groups(['kanban:read'])]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column]
    #[Groups(['kanban:read'])]
    private ?\DateTimeImmutable $updatedAt = null;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $owner = null;

    #[ORM\OneToMany(mappedBy: 'kanban', targetEntity: KanbanColumn::class, orphanRemoval: true)]
    #[ORM\OrderBy(['position' => 'ASC'])]
    #[Groups(['kanban:read'])]
    private Collection $columns;

    #[ORM\OneToMany(mappedBy: 'kanban', targetEntity: KanbanCardTag::class, orphanRemoval: true)]
    #[Groups(['kanban:read'])]
    private Collection $tags;

    public function __construct()
    {
        $this->columns = new ArrayCollection();
        $this->tags = new ArrayCollection();
        $this->createdAt = new \DateTimeImmutable();
        $this->updatedAt = new \DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;
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
     * @return Collection<int, KanbanColumn>
     */
    public function getColumns(): Collection
    {
        return $this->columns;
    }

    public function addColumn(KanbanColumn $column): static
    {
        if (!$this->columns->contains($column)) {
            $this->columns->add($column);
            $column->setKanban($this);
        }
        return $this;
    }

    public function removeColumn(KanbanColumn $column): static
    {
        if ($this->columns->removeElement($column)) {
            if ($column->getKanban() === $this) {
                $column->setKanban(null);
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
            $tag->setKanban($this);
        }
        return $this;
    }

    public function removeTag(KanbanCardTag $tag): static
    {
        if ($this->tags->removeElement($tag)) {
            if ($tag->getKanban() === $this) {
                $tag->setKanban(null);
            }
        }
        return $this;
    }

    #[ORM\PreUpdate]
    public function updateTimestamp(): void
    {
        $this->updatedAt = new \DateTimeImmutable();
    }
}
