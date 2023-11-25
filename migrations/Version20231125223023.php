<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20231125223023 extends AbstractMigration {
    public function getDescription(): string {
        return '';
    }

    public function up(Schema $schema): void {
        $this->addSql('SET FOREIGN_KEY_CHECKS=0;');
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE app ADD default_role_id INT NOT NULL');
        $this->addSql('ALTER TABLE app ADD CONSTRAINT FK_C96E70CF248673E9 FOREIGN KEY (default_role_id) REFERENCES app_role (id)');
        $this->addSql('CREATE INDEX IDX_C96E70CF248673E9 ON app (default_role_id)');
    }

    public function down(Schema $schema): void {
        $this->addSql('SET FOREIGN_KEY_CHECKS=0;');
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE app DROP FOREIGN KEY FK_C96E70CF248673E9');
        $this->addSql('DROP INDEX IDX_C96E70CF248673E9 ON app');
        $this->addSql('ALTER TABLE app DROP default_role_id');
    }
}
