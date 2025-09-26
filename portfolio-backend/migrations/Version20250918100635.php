<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250918100635 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE kanban (id INT AUTO_INCREMENT NOT NULL, owner_id INT NOT NULL, name VARCHAR(255) NOT NULL, created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', updated_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_31E589007E3C61F9 (owner_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE kanban_card (id INT AUTO_INCREMENT NOT NULL, column_id INT NOT NULL, title VARCHAR(255) NOT NULL, description_html LONGTEXT DEFAULT NULL, due_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', position INT NOT NULL, created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', updated_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_B2140480BE8E8ED5 (column_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE kanban_card_tag_links (kanban_card_id INT NOT NULL, kanban_card_tag_id INT NOT NULL, INDEX IDX_4A002056F9C2CF7B (kanban_card_id), INDEX IDX_4A002056727D9B25 (kanban_card_tag_id), PRIMARY KEY(kanban_card_id, kanban_card_tag_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE kanban_card_file (id INT AUTO_INCREMENT NOT NULL, card_id INT NOT NULL, filename VARCHAR(255) NOT NULL, mime VARCHAR(100) NOT NULL, size INT NOT NULL, storage_path VARCHAR(500) NOT NULL, created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_22E2A6584ACC9A20 (card_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE kanban_card_link (id INT AUTO_INCREMENT NOT NULL, card_id INT NOT NULL, url VARCHAR(500) NOT NULL, title VARCHAR(255) DEFAULT NULL, favicon_url VARCHAR(500) DEFAULT NULL, created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_98D109B94ACC9A20 (card_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE kanban_card_tag (id INT AUTO_INCREMENT NOT NULL, kanban_id INT NOT NULL, name VARCHAR(100) NOT NULL, color_hex VARCHAR(7) NOT NULL, created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_AF73B56B5C60F0F4 (kanban_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE kanban_column (id INT AUTO_INCREMENT NOT NULL, kanban_id INT NOT NULL, name VARCHAR(255) NOT NULL, position INT NOT NULL, INDEX IDX_157CF2865C60F0F4 (kanban_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE kanban ADD CONSTRAINT FK_31E589007E3C61F9 FOREIGN KEY (owner_id) REFERENCES `user` (id)');
        $this->addSql('ALTER TABLE kanban_card ADD CONSTRAINT FK_B2140480BE8E8ED5 FOREIGN KEY (column_id) REFERENCES kanban_column (id)');
        $this->addSql('ALTER TABLE kanban_card_tag_links ADD CONSTRAINT FK_4A002056F9C2CF7B FOREIGN KEY (kanban_card_id) REFERENCES kanban_card (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE kanban_card_tag_links ADD CONSTRAINT FK_4A002056727D9B25 FOREIGN KEY (kanban_card_tag_id) REFERENCES kanban_card_tag (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE kanban_card_file ADD CONSTRAINT FK_22E2A6584ACC9A20 FOREIGN KEY (card_id) REFERENCES kanban_card (id)');
        $this->addSql('ALTER TABLE kanban_card_link ADD CONSTRAINT FK_98D109B94ACC9A20 FOREIGN KEY (card_id) REFERENCES kanban_card (id)');
        $this->addSql('ALTER TABLE kanban_card_tag ADD CONSTRAINT FK_AF73B56B5C60F0F4 FOREIGN KEY (kanban_id) REFERENCES kanban (id)');
        $this->addSql('ALTER TABLE kanban_column ADD CONSTRAINT FK_157CF2865C60F0F4 FOREIGN KEY (kanban_id) REFERENCES kanban (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE kanban DROP FOREIGN KEY FK_31E589007E3C61F9');
        $this->addSql('ALTER TABLE kanban_card DROP FOREIGN KEY FK_B2140480BE8E8ED5');
        $this->addSql('ALTER TABLE kanban_card_tag_links DROP FOREIGN KEY FK_4A002056F9C2CF7B');
        $this->addSql('ALTER TABLE kanban_card_tag_links DROP FOREIGN KEY FK_4A002056727D9B25');
        $this->addSql('ALTER TABLE kanban_card_file DROP FOREIGN KEY FK_22E2A6584ACC9A20');
        $this->addSql('ALTER TABLE kanban_card_link DROP FOREIGN KEY FK_98D109B94ACC9A20');
        $this->addSql('ALTER TABLE kanban_card_tag DROP FOREIGN KEY FK_AF73B56B5C60F0F4');
        $this->addSql('ALTER TABLE kanban_column DROP FOREIGN KEY FK_157CF2865C60F0F4');
        $this->addSql('DROP TABLE kanban');
        $this->addSql('DROP TABLE kanban_card');
        $this->addSql('DROP TABLE kanban_card_tag_links');
        $this->addSql('DROP TABLE kanban_card_file');
        $this->addSql('DROP TABLE kanban_card_link');
        $this->addSql('DROP TABLE kanban_card_tag');
        $this->addSql('DROP TABLE kanban_column');
    }
}
