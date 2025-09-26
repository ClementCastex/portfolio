<?php

namespace App\Entity;

use App\Repository\KanbanCardActivityRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: KanbanCardActivityRepository::class)]
#[ORM\Table(name: 'kanban_card_activity')]
class KanbanCardActivity
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['kanban:read', 'card:read', 'activity:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 50)]
    #[Groups(['kanban:read', 'card:read', 'activity:read'])]
    private ?string $action = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['kanban:read', 'card:read', 'activity:read'])]
    private ?string $description = null;

    #[ORM\Column(type: Types::JSON, nullable: true)]
    #[Groups(['kanban:read', 'card:read', 'activity:read'])]
    private ?array $metadata = null;

    #[ORM\Column]
    #[Groups(['kanban:read', 'card:read', 'activity:read'])]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\ManyToOne(targetEntity: KanbanCard::class)]
    #[ORM\JoinColumn(nullable: false)]
    private ?KanbanCard $card = null;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['kanban:read', 'card:read', 'activity:read'])]
    private ?User $user = null;

    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getAction(): ?string
    {
        return $this->action;
    }

    public function setAction(string $action): static
    {
        $this->action = $action;
        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): static
    {
        $this->description = $description;
        return $this;
    }

    public function getMetadata(): ?array
    {
        return $this->metadata;
    }

    public function setMetadata(?array $metadata): static
    {
        $this->metadata = $metadata;
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

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): static
    {
        $this->user = $user;
        return $this;
    }
}
