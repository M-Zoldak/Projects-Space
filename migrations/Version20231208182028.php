<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20231208182028 extends AbstractMigration {
    public function getDescription(): string {
        return '';
    }

    public function up(Schema $schema): void {
        $this->addSql("SET FOREIGN_KEY_CHECKS=0");
        // this up() migration is auto-generated, please modify it to your needs
        // $this->addSql('ALTER TABLE contact_person DROP FOREIGN KEY FK_A44EE6F7C5F18393');
        // $this->addSql('DROP TABLE contact');
        // $this->addSql('ALTER TABLE contact_person DROP FOREIGN KEY FK_A44EE6F7C5F18393');
        $this->addSql('ALTER TABLE contact_person CHANGE id id INT NOT NULL');
        $this->addSql('ALTER TABLE contact_person ADD CONSTRAINT FK_A44EE6F7BF396750 FOREIGN KEY (id) REFERENCES entity (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE contact_person ADD CONSTRAINT FK_A44EE6F7C5F18393 FOREIGN KEY (owner_company_id) REFERENCES client (id)');
    }

    public function down(Schema $schema): void {
        $this->addSql("SET FOREIGN_KEY_CHECKS=0");
        // this down() migration is auto-generated, please modify it to your needs
        // $this->addSql('CREATE TABLE contact (id INT AUTO_INCREMENT NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('ALTER TABLE contact_person DROP FOREIGN KEY FK_A44EE6F7BF396750');
        // $this->addSql('ALTER TABLE contact_person DROP FOREIGN KEY FK_A44EE6F7C5F18393');
        $this->addSql('ALTER TABLE contact_person CHANGE id id INT AUTO_INCREMENT NOT NULL');
        $this->addSql('ALTER TABLE contact_person ADD CONSTRAINT FK_A44EE6F7C5F18393 FOREIGN KEY (owner_company_id) REFERENCES contact (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
    }
}
