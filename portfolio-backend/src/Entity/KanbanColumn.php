<?php

namespace App\Entity;

use App\Repository\KanbanColumnRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: KanbanColumnRepository::class)]
#[ORM\Table(name: 'kanban_column')]
class KanbanColumn
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['kanban:read', 'column:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['kanban:read', 'column:read', 'column:write'])]
    private ?string $name = null;

    #[ORM\Column]
    #[Groups(['kanban:read', 'column:read', 'column:write'])]
    private ?int $position = null;

    #[ORM\ManyToOne(targetEntity: Kanban::class, inversedBy: 'columns')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Kanban $kanban = null;

    #[ORM\OneToMany(mappedBy: 'column', targetEntity: KanbanCard::class, orphanRemoval: true)]
    #[ORM\OrderBy(['position' => 'ASC'])]
    #[Groups(['kanban:read', 'column:read'])]
    private Collection $cards;

    public function __construct()
    {
        $this->cards = new ArrayCollection();
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

    public function getKanban(): ?Kanban
    {
        return $this->kanban;
    }

    public function setKanban(?Kanban $kanban): static
    {
        $this->kanban = $kanban;
        return $this;
    }

    /**
     * @return Collection<int, KanbanCard>
     */
    public function getCards(): Collection
    {
        return $this->cards;
    }

    public function addCard(KanbanCard $card): static
    {
        if (!$this->cards->contains($card)) {
            $this->cards->add($card);
            $card->setColumn($this);
        }
        return $this;
    }

    public function removeCard(KanbanCard $card): static
    {
        if ($this->cards->removeElement($card)) {
            if ($card->getColumn() === $this) {
                $card->setColumn(null);
            }
        }
        return $this;
    }
}
