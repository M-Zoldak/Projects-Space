<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20231205202757 extends AbstractMigration {
    public function getDescription(): string {
        return '';
    }

    public function up(Schema $schema): void {
        $this->addSql("SET FOREIGN_KEY_CHECKS=0");
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE app ADD CONSTRAINT FK_C96E70CF7E3C61F9 FOREIGN KEY (owner_id) REFERENCES user (id)');
        $this->addSql('CREATE INDEX IDX_C96E70CF7E3C61F9 ON app (owner_id)');
    }

    public function down(Schema $schema): void {
        $this->addSql("SET FOREIGN_KEY_CHECKS=0");
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE app DROP FOREIGN KEY FK_C96E70CF7E3C61F9');
        $this->addSql('DROP INDEX IDX_C96E70CF7E3C61F9 ON app');
    }
}
