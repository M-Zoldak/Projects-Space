<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20231204191930 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE app_users_invitation (app_id INT NOT NULL, user_id INT NOT NULL, INDEX IDX_B2482F977987212D (app_id), INDEX IDX_B2482F97A76ED395 (user_id), PRIMARY KEY(app_id, user_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE app_users_invitation ADD CONSTRAINT FK_B2482F977987212D FOREIGN KEY (app_id) REFERENCES app (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE app_users_invitation ADD CONSTRAINT FK_B2482F97A76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE app ADD CONSTRAINT FK_C96E70CF248673E9 FOREIGN KEY (default_role_id) REFERENCES app_role (id)');
        $this->addSql('CREATE INDEX IDX_C96E70CF248673E9 ON app (default_role_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE app_users_invitation DROP FOREIGN KEY FK_B2482F977987212D');
        $this->addSql('ALTER TABLE app_users_invitation DROP FOREIGN KEY FK_B2482F97A76ED395');
        $this->addSql('DROP TABLE app_users_invitation');
        $this->addSql('ALTER TABLE app DROP FOREIGN KEY FK_C96E70CF248673E9');
        $this->addSql('DROP INDEX IDX_C96E70CF248673E9 ON app');
    }
}
