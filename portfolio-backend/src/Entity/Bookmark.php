<?php

namespace App\Entity;

use App\Repository\BookmarkRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: BookmarkRepository::class)]
class Bookmark
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['bookmark:read'])]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'bookmarks')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['bookmark:read'])]
    private ?User $user = null;
    

    #[ORM\ManyToOne(targetEntity: Project::class, inversedBy: 'bookmarks')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['bookmark:read', 'project:read'])]
    private ?Project $project = null;

    #[ORM\Column]
    #[Groups(['bookmark:read'])]
    private ?\DateTimeImmutable $createdAt = null;

    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
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

    public function getProject(): ?Project
    {
        return $this->project;
    }

    public function setProject(?Project $project): static
    {
        $this->project = $project;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): static
    {
        $this->createdAt = $createdAt;
        return $this;
    }
}
