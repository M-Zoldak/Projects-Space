<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20231116180639 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE project (id INT NOT NULL, app_id INT DEFAULT NULL, name VARCHAR(255) NOT NULL, INDEX IDX_2FB3D0EE7987212D (app_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE project_role (id INT NOT NULL, project_id INT NOT NULL, user_id INT NOT NULL, role VARCHAR(255) NOT NULL, INDEX IDX_6EF84272166D1F9C (project_id), INDEX IDX_6EF84272A76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE project ADD CONSTRAINT FK_2FB3D0EE7987212D FOREIGN KEY (app_id) REFERENCES app (id)');
        $this->addSql('ALTER TABLE project ADD CONSTRAINT FK_2FB3D0EEBF396750 FOREIGN KEY (id) REFERENCES entity (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE project_role ADD CONSTRAINT FK_6EF84272166D1F9C FOREIGN KEY (project_id) REFERENCES project (id)');
        $this->addSql('ALTER TABLE project_role ADD CONSTRAINT FK_6EF84272A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE project_role ADD CONSTRAINT FK_6EF84272BF396750 FOREIGN KEY (id) REFERENCES entity (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE section_permissions DROP section_readable_name');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE project DROP FOREIGN KEY FK_2FB3D0EE7987212D');
        $this->addSql('ALTER TABLE project DROP FOREIGN KEY FK_2FB3D0EEBF396750');
        $this->addSql('ALTER TABLE project_role DROP FOREIGN KEY FK_6EF84272166D1F9C');
        $this->addSql('ALTER TABLE project_role DROP FOREIGN KEY FK_6EF84272A76ED395');
        $this->addSql('ALTER TABLE project_role DROP FOREIGN KEY FK_6EF84272BF396750');
        $this->addSql('DROP TABLE project');
        $this->addSql('DROP TABLE project_role');
        $this->addSql('ALTER TABLE section_permissions ADD section_readable_name VARCHAR(255) NOT NULL');
    }
}
