<?php

namespace App\Entity;

use App\Repository\KanbanCardLinkRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: KanbanCardLinkRepository::class)]
#[ORM\Table(name: 'kanban_card_link')]
class KanbanCardLink
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['kanban:read', 'card:read', 'link:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 500)]
    #[Groups(['kanban:read', 'card:read', 'link:read', 'link:write'])]
    private ?string $url = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['kanban:read', 'card:read', 'link:read'])]
    private ?string $title = null;

    #[ORM\Column(length: 500, nullable: true)]
    #[Groups(['kanban:read', 'card:read', 'link:read'])]
    private ?string $faviconUrl = null;

    #[ORM\Column]
    #[Groups(['kanban:read', 'card:read', 'link:read'])]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\ManyToOne(targetEntity: KanbanCard::class, inversedBy: 'links')]
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

    public function getUrl(): ?string
    {
        return $this->url;
    }

    public function setUrl(string $url): static
    {
        $this->url = $url;
        return $this;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(?string $title): static
    {
        $this->title = $title;
        return $this;
    }

    public function getFaviconUrl(): ?string
    {
        return $this->faviconUrl;
    }

    public function setFaviconUrl(?string $faviconUrl): static
    {
        $this->faviconUrl = $faviconUrl;
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
}
