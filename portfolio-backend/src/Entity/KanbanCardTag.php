<?php

namespace App\Entity;

use App\Repository\KanbanCardTagRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: KanbanCardTagRepository::class)]
#[ORM\Table(name: 'kanban_card_tag')]
class KanbanCardTag
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['kanban:read', 'tag:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 100)]
    #[Groups(['kanban:read', 'tag:read', 'tag:write'])]
    private ?string $name = null;

    #[ORM\Column(length: 7)]
    #[Groups(['kanban:read', 'tag:read', 'tag:write'])]
    private ?string $colorHex = null;

    #[ORM\ManyToOne(targetEntity: Kanban::class, inversedBy: 'tags')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Kanban $kanban = null;

    #[ORM\ManyToMany(targetEntity: KanbanCard::class, mappedBy: 'tags')]
    private Collection $cards;

    #[ORM\Column]
    #[Groups(['kanban:read', 'tag:read'])]
    private ?\DateTimeImmutable $createdAt = null;

    public function __construct()
    {
        $this->cards = new ArrayCollection();
        $this->createdAt = new \DateTimeImmutable();
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

    public function getColorHex(): ?string
    {
        return $this->colorHex;
    }

    public function setColorHex(string $colorHex): static
    {
        $this->colorHex = $colorHex;
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
            $card->addTag($this);
        }
        return $this;
    }

    public function removeCard(KanbanCard $card): static
    {
        if ($this->cards->removeElement($card)) {
            $card->removeTag($this);
        }
        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }
}
