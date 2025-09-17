<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250917171444 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE note (id INT AUTO_INCREMENT NOT NULL, owner_id INT NOT NULL, title VARCHAR(255) NOT NULL, content_html LONGTEXT DEFAULT NULL, created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', updated_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', is_archived TINYINT(1) NOT NULL, last_sync_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_CFBDFA147E3C61F9 (owner_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE note_tag_links (note_id INT NOT NULL, note_tag_id INT NOT NULL, INDEX IDX_E4C95D8126ED0855 (note_id), INDEX IDX_E4C95D81A20034C5 (note_tag_id), PRIMARY KEY(note_id, note_tag_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE note_asset (id INT AUTO_INCREMENT NOT NULL, note_id INT NOT NULL, type VARCHAR(20) NOT NULL, filename VARCHAR(255) NOT NULL, mime VARCHAR(100) NOT NULL, size INT NOT NULL, storage_path VARCHAR(500) NOT NULL, created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_67BFF98B26ED0855 (note_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE note_tag (id INT AUTO_INCREMENT NOT NULL, owner_id INT NOT NULL, name VARCHAR(100) NOT NULL, color_hex VARCHAR(7) NOT NULL, created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_737A97637E3C61F9 (owner_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE note ADD CONSTRAINT FK_CFBDFA147E3C61F9 FOREIGN KEY (owner_id) REFERENCES `user` (id)');
        $this->addSql('ALTER TABLE note_tag_links ADD CONSTRAINT FK_E4C95D8126ED0855 FOREIGN KEY (note_id) REFERENCES note (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE note_tag_links ADD CONSTRAINT FK_E4C95D81A20034C5 FOREIGN KEY (note_tag_id) REFERENCES note_tag (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE note_asset ADD CONSTRAINT FK_67BFF98B26ED0855 FOREIGN KEY (note_id) REFERENCES note (id)');
        $this->addSql('ALTER TABLE note_tag ADD CONSTRAINT FK_737A97637E3C61F9 FOREIGN KEY (owner_id) REFERENCES `user` (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE note DROP FOREIGN KEY FK_CFBDFA147E3C61F9');
        $this->addSql('ALTER TABLE note_tag_links DROP FOREIGN KEY FK_E4C95D8126ED0855');
        $this->addSql('ALTER TABLE note_tag_links DROP FOREIGN KEY FK_E4C95D81A20034C5');
        $this->addSql('ALTER TABLE note_asset DROP FOREIGN KEY FK_67BFF98B26ED0855');
        $this->addSql('ALTER TABLE note_tag DROP FOREIGN KEY FK_737A97637E3C61F9');
        $this->addSql('DROP TABLE note');
        $this->addSql('DROP TABLE note_tag_links');
        $this->addSql('DROP TABLE note_asset');
        $this->addSql('DROP TABLE note_tag');
    }
}
