<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20231210115516 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE project_state (id INT NOT NULL, app_id INT NOT NULL, name VARCHAR(255) NOT NULL, INDEX IDX_B0C6DB657987212D (app_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE project_state ADD CONSTRAINT FK_B0C6DB657987212D FOREIGN KEY (app_id) REFERENCES app (id)');
        $this->addSql('ALTER TABLE project_state ADD CONSTRAINT FK_B0C6DB65BF396750 FOREIGN KEY (id) REFERENCES entity (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE project_states DROP FOREIGN KEY FK_26669C077987212D');
        $this->addSql('ALTER TABLE project_states DROP FOREIGN KEY FK_26669C07BF396750');
        $this->addSql('DROP TABLE project_states');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE project_states (id INT NOT NULL, app_id INT NOT NULL, name VARCHAR(255) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, INDEX IDX_26669C077987212D (app_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('ALTER TABLE project_states ADD CONSTRAINT FK_26669C077987212D FOREIGN KEY (app_id) REFERENCES app (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
        $this->addSql('ALTER TABLE project_states ADD CONSTRAINT FK_26669C07BF396750 FOREIGN KEY (id) REFERENCES entity (id) ON UPDATE NO ACTION ON DELETE CASCADE');
        $this->addSql('ALTER TABLE project_state DROP FOREIGN KEY FK_B0C6DB657987212D');
        $this->addSql('ALTER TABLE project_state DROP FOREIGN KEY FK_B0C6DB65BF396750');
        $this->addSql('DROP TABLE project_state');
    }
}
