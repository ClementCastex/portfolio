<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250918130959 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE kanban_card_activity (id INT AUTO_INCREMENT NOT NULL, card_id INT NOT NULL, user_id INT NOT NULL, action VARCHAR(50) NOT NULL, description LONGTEXT DEFAULT NULL, metadata JSON DEFAULT NULL COMMENT \'(DC2Type:json)\', created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_A438482C4ACC9A20 (card_id), INDEX IDX_A438482CA76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE kanban_card_activity ADD CONSTRAINT FK_A438482C4ACC9A20 FOREIGN KEY (card_id) REFERENCES kanban_card (id)');
        $this->addSql('ALTER TABLE kanban_card_activity ADD CONSTRAINT FK_A438482CA76ED395 FOREIGN KEY (user_id) REFERENCES `user` (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE kanban_card_activity DROP FOREIGN KEY FK_A438482C4ACC9A20');
        $this->addSql('ALTER TABLE kanban_card_activity DROP FOREIGN KEY FK_A438482CA76ED395');
        $this->addSql('DROP TABLE kanban_card_activity');
    }
}
