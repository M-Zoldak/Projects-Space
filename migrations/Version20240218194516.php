<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240218194516 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE address (id INT NOT NULL, client_id INT NOT NULL, street VARCHAR(255) NOT NULL, postal VARCHAR(255) NOT NULL, city VARCHAR(255) NOT NULL, country VARCHAR(255) NOT NULL, INDEX IDX_D4E6F8119EB6921 (client_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE app (id INT NOT NULL, default_role_id INT DEFAULT NULL, owner_id INT DEFAULT NULL, name VARCHAR(255) NOT NULL, INDEX IDX_C96E70CF248673E9 (default_role_id), INDEX IDX_C96E70CF7E3C61F9 (owner_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE app_user (app_id INT NOT NULL, user_id INT NOT NULL, INDEX IDX_88BDF3E97987212D (app_id), INDEX IDX_88BDF3E9A76ED395 (user_id), PRIMARY KEY(app_id, user_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE app_users_invitation (app_id INT NOT NULL, user_id INT NOT NULL, INDEX IDX_B2482F977987212D (app_id), INDEX IDX_B2482F97A76ED395 (user_id), PRIMARY KEY(app_id, user_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE app_role (id INT NOT NULL, app_id INT DEFAULT NULL, name VARCHAR(255) NOT NULL, destroyable TINYINT(1) DEFAULT 1 NOT NULL, is_owner_role TINYINT(1) NOT NULL, INDEX IDX_5247AFCA7987212D (app_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE app_role_user (app_role_id INT NOT NULL, user_id INT NOT NULL, INDEX IDX_9B43FBE83B5EA2E1 (app_role_id), INDEX IDX_9B43FBE8A76ED395 (user_id), PRIMARY KEY(app_role_id, user_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE client (id INT NOT NULL, app_id INT DEFAULT NULL, name VARCHAR(255) NOT NULL, fax VARCHAR(255) NOT NULL, phone VARCHAR(255) NOT NULL, mobile VARCHAR(255) NOT NULL, INDEX IDX_C74404557987212D (app_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE contact_person (id INT NOT NULL, owner_company_id INT DEFAULT NULL, first_name VARCHAR(255) NOT NULL, last_name VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL, mobile VARCHAR(255) NOT NULL, role VARCHAR(255) NOT NULL, INDEX IDX_A44EE6F7C5F18393 (owner_company_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE entity (id INT AUTO_INCREMENT NOT NULL, modified_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', is_active TINYINT(1) DEFAULT 1 NOT NULL, discr VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE note (id INT NOT NULL, project_id INT DEFAULT NULL, user_id INT DEFAULT NULL, text LONGTEXT NOT NULL, title VARCHAR(255) DEFAULT NULL, INDEX IDX_CFBDFA14166D1F9C (project_id), INDEX IDX_CFBDFA14A76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE project (id INT NOT NULL, app_id INT DEFAULT NULL, client_id INT DEFAULT NULL, website_id INT DEFAULT NULL, project_state_id INT DEFAULT NULL, manager_id INT DEFAULT NULL, name VARCHAR(255) NOT NULL, participants JSON DEFAULT NULL, start_date DATE DEFAULT NULL, end_date DATE DEFAULT NULL, INDEX IDX_2FB3D0EE7987212D (app_id), INDEX IDX_2FB3D0EE19EB6921 (client_id), INDEX IDX_2FB3D0EE18F45C82 (website_id), INDEX IDX_2FB3D0EE3896B71A (project_state_id), INDEX IDX_2FB3D0EE783E3463 (manager_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE project_category (id INT NOT NULL, name VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE project_options (id INT AUTO_INCREMENT NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE project_state (id INT NOT NULL, app_id INT NOT NULL, name VARCHAR(255) NOT NULL, position INT NOT NULL, INDEX IDX_B0C6DB657987212D (app_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE section_permissions (id INT NOT NULL, app_role_id INT NOT NULL, destroy TINYINT(1) DEFAULT NULL, edit TINYINT(1) DEFAULT NULL, review TINYINT(1) DEFAULT NULL, section_name VARCHAR(255) NOT NULL, INDEX IDX_3B1CB3103B5EA2E1 (app_role_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE task (id INT NOT NULL, project_id INT DEFAULT NULL, assigned_to_id INT DEFAULT NULL, name VARCHAR(255) NOT NULL, start_date DATETIME DEFAULT NULL, end_date DATETIME DEFAULT NULL, category VARCHAR(255) NOT NULL, description LONGTEXT DEFAULT NULL, completed TINYINT(1) DEFAULT NULL, INDEX IDX_527EDB25166D1F9C (project_id), INDEX IDX_527EDB25F4BD7827 (assigned_to_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user (id INT NOT NULL, email VARCHAR(180) NOT NULL, roles JSON NOT NULL, password VARCHAR(255) NOT NULL, first_name VARCHAR(255) NOT NULL, last_name VARCHAR(255) NOT NULL, birth_date DATE NOT NULL, UNIQUE INDEX UNIQ_8D93D649E7927C74 (email), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user_notification (id INT NOT NULL, user_id INT DEFAULT NULL, icon VARCHAR(1024) DEFAULT NULL, message VARCHAR(2048) NOT NULL, is_seen TINYINT(1) NOT NULL, INDEX IDX_3F980AC8A76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user_options (id INT AUTO_INCREMENT NOT NULL, user_id INT NOT NULL, selected_app_id INT DEFAULT NULL, UNIQUE INDEX UNIQ_8838E48DA76ED395 (user_id), INDEX IDX_8838E48D852D8C6A (selected_app_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE website (id INT NOT NULL, app_id INT DEFAULT NULL, client_id INT DEFAULT NULL, hosting_id INT DEFAULT NULL, domain VARCHAR(255) NOT NULL, INDEX IDX_476F5DE77987212D (app_id), INDEX IDX_476F5DE719EB6921 (client_id), INDEX IDX_476F5DE7AE9044EA (hosting_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE website_hosting (id INT NOT NULL, website_options_id INT DEFAULT NULL, name VARCHAR(255) NOT NULL, INDEX IDX_4538F37EBBF6CBD4 (website_options_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE website_options (id INT NOT NULL, app_id INT DEFAULT NULL, UNIQUE INDEX UNIQ_7C1B86237987212D (app_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE messenger_messages (id BIGINT AUTO_INCREMENT NOT NULL, body LONGTEXT NOT NULL, headers LONGTEXT NOT NULL, queue_name VARCHAR(190) NOT NULL, created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', available_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', delivered_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_75EA56E0FB7336F0 (queue_name), INDEX IDX_75EA56E0E3BD61CE (available_at), INDEX IDX_75EA56E016BA31DB (delivered_at), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE address ADD CONSTRAINT FK_D4E6F8119EB6921 FOREIGN KEY (client_id) REFERENCES client (id)');
        $this->addSql('ALTER TABLE address ADD CONSTRAINT FK_D4E6F81BF396750 FOREIGN KEY (id) REFERENCES entity (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE app ADD CONSTRAINT FK_C96E70CF248673E9 FOREIGN KEY (default_role_id) REFERENCES app_role (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE app ADD CONSTRAINT FK_C96E70CF7E3C61F9 FOREIGN KEY (owner_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE app ADD CONSTRAINT FK_C96E70CFBF396750 FOREIGN KEY (id) REFERENCES entity (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE app_user ADD CONSTRAINT FK_88BDF3E97987212D FOREIGN KEY (app_id) REFERENCES app (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE app_user ADD CONSTRAINT FK_88BDF3E9A76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE app_users_invitation ADD CONSTRAINT FK_B2482F977987212D FOREIGN KEY (app_id) REFERENCES app (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE app_users_invitation ADD CONSTRAINT FK_B2482F97A76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE app_role ADD CONSTRAINT FK_5247AFCA7987212D FOREIGN KEY (app_id) REFERENCES app (id)');
        $this->addSql('ALTER TABLE app_role ADD CONSTRAINT FK_5247AFCABF396750 FOREIGN KEY (id) REFERENCES entity (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE app_role_user ADD CONSTRAINT FK_9B43FBE83B5EA2E1 FOREIGN KEY (app_role_id) REFERENCES app_role (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE app_role_user ADD CONSTRAINT FK_9B43FBE8A76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE client ADD CONSTRAINT FK_C74404557987212D FOREIGN KEY (app_id) REFERENCES app (id)');
        $this->addSql('ALTER TABLE client ADD CONSTRAINT FK_C7440455BF396750 FOREIGN KEY (id) REFERENCES entity (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE contact_person ADD CONSTRAINT FK_A44EE6F7C5F18393 FOREIGN KEY (owner_company_id) REFERENCES client (id)');
        $this->addSql('ALTER TABLE contact_person ADD CONSTRAINT FK_A44EE6F7BF396750 FOREIGN KEY (id) REFERENCES entity (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE note ADD CONSTRAINT FK_CFBDFA14166D1F9C FOREIGN KEY (project_id) REFERENCES project (id)');
        $this->addSql('ALTER TABLE note ADD CONSTRAINT FK_CFBDFA14A76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE note ADD CONSTRAINT FK_CFBDFA14BF396750 FOREIGN KEY (id) REFERENCES entity (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE project ADD CONSTRAINT FK_2FB3D0EE7987212D FOREIGN KEY (app_id) REFERENCES app (id)');
        $this->addSql('ALTER TABLE project ADD CONSTRAINT FK_2FB3D0EE19EB6921 FOREIGN KEY (client_id) REFERENCES client (id)');
        $this->addSql('ALTER TABLE project ADD CONSTRAINT FK_2FB3D0EE18F45C82 FOREIGN KEY (website_id) REFERENCES website (id)');
        $this->addSql('ALTER TABLE project ADD CONSTRAINT FK_2FB3D0EE3896B71A FOREIGN KEY (project_state_id) REFERENCES project_state (id)');
        $this->addSql('ALTER TABLE project ADD CONSTRAINT FK_2FB3D0EE783E3463 FOREIGN KEY (manager_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE project ADD CONSTRAINT FK_2FB3D0EEBF396750 FOREIGN KEY (id) REFERENCES entity (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE project_category ADD CONSTRAINT FK_3B02921ABF396750 FOREIGN KEY (id) REFERENCES entity (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE project_state ADD CONSTRAINT FK_B0C6DB657987212D FOREIGN KEY (app_id) REFERENCES app (id)');
        $this->addSql('ALTER TABLE project_state ADD CONSTRAINT FK_B0C6DB65BF396750 FOREIGN KEY (id) REFERENCES entity (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE section_permissions ADD CONSTRAINT FK_3B1CB3103B5EA2E1 FOREIGN KEY (app_role_id) REFERENCES app_role (id)');
        $this->addSql('ALTER TABLE section_permissions ADD CONSTRAINT FK_3B1CB310BF396750 FOREIGN KEY (id) REFERENCES entity (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE task ADD CONSTRAINT FK_527EDB25166D1F9C FOREIGN KEY (project_id) REFERENCES project (id)');
        $this->addSql('ALTER TABLE task ADD CONSTRAINT FK_527EDB25F4BD7827 FOREIGN KEY (assigned_to_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE task ADD CONSTRAINT FK_527EDB25BF396750 FOREIGN KEY (id) REFERENCES entity (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE user ADD CONSTRAINT FK_8D93D649BF396750 FOREIGN KEY (id) REFERENCES entity (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE user_notification ADD CONSTRAINT FK_3F980AC8A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE user_notification ADD CONSTRAINT FK_3F980AC8BF396750 FOREIGN KEY (id) REFERENCES entity (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE user_options ADD CONSTRAINT FK_8838E48DA76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE user_options ADD CONSTRAINT FK_8838E48D852D8C6A FOREIGN KEY (selected_app_id) REFERENCES app (id)');
        $this->addSql('ALTER TABLE website ADD CONSTRAINT FK_476F5DE77987212D FOREIGN KEY (app_id) REFERENCES app (id)');
        $this->addSql('ALTER TABLE website ADD CONSTRAINT FK_476F5DE719EB6921 FOREIGN KEY (client_id) REFERENCES client (id)');
        $this->addSql('ALTER TABLE website ADD CONSTRAINT FK_476F5DE7AE9044EA FOREIGN KEY (hosting_id) REFERENCES website_hosting (id)');
        $this->addSql('ALTER TABLE website ADD CONSTRAINT FK_476F5DE7BF396750 FOREIGN KEY (id) REFERENCES entity (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE website_hosting ADD CONSTRAINT FK_4538F37EBBF6CBD4 FOREIGN KEY (website_options_id) REFERENCES website_options (id)');
        $this->addSql('ALTER TABLE website_hosting ADD CONSTRAINT FK_4538F37EBF396750 FOREIGN KEY (id) REFERENCES entity (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE website_options ADD CONSTRAINT FK_7C1B86237987212D FOREIGN KEY (app_id) REFERENCES app (id)');
        $this->addSql('ALTER TABLE website_options ADD CONSTRAINT FK_7C1B8623BF396750 FOREIGN KEY (id) REFERENCES entity (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE address DROP FOREIGN KEY FK_D4E6F8119EB6921');
        $this->addSql('ALTER TABLE address DROP FOREIGN KEY FK_D4E6F81BF396750');
        $this->addSql('ALTER TABLE app DROP FOREIGN KEY FK_C96E70CF248673E9');
        $this->addSql('ALTER TABLE app DROP FOREIGN KEY FK_C96E70CF7E3C61F9');
        $this->addSql('ALTER TABLE app DROP FOREIGN KEY FK_C96E70CFBF396750');
        $this->addSql('ALTER TABLE app_user DROP FOREIGN KEY FK_88BDF3E97987212D');
        $this->addSql('ALTER TABLE app_user DROP FOREIGN KEY FK_88BDF3E9A76ED395');
        $this->addSql('ALTER TABLE app_users_invitation DROP FOREIGN KEY FK_B2482F977987212D');
        $this->addSql('ALTER TABLE app_users_invitation DROP FOREIGN KEY FK_B2482F97A76ED395');
        $this->addSql('ALTER TABLE app_role DROP FOREIGN KEY FK_5247AFCA7987212D');
        $this->addSql('ALTER TABLE app_role DROP FOREIGN KEY FK_5247AFCABF396750');
        $this->addSql('ALTER TABLE app_role_user DROP FOREIGN KEY FK_9B43FBE83B5EA2E1');
        $this->addSql('ALTER TABLE app_role_user DROP FOREIGN KEY FK_9B43FBE8A76ED395');
        $this->addSql('ALTER TABLE client DROP FOREIGN KEY FK_C74404557987212D');
        $this->addSql('ALTER TABLE client DROP FOREIGN KEY FK_C7440455BF396750');
        $this->addSql('ALTER TABLE contact_person DROP FOREIGN KEY FK_A44EE6F7C5F18393');
        $this->addSql('ALTER TABLE contact_person DROP FOREIGN KEY FK_A44EE6F7BF396750');
        $this->addSql('ALTER TABLE note DROP FOREIGN KEY FK_CFBDFA14166D1F9C');
        $this->addSql('ALTER TABLE note DROP FOREIGN KEY FK_CFBDFA14A76ED395');
        $this->addSql('ALTER TABLE note DROP FOREIGN KEY FK_CFBDFA14BF396750');
        $this->addSql('ALTER TABLE project DROP FOREIGN KEY FK_2FB3D0EE7987212D');
        $this->addSql('ALTER TABLE project DROP FOREIGN KEY FK_2FB3D0EE19EB6921');
        $this->addSql('ALTER TABLE project DROP FOREIGN KEY FK_2FB3D0EE18F45C82');
        $this->addSql('ALTER TABLE project DROP FOREIGN KEY FK_2FB3D0EE3896B71A');
        $this->addSql('ALTER TABLE project DROP FOREIGN KEY FK_2FB3D0EE783E3463');
        $this->addSql('ALTER TABLE project DROP FOREIGN KEY FK_2FB3D0EEBF396750');
        $this->addSql('ALTER TABLE project_category DROP FOREIGN KEY FK_3B02921ABF396750');
        $this->addSql('ALTER TABLE project_state DROP FOREIGN KEY FK_B0C6DB657987212D');
        $this->addSql('ALTER TABLE project_state DROP FOREIGN KEY FK_B0C6DB65BF396750');
        $this->addSql('ALTER TABLE section_permissions DROP FOREIGN KEY FK_3B1CB3103B5EA2E1');
        $this->addSql('ALTER TABLE section_permissions DROP FOREIGN KEY FK_3B1CB310BF396750');
        $this->addSql('ALTER TABLE task DROP FOREIGN KEY FK_527EDB25166D1F9C');
        $this->addSql('ALTER TABLE task DROP FOREIGN KEY FK_527EDB25F4BD7827');
        $this->addSql('ALTER TABLE task DROP FOREIGN KEY FK_527EDB25BF396750');
        $this->addSql('ALTER TABLE user DROP FOREIGN KEY FK_8D93D649BF396750');
        $this->addSql('ALTER TABLE user_notification DROP FOREIGN KEY FK_3F980AC8A76ED395');
        $this->addSql('ALTER TABLE user_notification DROP FOREIGN KEY FK_3F980AC8BF396750');
        $this->addSql('ALTER TABLE user_options DROP FOREIGN KEY FK_8838E48DA76ED395');
        $this->addSql('ALTER TABLE user_options DROP FOREIGN KEY FK_8838E48D852D8C6A');
        $this->addSql('ALTER TABLE website DROP FOREIGN KEY FK_476F5DE77987212D');
        $this->addSql('ALTER TABLE website DROP FOREIGN KEY FK_476F5DE719EB6921');
        $this->addSql('ALTER TABLE website DROP FOREIGN KEY FK_476F5DE7AE9044EA');
        $this->addSql('ALTER TABLE website DROP FOREIGN KEY FK_476F5DE7BF396750');
        $this->addSql('ALTER TABLE website_hosting DROP FOREIGN KEY FK_4538F37EBBF6CBD4');
        $this->addSql('ALTER TABLE website_hosting DROP FOREIGN KEY FK_4538F37EBF396750');
        $this->addSql('ALTER TABLE website_options DROP FOREIGN KEY FK_7C1B86237987212D');
        $this->addSql('ALTER TABLE website_options DROP FOREIGN KEY FK_7C1B8623BF396750');
        $this->addSql('DROP TABLE address');
        $this->addSql('DROP TABLE app');
        $this->addSql('DROP TABLE app_user');
        $this->addSql('DROP TABLE app_users_invitation');
        $this->addSql('DROP TABLE app_role');
        $this->addSql('DROP TABLE app_role_user');
        $this->addSql('DROP TABLE client');
        $this->addSql('DROP TABLE contact_person');
        $this->addSql('DROP TABLE entity');
        $this->addSql('DROP TABLE note');
        $this->addSql('DROP TABLE project');
        $this->addSql('DROP TABLE project_category');
        $this->addSql('DROP TABLE project_options');
        $this->addSql('DROP TABLE project_state');
        $this->addSql('DROP TABLE section_permissions');
        $this->addSql('DROP TABLE task');
        $this->addSql('DROP TABLE user');
        $this->addSql('DROP TABLE user_notification');
        $this->addSql('DROP TABLE user_options');
        $this->addSql('DROP TABLE website');
        $this->addSql('DROP TABLE website_hosting');
        $this->addSql('DROP TABLE website_options');
        $this->addSql('DROP TABLE messenger_messages');
    }
}
