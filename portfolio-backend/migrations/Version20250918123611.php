<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250918123611 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE kanban_card_comment (id INT AUTO_INCREMENT NOT NULL, card_id INT NOT NULL, author_id INT NOT NULL, content LONGTEXT NOT NULL, created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', updated_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_B50809214ACC9A20 (card_id), INDEX IDX_B5080921F675F31B (author_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE kanban_card_comment ADD CONSTRAINT FK_B50809214ACC9A20 FOREIGN KEY (card_id) REFERENCES kanban_card (id)');
        $this->addSql('ALTER TABLE kanban_card_comment ADD CONSTRAINT FK_B5080921F675F31B FOREIGN KEY (author_id) REFERENCES `user` (id)');
        $this->addSql('ALTER TABLE kanban_card ADD priority VARCHAR(20) DEFAULT NULL, ADD estimated_hours INT DEFAULT NULL, ADD logged_hours INT DEFAULT NULL, ADD checklist JSON DEFAULT NULL COMMENT \'(DC2Type:json)\', ADD assigned_user_ids JSON DEFAULT NULL COMMENT \'(DC2Type:json)\'');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE kanban_card_comment DROP FOREIGN KEY FK_B50809214ACC9A20');
        $this->addSql('ALTER TABLE kanban_card_comment DROP FOREIGN KEY FK_B5080921F675F31B');
        $this->addSql('DROP TABLE kanban_card_comment');
        $this->addSql('ALTER TABLE kanban_card DROP priority, DROP estimated_hours, DROP logged_hours, DROP checklist, DROP assigned_user_ids');
    }
}
