<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20231209000013 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE website ADD client_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE website ADD CONSTRAINT FK_476F5DE719EB6921 FOREIGN KEY (client_id) REFERENCES client (id)');
        $this->addSql('CREATE INDEX IDX_476F5DE719EB6921 ON website (client_id)');
        $this->addSql('ALTER TABLE website_options DROP hosting');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE website DROP FOREIGN KEY FK_476F5DE719EB6921');
        $this->addSql('DROP INDEX IDX_476F5DE719EB6921 ON website');
        $this->addSql('ALTER TABLE website DROP client_id');
        $this->addSql('ALTER TABLE website_options ADD hosting VARCHAR(255) DEFAULT NULL');
    }
}
