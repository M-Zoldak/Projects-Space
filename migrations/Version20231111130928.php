<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20231111130928 extends AbstractMigration {
    public function getDescription(): string {
        return '';
    }

    public function up(Schema $schema): void {
        $this->addSql('SET foreign_key_checks = 0');
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE app CHANGE id id INT NOT NULL');
        $this->addSql('ALTER TABLE app ADD CONSTRAINT FK_C96E70CFBF396750 FOREIGN KEY (id) REFERENCES entity (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE customer CHANGE id id INT NOT NULL');
        $this->addSql('ALTER TABLE customer ADD CONSTRAINT FK_81398E09BF396750 FOREIGN KEY (id) REFERENCES entity (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void {
        $this->addSql('SET foreign_key_checks = 0');
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE customer DROP FOREIGN KEY FK_81398E09BF396750');
        $this->addSql('ALTER TABLE customer CHANGE id id INT AUTO_INCREMENT NOT NULL');
        $this->addSql('ALTER TABLE app DROP FOREIGN KEY FK_C96E70CFBF396750');
        $this->addSql('ALTER TABLE app CHANGE id id INT AUTO_INCREMENT NOT NULL');
    }
}
