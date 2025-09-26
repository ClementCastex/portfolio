<?php

namespace App\Entity;

use App\Repository\NoteTagRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: NoteTagRepository::class)]
#[ORM\Table(name: 'note_tag')]
class NoteTag
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['note:read', 'tag:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 100)]
    #[Groups(['note:read', 'tag:read', 'tag:write'])]
    private ?string $name = null;

    #[ORM\Column(length: 7)]
    #[Groups(['note:read', 'tag:read', 'tag:write'])]
    private ?string $colorHex = null;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $owner = null;

    #[ORM\ManyToMany(targetEntity: Note::class, mappedBy: 'tags')]
    private Collection $notes;

    #[ORM\Column]
    #[Groups(['note:read', 'tag:read'])]
    private ?\DateTimeImmutable $createdAt = null;

    public function __construct()
    {
        $this->notes = new ArrayCollection();
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
     * @return Collection<int, Note>
     */
    public function getNotes(): Collection
    {
        return $this->notes;
    }

    public function addNote(Note $note): static
    {
        if (!$this->notes->contains($note)) {
            $this->notes->add($note);
            $note->addTag($this);
        }
        return $this;
    }

    public function removeNote(Note $note): static
    {
        if ($this->notes->removeElement($note)) {
            $note->removeTag($this);
        }
        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }
}
