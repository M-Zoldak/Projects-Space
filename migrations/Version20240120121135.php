<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240120121135 extends AbstractMigration {
    public function getDescription(): string {
        return '';
    }

    public function up(Schema $schema): void {
        $this->addSql("SET FOREIGN_KEY_CHECKS=0");
        // this up() migration is auto-generated, please modify it to your needs
        // $this->addSql('ALTER TABLE app DROP FOREIGN KEY FK_C96E70CF248673E9');
        // $this->addSql('ALTER TABLE app ADD CONSTRAINT FK_C96E70CF248673E9 FOREIGN KEY (default_role_id) REFERENCES app_role (id) ON DELETE SET NULL');
        // $this->addSql('ALTER TABLE project ADD manager_id INT DEFAULT NULL');
        // $this->addSql('ALTER TABLE project ADD CONSTRAINT FK_2FB3D0EE783E3463 FOREIGN KEY (manager_id) REFERENCES user (id)');
        // $this->addSql('CREATE INDEX IDX_2FB3D0EE783E3463 ON project (manager_id)');
        // $this->addSql('ALTER TABLE task ADD manager_id INT DEFAULT NULL, ADD assigned_to_id INT DEFAULT NULL, ADD description LONGTEXT DEFAULT NULL');
        // $this->addSql('ALTER TABLE task ADD CONSTRAINT FK_527EDB25F4BD7827 FOREIGN KEY (assigned_to_id) REFERENCES user (id)');
        // $this->addSql('CREATE INDEX IDX_527EDB25F4BD7827 ON task (assigned_to_id)');
        // $this->addSql('ALTER TABLE user_options DROP FOREIGN KEY FK_8838E48DA76ED395');
        // $this->addSql('ALTER TABLE user_options ADD CONSTRAINT FK_8838E48DA76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE SET NULL');

        $this->addSql("SET FOREIGN_KEY_CHECKS=1");
    }

    public function down(Schema $schema): void {
        $this->addSql("SET FOREIGN_KEY_CHECKS=0");
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE app DROP FOREIGN KEY FK_C96E70CF248673E9');
        $this->addSql('ALTER TABLE app ADD CONSTRAINT FK_C96E70CF248673E9 FOREIGN KEY (default_role_id) REFERENCES app_role (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
        // $this->addSql('ALTER TABLE project DROP FOREIGN KEY FK_2FB3D0EE783E3463');
        // $this->addSql('DROP INDEX IDX_2FB3D0EE783E3463 ON project');
        // $this->addSql('ALTER TABLE project DROP manager_id');
        // $this->addSql('ALTER TABLE task DROP FOREIGN KEY FK_527EDB25783E3463');
        // $this->addSql('ALTER TABLE task DROP FOREIGN KEY FK_527EDB25F4BD7827');
        // $this->addSql('DROP INDEX IDX_527EDB25783E3463 ON task');
        // $this->addSql('DROP INDEX IDX_527EDB25F4BD7827 ON task');
        // $this->addSql('ALTER TABLE task DROP manager_id, DROP assigned_to_id, DROP description');
        // $this->addSql('ALTER TABLE user_options DROP FOREIGN KEY FK_8838E48DA76ED395');
        // $this->addSql('ALTER TABLE user_options ADD CONSTRAINT FK_8838E48DA76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON UPDATE NO ACTION ON DELETE NO ACTION');

        $this->addSql("SET FOREIGN_KEY_CHECKS=1");
    }
}
