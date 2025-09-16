<?php

namespace App\Entity;

use App\Repository\ProjectRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: ProjectRepository::class)]
class Project
{
    const STATUS_COMPLETED = 'completed';
    const STATUS_IN_PROGRESS = 'in_progress';
    const STATUS_ABANDONED = 'abandoned';

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['project:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['project:read'])]
    private ?string $title = null;

    #[ORM\Column(type: Types::TEXT)]
    #[Groups(['project:read'])]
    private ?string $shortDescription = null;

    #[ORM\Column(type: Types::TEXT)]
    #[Groups(['project:read'])]
    private ?string $longDescription = null;

    #[ORM\Column(length: 255)]
    #[Groups(['project:read'])]
    private ?string $status = self::STATUS_COMPLETED;

    #[ORM\Column(type: Types::JSON)]
    #[Groups(['project:read'])]
    private array $categories = [];

    #[ORM\Column(type: Types::JSON)]
    #[Groups(['project:read'])]
    private array $images = [];

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['project:read'])]
    private ?string $websiteUrl = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['project:read'])]
    private ?string $githubUrl = null;

    #[ORM\Column]
    #[Groups(['project:read'])]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['project:read'])]
    private ?\DateTimeImmutable $updatedAt = null;

    /**
     * @var Collection<int, Bookmark>
     */
    #[ORM\OneToMany(targetEntity: Bookmark::class, mappedBy: 'project')]
    private Collection $bookmarks;

    public function __construct()
    {
        $this->bookmarks = new ArrayCollection();
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
        return $this;
    }

    public function getShortDescription(): ?string
    {
        return $this->shortDescription;
    }

    public function setShortDescription(string $shortDescription): static
    {
        $this->shortDescription = $shortDescription;
        return $this;
    }

    public function getLongDescription(): ?string
    {
        return $this->longDescription;
    }

    public function setLongDescription(string $longDescription): static
    {
        $this->longDescription = $longDescription;
        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): static
    {
        if (!in_array($status, [self::STATUS_COMPLETED, self::STATUS_IN_PROGRESS, self::STATUS_ABANDONED])) {
            throw new \InvalidArgumentException('Invalid status');
        }
        $this->status = $status;
        return $this;
    }

    public function getCategories(): array
    {
        return $this->categories;
    }

    public function setCategories(array $categories): static
    {
        $this->categories = $categories;
        return $this;
    }

    public function getImages(): array
    {
        return $this->images;
    }

    public function setImages(array $images): static
    {
        $this->images = $images;
        return $this;
    }

    public function getWebsiteUrl(): ?string
    {
        return $this->websiteUrl;
    }

    public function setWebsiteUrl(?string $websiteUrl): static
    {
        $this->websiteUrl = $websiteUrl;
        return $this;
    }

    public function getGithubUrl(): ?string
    {
        return $this->githubUrl;
    }

    public function setGithubUrl(?string $githubUrl): static
    {
        $this->githubUrl = $githubUrl;
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

    public function getUpdatedAt(): ?\DateTimeImmutable
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(): static
    {
        $this->updatedAt = new \DateTimeImmutable();
        return $this;
    }

    /**
     * @return Collection<int, Bookmark>
     */
    public function getBookmarks(): Collection
    {
        return $this->bookmarks;
    }

    public function addBookmark(Bookmark $bookmark): static
    {
        if (!$this->bookmarks->contains($bookmark)) {
            $this->bookmarks->add($bookmark);
            $bookmark->setProject($this);
        }
        return $this;
    }

    public function removeBookmark(Bookmark $bookmark): static
    {
        if ($this->bookmarks->removeElement($bookmark)) {
            if ($bookmark->getProject() === $this) {
                $bookmark->setProject(null);
            }
        }
        return $this;
    }
}
