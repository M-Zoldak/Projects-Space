<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20231208181324 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE contact (id INT AUTO_INCREMENT NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE contact_person (id INT AUTO_INCREMENT NOT NULL, owner_company_id INT DEFAULT NULL, first_name VARCHAR(255) NOT NULL, last_name VARCHAR(255) NOT NULL, birth_date VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL, mobile VARCHAR(255) NOT NULL, role VARCHAR(255) NOT NULL, INDEX IDX_A44EE6F7C5F18393 (owner_company_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE contact_person ADD CONSTRAINT FK_A44EE6F7C5F18393 FOREIGN KEY (owner_company_id) REFERENCES contact (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE contact_person DROP FOREIGN KEY FK_A44EE6F7C5F18393');
        $this->addSql('DROP TABLE contact');
        $this->addSql('DROP TABLE contact_person');
    }
}
