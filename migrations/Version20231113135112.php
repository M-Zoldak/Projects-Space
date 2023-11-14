<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20231113135112 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE section_permissions (id INT NOT NULL, app_role_id INT NOT NULL, destroy TINYINT(1) DEFAULT NULL, edit TINYINT(1) DEFAULT NULL, review TINYINT(1) DEFAULT NULL, section_name VARCHAR(255) NOT NULL, INDEX IDX_3B1CB3103B5EA2E1 (app_role_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE section_permissions ADD CONSTRAINT FK_3B1CB3103B5EA2E1 FOREIGN KEY (app_role_id) REFERENCES app_role (id)');
        $this->addSql('ALTER TABLE section_permissions ADD CONSTRAINT FK_3B1CB310BF396750 FOREIGN KEY (id) REFERENCES entity (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE section_permissions DROP FOREIGN KEY FK_3B1CB3103B5EA2E1');
        $this->addSql('ALTER TABLE section_permissions DROP FOREIGN KEY FK_3B1CB310BF396750');
        $this->addSql('DROP TABLE section_permissions');
    }
}
