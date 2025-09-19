<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Migration pour ajouter des indexes de performance
 * Améliore considérablement les performances des requêtes fréquentes
 */
final class Version20250919113000_AddPerformanceIndexes extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Ajoute des indexes de performance pour optimiser les requêtes fréquentes';
    }

    public function up(Schema $schema): void
    {
        // Indexes pour la table projects
        $this->addSql('CREATE INDEX idx_projects_status ON projects(status)');
        $this->addSql('CREATE INDEX idx_projects_created_at ON projects(created_at)');
        $this->addSql('CREATE INDEX idx_projects_updated_at ON projects(updated_at)');
        $this->addSql('CREATE INDEX idx_projects_user_status ON projects(user_id, status)');

        // Indexes pour la table notes
        $this->addSql('CREATE INDEX idx_notes_user_id ON notes(user_id)');
        $this->addSql('CREATE INDEX idx_notes_updated_at ON notes(updated_at)');
        $this->addSql('CREATE INDEX idx_notes_created_at ON notes(created_at)');

        // Indexes pour la table kanban
        $this->addSql('CREATE INDEX idx_kanban_owner ON kanban(owner_id)');
        $this->addSql('CREATE INDEX idx_kanban_updated_at ON kanban(updated_at)');

        // Indexes pour la table kanban_columns
        $this->addSql('CREATE INDEX idx_columns_kanban_id ON kanban_columns(kanban_id)');
        $this->addSql('CREATE INDEX idx_columns_position ON kanban_columns(kanban_id, position)');

        // Indexes pour la table kanban_cards
        $this->addSql('CREATE INDEX idx_cards_column_id ON kanban_cards(column_id)');
        $this->addSql('CREATE INDEX idx_cards_due_at ON kanban_cards(due_at)');
        $this->addSql('CREATE INDEX idx_cards_priority ON kanban_cards(priority)');
        $this->addSql('CREATE INDEX idx_cards_column_position ON kanban_cards(column_id, position)');
        $this->addSql('CREATE INDEX idx_cards_updated_at ON kanban_cards(updated_at)');

        // Indexes pour la table kanban_card_files
        $this->addSql('CREATE INDEX idx_card_files_card_id ON kanban_card_files(card_id)');

        // Indexes pour la table kanban_card_links
        $this->addSql('CREATE INDEX idx_card_links_card_id ON kanban_card_links(card_id)');

        // Indexes pour la table kanban_card_comments
        $this->addSql('CREATE INDEX idx_card_comments_card_id ON kanban_card_comments(card_id)');
        $this->addSql('CREATE INDEX idx_card_comments_created_at ON kanban_card_comments(created_at)');

        // Index pour la recherche full-text (si supporté par MySQL)
        // Note: Décommenté si votre version MySQL supporte FULLTEXT sur InnoDB
        // $this->addSql('CREATE FULLTEXT INDEX idx_projects_fulltext ON projects(title, description)');
        // $this->addSql('CREATE FULLTEXT INDEX idx_notes_fulltext ON notes(title, content)');
        // $this->addSql('CREATE FULLTEXT INDEX idx_cards_fulltext ON kanban_cards(title, description)');
    }

    public function down(Schema $schema): void
    {
        // Supprimer tous les indexes créés
        $this->addSql('DROP INDEX idx_projects_status ON projects');
        $this->addSql('DROP INDEX idx_projects_created_at ON projects');
        $this->addSql('DROP INDEX idx_projects_updated_at ON projects');
        $this->addSql('DROP INDEX idx_projects_user_status ON projects');

        $this->addSql('DROP INDEX idx_notes_user_id ON notes');
        $this->addSql('DROP INDEX idx_notes_updated_at ON notes');
        $this->addSql('DROP INDEX idx_notes_created_at ON notes');

        $this->addSql('DROP INDEX idx_kanban_owner ON kanban');
        $this->addSql('DROP INDEX idx_kanban_updated_at ON kanban');

        $this->addSql('DROP INDEX idx_columns_kanban_id ON kanban_columns');
        $this->addSql('DROP INDEX idx_columns_position ON kanban_columns');

        $this->addSql('DROP INDEX idx_cards_column_id ON kanban_cards');
        $this->addSql('DROP INDEX idx_cards_due_at ON kanban_cards');
        $this->addSql('DROP INDEX idx_cards_priority ON kanban_cards');
        $this->addSql('DROP INDEX idx_cards_column_position ON kanban_cards');
        $this->addSql('DROP INDEX idx_cards_updated_at ON kanban_cards');

        $this->addSql('DROP INDEX idx_card_files_card_id ON kanban_card_files');
        $this->addSql('DROP INDEX idx_card_links_card_id ON kanban_card_links');
        $this->addSql('DROP INDEX idx_card_comments_card_id ON kanban_card_comments');
        $this->addSql('DROP INDEX idx_card_comments_created_at ON kanban_card_comments');

        // $this->addSql('DROP INDEX idx_projects_fulltext ON projects');
        // $this->addSql('DROP INDEX idx_notes_fulltext ON notes');
        // $this->addSql('DROP INDEX idx_cards_fulltext ON kanban_cards');
    }
}
