<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20231210090505 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE project_options (id INT AUTO_INCREMENT NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE project_category ADD name VARCHAR(255) NOT NULL');
        $this->addSql('ALTER TABLE project_states ADD app_id INT NOT NULL, ADD name VARCHAR(255) NOT NULL');
        $this->addSql('ALTER TABLE project_states ADD CONSTRAINT FK_26669C077987212D FOREIGN KEY (app_id) REFERENCES app (id)');
        $this->addSql('CREATE INDEX IDX_26669C077987212D ON project_states (app_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP TABLE project_options');
        $this->addSql('ALTER TABLE project_category DROP name');
        $this->addSql('ALTER TABLE project_states DROP FOREIGN KEY FK_26669C077987212D');
        $this->addSql('DROP INDEX IDX_26669C077987212D ON project_states');
        $this->addSql('ALTER TABLE project_states DROP app_id, DROP name');
    }
}
