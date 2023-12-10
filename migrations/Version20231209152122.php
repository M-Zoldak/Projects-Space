<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20231209152122 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE project_category (id INT NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE project_category ADD CONSTRAINT FK_3B02921ABF396750 FOREIGN KEY (id) REFERENCES entity (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE project_categories DROP FOREIGN KEY FK_22553D5ABF396750');
        $this->addSql('ALTER TABLE project_categories DROP FOREIGN KEY FK_22553D5A7987212D');
        $this->addSql('ALTER TABLE project_role DROP FOREIGN KEY FK_6EF84272BF396750');
        $this->addSql('ALTER TABLE project_role DROP FOREIGN KEY FK_6EF84272166D1F9C');
        $this->addSql('ALTER TABLE project_role DROP FOREIGN KEY FK_6EF84272A76ED395');
        $this->addSql('DROP TABLE project_categories');
        $this->addSql('DROP TABLE project_role');
        $this->addSql('ALTER TABLE project ADD participants JSON DEFAULT NULL');
        $this->addSql('ALTER TABLE project_states DROP states');
        $this->addSql('ALTER TABLE task ADD project_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE task ADD CONSTRAINT FK_527EDB25166D1F9C FOREIGN KEY (project_id) REFERENCES project (id)');
        $this->addSql('CREATE INDEX IDX_527EDB25166D1F9C ON task (project_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE project_categories (id INT NOT NULL, app_id INT DEFAULT NULL, categories JSON NOT NULL, INDEX IDX_22553D5A7987212D (app_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('CREATE TABLE project_role (id INT NOT NULL, project_id INT NOT NULL, user_id INT NOT NULL, role VARCHAR(255) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, INDEX IDX_6EF84272166D1F9C (project_id), INDEX IDX_6EF84272A76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('ALTER TABLE project_categories ADD CONSTRAINT FK_22553D5ABF396750 FOREIGN KEY (id) REFERENCES entity (id) ON UPDATE NO ACTION ON DELETE CASCADE');
        $this->addSql('ALTER TABLE project_categories ADD CONSTRAINT FK_22553D5A7987212D FOREIGN KEY (app_id) REFERENCES app (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
        $this->addSql('ALTER TABLE project_role ADD CONSTRAINT FK_6EF84272BF396750 FOREIGN KEY (id) REFERENCES entity (id) ON UPDATE NO ACTION ON DELETE CASCADE');
        $this->addSql('ALTER TABLE project_role ADD CONSTRAINT FK_6EF84272166D1F9C FOREIGN KEY (project_id) REFERENCES project (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
        $this->addSql('ALTER TABLE project_role ADD CONSTRAINT FK_6EF84272A76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
        $this->addSql('ALTER TABLE project_category DROP FOREIGN KEY FK_3B02921ABF396750');
        $this->addSql('DROP TABLE project_category');
        $this->addSql('ALTER TABLE project DROP participants');
        $this->addSql('ALTER TABLE project_states ADD states JSON NOT NULL');
        $this->addSql('ALTER TABLE task DROP FOREIGN KEY FK_527EDB25166D1F9C');
        $this->addSql('DROP INDEX IDX_527EDB25166D1F9C ON task');
        $this->addSql('ALTER TABLE task DROP project_id');
    }
}
