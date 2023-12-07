<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20231207172335 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE address (id INT NOT NULL, client_id INT NOT NULL, street VARCHAR(255) NOT NULL, postal VARCHAR(255) NOT NULL, city VARCHAR(255) NOT NULL, country VARCHAR(255) NOT NULL, INDEX IDX_D4E6F8119EB6921 (client_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE client (id INT NOT NULL, name VARCHAR(255) NOT NULL, fax VARCHAR(255) NOT NULL, phone VARCHAR(255) NOT NULL, mobile VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE project_categories (id INT NOT NULL, app_id INT DEFAULT NULL, categories JSON NOT NULL, INDEX IDX_22553D5A7987212D (app_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE project_states (id INT NOT NULL, states JSON NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE task (id INT NOT NULL, name VARCHAR(255) NOT NULL, start_date DATETIME DEFAULT NULL, end_date DATETIME DEFAULT NULL, category VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE address ADD CONSTRAINT FK_D4E6F8119EB6921 FOREIGN KEY (client_id) REFERENCES client (id)');
        $this->addSql('ALTER TABLE address ADD CONSTRAINT FK_D4E6F81BF396750 FOREIGN KEY (id) REFERENCES entity (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE client ADD CONSTRAINT FK_C7440455BF396750 FOREIGN KEY (id) REFERENCES entity (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE project_categories ADD CONSTRAINT FK_22553D5A7987212D FOREIGN KEY (app_id) REFERENCES app (id)');
        $this->addSql('ALTER TABLE project_categories ADD CONSTRAINT FK_22553D5ABF396750 FOREIGN KEY (id) REFERENCES entity (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE project_states ADD CONSTRAINT FK_26669C07BF396750 FOREIGN KEY (id) REFERENCES entity (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE task ADD CONSTRAINT FK_527EDB25BF396750 FOREIGN KEY (id) REFERENCES entity (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE customer DROP FOREIGN KEY FK_81398E09BF396750');
        $this->addSql('ALTER TABLE customer DROP FOREIGN KEY FK_81398E097987212D');
        $this->addSql('DROP TABLE customer');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE customer (id INT NOT NULL, app_id INT DEFAULT NULL, name VARCHAR(255) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, email VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT NULL COLLATE `utf8mb4_unicode_ci`, phone_number VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT NULL COLLATE `utf8mb4_unicode_ci`, mobile_number VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT NULL COLLATE `utf8mb4_unicode_ci`, city VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT NULL COLLATE `utf8mb4_unicode_ci`, postal_code VARCHAR(64) CHARACTER SET utf8mb4 DEFAULT NULL COLLATE `utf8mb4_unicode_ci`, street VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT NULL COLLATE `utf8mb4_unicode_ci`, home_number VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT NULL COLLATE `utf8mb4_unicode_ci`, INDEX IDX_81398E097987212D (app_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('ALTER TABLE customer ADD CONSTRAINT FK_81398E09BF396750 FOREIGN KEY (id) REFERENCES entity (id) ON UPDATE NO ACTION ON DELETE CASCADE');
        $this->addSql('ALTER TABLE customer ADD CONSTRAINT FK_81398E097987212D FOREIGN KEY (app_id) REFERENCES app (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
        $this->addSql('ALTER TABLE address DROP FOREIGN KEY FK_D4E6F8119EB6921');
        $this->addSql('ALTER TABLE address DROP FOREIGN KEY FK_D4E6F81BF396750');
        $this->addSql('ALTER TABLE client DROP FOREIGN KEY FK_C7440455BF396750');
        $this->addSql('ALTER TABLE project_categories DROP FOREIGN KEY FK_22553D5A7987212D');
        $this->addSql('ALTER TABLE project_categories DROP FOREIGN KEY FK_22553D5ABF396750');
        $this->addSql('ALTER TABLE project_states DROP FOREIGN KEY FK_26669C07BF396750');
        $this->addSql('ALTER TABLE task DROP FOREIGN KEY FK_527EDB25BF396750');
        $this->addSql('DROP TABLE address');
        $this->addSql('DROP TABLE client');
        $this->addSql('DROP TABLE project_categories');
        $this->addSql('DROP TABLE project_states');
        $this->addSql('DROP TABLE task');
    }
}
