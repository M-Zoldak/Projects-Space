<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20231209135113 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE website ADD hosting_id INT DEFAULT NULL, DROP hosting');
        $this->addSql('ALTER TABLE website ADD CONSTRAINT FK_476F5DE7AE9044EA FOREIGN KEY (hosting_id) REFERENCES website_hosting (id)');
        $this->addSql('CREATE INDEX IDX_476F5DE7AE9044EA ON website (hosting_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE website DROP FOREIGN KEY FK_476F5DE7AE9044EA');
        $this->addSql('DROP INDEX IDX_476F5DE7AE9044EA ON website');
        $this->addSql('ALTER TABLE website ADD hosting VARCHAR(255) DEFAULT NULL, DROP hosting_id');
    }
}
