<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20231112131932 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE app_role (id INT NOT NULL, app_id INT DEFAULT NULL, name VARCHAR(255) NOT NULL, INDEX IDX_5247AFCA7987212D (app_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE app_role_user (app_role_id INT NOT NULL, user_id INT NOT NULL, INDEX IDX_9B43FBE83B5EA2E1 (app_role_id), INDEX IDX_9B43FBE8A76ED395 (user_id), PRIMARY KEY(app_role_id, user_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE site_options (id INT NOT NULL, app_id INT DEFAULT NULL, hosting VARCHAR(255) DEFAULT NULL, hostings_list JSON DEFAULT NULL, UNIQUE INDEX UNIQ_2B91184C7987212D (app_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE app_role ADD CONSTRAINT FK_5247AFCA7987212D FOREIGN KEY (app_id) REFERENCES app (id)');
        $this->addSql('ALTER TABLE app_role ADD CONSTRAINT FK_5247AFCABF396750 FOREIGN KEY (id) REFERENCES entity (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE app_role_user ADD CONSTRAINT FK_9B43FBE83B5EA2E1 FOREIGN KEY (app_role_id) REFERENCES app_role (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE app_role_user ADD CONSTRAINT FK_9B43FBE8A76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE site_options ADD CONSTRAINT FK_2B91184C7987212D FOREIGN KEY (app_id) REFERENCES app (id)');
        $this->addSql('ALTER TABLE site_options ADD CONSTRAINT FK_2B91184CBF396750 FOREIGN KEY (id) REFERENCES entity (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE site ADD app_id INT DEFAULT NULL, ADD hosting VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE site ADD CONSTRAINT FK_694309E47987212D FOREIGN KEY (app_id) REFERENCES app (id)');
        $this->addSql('CREATE INDEX IDX_694309E47987212D ON site (app_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE app_role DROP FOREIGN KEY FK_5247AFCA7987212D');
        $this->addSql('ALTER TABLE app_role DROP FOREIGN KEY FK_5247AFCABF396750');
        $this->addSql('ALTER TABLE app_role_user DROP FOREIGN KEY FK_9B43FBE83B5EA2E1');
        $this->addSql('ALTER TABLE app_role_user DROP FOREIGN KEY FK_9B43FBE8A76ED395');
        $this->addSql('ALTER TABLE site_options DROP FOREIGN KEY FK_2B91184C7987212D');
        $this->addSql('ALTER TABLE site_options DROP FOREIGN KEY FK_2B91184CBF396750');
        $this->addSql('DROP TABLE app_role');
        $this->addSql('DROP TABLE app_role_user');
        $this->addSql('DROP TABLE site_options');
        $this->addSql('ALTER TABLE site DROP FOREIGN KEY FK_694309E47987212D');
        $this->addSql('DROP INDEX IDX_694309E47987212D ON site');
        $this->addSql('ALTER TABLE site DROP app_id, DROP hosting');
    }
}
