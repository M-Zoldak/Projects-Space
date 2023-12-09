<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20231209132649 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE website_hosting CHANGE id id INT NOT NULL');
        $this->addSql('ALTER TABLE website_hosting ADD CONSTRAINT FK_4538F37EBF396750 FOREIGN KEY (id) REFERENCES entity (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE website_hosting DROP FOREIGN KEY FK_4538F37EBF396750');
        $this->addSql('ALTER TABLE website_hosting CHANGE id id INT AUTO_INCREMENT NOT NULL');
    }
}
