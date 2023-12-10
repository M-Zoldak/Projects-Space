<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20231210131114 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE project ADD project_state_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE project ADD CONSTRAINT FK_2FB3D0EE3896B71A FOREIGN KEY (project_state_id) REFERENCES project_state (id)');
        $this->addSql('CREATE INDEX IDX_2FB3D0EE3896B71A ON project (project_state_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE project DROP FOREIGN KEY FK_2FB3D0EE3896B71A');
        $this->addSql('DROP INDEX IDX_2FB3D0EE3896B71A ON project');
        $this->addSql('ALTER TABLE project DROP project_state_id');
    }
}
