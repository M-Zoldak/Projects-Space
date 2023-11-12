<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20231110190937 extends AbstractMigration {
    public function getDescription(): string {
        return '';
    }

    public function up(Schema $schema): void {
        $this->addSql('SET foreign_key_checks = 0');
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE app (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE app_user (app_id INT NOT NULL, user_id INT NOT NULL, INDEX IDX_88BDF3E97987212D (app_id), INDEX IDX_88BDF3E9A76ED395 (user_id), PRIMARY KEY(app_id, user_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE customer (id INT AUTO_INCREMENT NOT NULL, app_id INT DEFAULT NULL, name VARCHAR(255) NOT NULL, email VARCHAR(255) DEFAULT NULL, phone_number VARCHAR(255) DEFAULT NULL, mobile_number VARCHAR(255) DEFAULT NULL, city VARCHAR(255) DEFAULT NULL, postal_code VARCHAR(64) DEFAULT NULL, street VARCHAR(255) DEFAULT NULL, home_number VARCHAR(255) DEFAULT NULL, INDEX IDX_81398E097987212D (app_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE app_user ADD CONSTRAINT FK_88BDF3E97987212D FOREIGN KEY (app_id) REFERENCES app (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE app_user ADD CONSTRAINT FK_88BDF3E9A76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE customer ADD CONSTRAINT FK_81398E097987212D FOREIGN KEY (app_id) REFERENCES app (id)');
    }

    public function down(Schema $schema): void {
        $this->addSql('SET foreign_key_checks = 0');
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE app_user DROP FOREIGN KEY FK_88BDF3E97987212D');
        $this->addSql('ALTER TABLE app_user DROP FOREIGN KEY FK_88BDF3E9A76ED395');
        $this->addSql('ALTER TABLE customer DROP FOREIGN KEY FK_81398E097987212D');
        $this->addSql('DROP TABLE app');
        $this->addSql('DROP TABLE app_user');
        $this->addSql('DROP TABLE customer');
    }
}
