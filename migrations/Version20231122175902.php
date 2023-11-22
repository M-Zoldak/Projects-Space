<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20231122175902 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE app (id INT NOT NULL, name VARCHAR(255) NOT NULL, app_head_admin_name VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE app_user (app_id INT NOT NULL, user_id INT NOT NULL, INDEX IDX_88BDF3E97987212D (app_id), INDEX IDX_88BDF3E9A76ED395 (user_id), PRIMARY KEY(app_id, user_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE app_role (id INT NOT NULL, app_id INT DEFAULT NULL, name VARCHAR(255) NOT NULL, destroyable TINYINT(1) DEFAULT 1 NOT NULL, INDEX IDX_5247AFCA7987212D (app_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE app_role_user (app_role_id INT NOT NULL, user_id INT NOT NULL, INDEX IDX_9B43FBE83B5EA2E1 (app_role_id), INDEX IDX_9B43FBE8A76ED395 (user_id), PRIMARY KEY(app_role_id, user_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE customer (id INT NOT NULL, app_id INT DEFAULT NULL, name VARCHAR(255) NOT NULL, email VARCHAR(255) DEFAULT NULL, phone_number VARCHAR(255) DEFAULT NULL, mobile_number VARCHAR(255) DEFAULT NULL, city VARCHAR(255) DEFAULT NULL, postal_code VARCHAR(64) DEFAULT NULL, street VARCHAR(255) DEFAULT NULL, home_number VARCHAR(255) DEFAULT NULL, INDEX IDX_81398E097987212D (app_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE entity (id INT AUTO_INCREMENT NOT NULL, modified_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', is_active TINYINT(1) DEFAULT 1 NOT NULL, discr VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE project (id INT NOT NULL, app_id INT DEFAULT NULL, name VARCHAR(255) NOT NULL, INDEX IDX_2FB3D0EE7987212D (app_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE project_role (id INT NOT NULL, project_id INT NOT NULL, user_id INT NOT NULL, role VARCHAR(255) NOT NULL, INDEX IDX_6EF84272166D1F9C (project_id), INDEX IDX_6EF84272A76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE section_permissions (id INT NOT NULL, app_role_id INT NOT NULL, destroy TINYINT(1) DEFAULT NULL, edit TINYINT(1) DEFAULT NULL, review TINYINT(1) DEFAULT NULL, section_name VARCHAR(255) NOT NULL, INDEX IDX_3B1CB3103B5EA2E1 (app_role_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE site (id INT NOT NULL, app_id INT DEFAULT NULL, domain VARCHAR(255) NOT NULL, hosting VARCHAR(255) DEFAULT NULL, INDEX IDX_694309E47987212D (app_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE site_options (id INT NOT NULL, app_id INT DEFAULT NULL, hosting VARCHAR(255) DEFAULT NULL, hostings_list JSON DEFAULT NULL, UNIQUE INDEX UNIQ_2B91184C7987212D (app_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user (id INT NOT NULL, email VARCHAR(180) NOT NULL, roles JSON NOT NULL, password VARCHAR(255) NOT NULL, first_name VARCHAR(255) NOT NULL, last_name VARCHAR(255) NOT NULL, birth_date DATE NOT NULL, UNIQUE INDEX UNIQ_8D93D649E7927C74 (email), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user_options (id INT AUTO_INCREMENT NOT NULL, user_id INT NOT NULL, selected_app_id INT DEFAULT NULL, UNIQUE INDEX UNIQ_8838E48DA76ED395 (user_id), INDEX IDX_8838E48D852D8C6A (selected_app_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE messenger_messages (id BIGINT AUTO_INCREMENT NOT NULL, body LONGTEXT NOT NULL, headers LONGTEXT NOT NULL, queue_name VARCHAR(190) NOT NULL, created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', available_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', delivered_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_75EA56E0FB7336F0 (queue_name), INDEX IDX_75EA56E0E3BD61CE (available_at), INDEX IDX_75EA56E016BA31DB (delivered_at), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE app ADD CONSTRAINT FK_C96E70CFBF396750 FOREIGN KEY (id) REFERENCES entity (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE app_user ADD CONSTRAINT FK_88BDF3E97987212D FOREIGN KEY (app_id) REFERENCES app (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE app_user ADD CONSTRAINT FK_88BDF3E9A76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE app_role ADD CONSTRAINT FK_5247AFCA7987212D FOREIGN KEY (app_id) REFERENCES app (id)');
        $this->addSql('ALTER TABLE app_role ADD CONSTRAINT FK_5247AFCABF396750 FOREIGN KEY (id) REFERENCES entity (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE app_role_user ADD CONSTRAINT FK_9B43FBE83B5EA2E1 FOREIGN KEY (app_role_id) REFERENCES app_role (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE app_role_user ADD CONSTRAINT FK_9B43FBE8A76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE customer ADD CONSTRAINT FK_81398E097987212D FOREIGN KEY (app_id) REFERENCES app (id)');
        $this->addSql('ALTER TABLE customer ADD CONSTRAINT FK_81398E09BF396750 FOREIGN KEY (id) REFERENCES entity (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE project ADD CONSTRAINT FK_2FB3D0EE7987212D FOREIGN KEY (app_id) REFERENCES app (id)');
        $this->addSql('ALTER TABLE project ADD CONSTRAINT FK_2FB3D0EEBF396750 FOREIGN KEY (id) REFERENCES entity (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE project_role ADD CONSTRAINT FK_6EF84272166D1F9C FOREIGN KEY (project_id) REFERENCES project (id)');
        $this->addSql('ALTER TABLE project_role ADD CONSTRAINT FK_6EF84272A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE project_role ADD CONSTRAINT FK_6EF84272BF396750 FOREIGN KEY (id) REFERENCES entity (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE section_permissions ADD CONSTRAINT FK_3B1CB3103B5EA2E1 FOREIGN KEY (app_role_id) REFERENCES app_role (id)');
        $this->addSql('ALTER TABLE section_permissions ADD CONSTRAINT FK_3B1CB310BF396750 FOREIGN KEY (id) REFERENCES entity (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE site ADD CONSTRAINT FK_694309E47987212D FOREIGN KEY (app_id) REFERENCES app (id)');
        $this->addSql('ALTER TABLE site ADD CONSTRAINT FK_694309E4BF396750 FOREIGN KEY (id) REFERENCES entity (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE site_options ADD CONSTRAINT FK_2B91184C7987212D FOREIGN KEY (app_id) REFERENCES app (id)');
        $this->addSql('ALTER TABLE site_options ADD CONSTRAINT FK_2B91184CBF396750 FOREIGN KEY (id) REFERENCES entity (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE user ADD CONSTRAINT FK_8D93D649BF396750 FOREIGN KEY (id) REFERENCES entity (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE user_options ADD CONSTRAINT FK_8838E48DA76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE user_options ADD CONSTRAINT FK_8838E48D852D8C6A FOREIGN KEY (selected_app_id) REFERENCES app (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE app DROP FOREIGN KEY FK_C96E70CFBF396750');
        $this->addSql('ALTER TABLE app_user DROP FOREIGN KEY FK_88BDF3E97987212D');
        $this->addSql('ALTER TABLE app_user DROP FOREIGN KEY FK_88BDF3E9A76ED395');
        $this->addSql('ALTER TABLE app_role DROP FOREIGN KEY FK_5247AFCA7987212D');
        $this->addSql('ALTER TABLE app_role DROP FOREIGN KEY FK_5247AFCABF396750');
        $this->addSql('ALTER TABLE app_role_user DROP FOREIGN KEY FK_9B43FBE83B5EA2E1');
        $this->addSql('ALTER TABLE app_role_user DROP FOREIGN KEY FK_9B43FBE8A76ED395');
        $this->addSql('ALTER TABLE customer DROP FOREIGN KEY FK_81398E097987212D');
        $this->addSql('ALTER TABLE customer DROP FOREIGN KEY FK_81398E09BF396750');
        $this->addSql('ALTER TABLE project DROP FOREIGN KEY FK_2FB3D0EE7987212D');
        $this->addSql('ALTER TABLE project DROP FOREIGN KEY FK_2FB3D0EEBF396750');
        $this->addSql('ALTER TABLE project_role DROP FOREIGN KEY FK_6EF84272166D1F9C');
        $this->addSql('ALTER TABLE project_role DROP FOREIGN KEY FK_6EF84272A76ED395');
        $this->addSql('ALTER TABLE project_role DROP FOREIGN KEY FK_6EF84272BF396750');
        $this->addSql('ALTER TABLE section_permissions DROP FOREIGN KEY FK_3B1CB3103B5EA2E1');
        $this->addSql('ALTER TABLE section_permissions DROP FOREIGN KEY FK_3B1CB310BF396750');
        $this->addSql('ALTER TABLE site DROP FOREIGN KEY FK_694309E47987212D');
        $this->addSql('ALTER TABLE site DROP FOREIGN KEY FK_694309E4BF396750');
        $this->addSql('ALTER TABLE site_options DROP FOREIGN KEY FK_2B91184C7987212D');
        $this->addSql('ALTER TABLE site_options DROP FOREIGN KEY FK_2B91184CBF396750');
        $this->addSql('ALTER TABLE user DROP FOREIGN KEY FK_8D93D649BF396750');
        $this->addSql('ALTER TABLE user_options DROP FOREIGN KEY FK_8838E48DA76ED395');
        $this->addSql('ALTER TABLE user_options DROP FOREIGN KEY FK_8838E48D852D8C6A');
        $this->addSql('DROP TABLE app');
        $this->addSql('DROP TABLE app_user');
        $this->addSql('DROP TABLE app_role');
        $this->addSql('DROP TABLE app_role_user');
        $this->addSql('DROP TABLE customer');
        $this->addSql('DROP TABLE entity');
        $this->addSql('DROP TABLE project');
        $this->addSql('DROP TABLE project_role');
        $this->addSql('DROP TABLE section_permissions');
        $this->addSql('DROP TABLE site');
        $this->addSql('DROP TABLE site_options');
        $this->addSql('DROP TABLE user');
        $this->addSql('DROP TABLE user_options');
        $this->addSql('DROP TABLE messenger_messages');
    }
}
