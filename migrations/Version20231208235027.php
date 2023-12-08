<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20231208235027 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE website (id INT NOT NULL, app_id INT DEFAULT NULL, domain VARCHAR(255) NOT NULL, hosting VARCHAR(255) DEFAULT NULL, INDEX IDX_476F5DE77987212D (app_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE website_options (id INT NOT NULL, app_id INT DEFAULT NULL, hosting VARCHAR(255) DEFAULT NULL, hostings_list JSON DEFAULT NULL, UNIQUE INDEX UNIQ_7C1B86237987212D (app_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE website ADD CONSTRAINT FK_476F5DE77987212D FOREIGN KEY (app_id) REFERENCES app (id)');
        $this->addSql('ALTER TABLE website ADD CONSTRAINT FK_476F5DE7BF396750 FOREIGN KEY (id) REFERENCES entity (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE website_options ADD CONSTRAINT FK_7C1B86237987212D FOREIGN KEY (app_id) REFERENCES app (id)');
        $this->addSql('ALTER TABLE website_options ADD CONSTRAINT FK_7C1B8623BF396750 FOREIGN KEY (id) REFERENCES entity (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE site_options DROP FOREIGN KEY FK_2B91184C7987212D');
        $this->addSql('ALTER TABLE site_options DROP FOREIGN KEY FK_2B91184CBF396750');
        $this->addSql('ALTER TABLE site DROP FOREIGN KEY FK_694309E47987212D');
        $this->addSql('ALTER TABLE site DROP FOREIGN KEY FK_694309E4BF396750');
        $this->addSql('DROP TABLE site_options');
        $this->addSql('DROP TABLE site');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE site_options (id INT NOT NULL, app_id INT DEFAULT NULL, hosting VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT NULL COLLATE `utf8mb4_unicode_ci`, hostings_list JSON DEFAULT NULL, UNIQUE INDEX UNIQ_2B91184C7987212D (app_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('CREATE TABLE site (id INT NOT NULL, app_id INT DEFAULT NULL, domain VARCHAR(255) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, hosting VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT NULL COLLATE `utf8mb4_unicode_ci`, INDEX IDX_694309E47987212D (app_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('ALTER TABLE site_options ADD CONSTRAINT FK_2B91184C7987212D FOREIGN KEY (app_id) REFERENCES app (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
        $this->addSql('ALTER TABLE site_options ADD CONSTRAINT FK_2B91184CBF396750 FOREIGN KEY (id) REFERENCES entity (id) ON UPDATE NO ACTION ON DELETE CASCADE');
        $this->addSql('ALTER TABLE site ADD CONSTRAINT FK_694309E47987212D FOREIGN KEY (app_id) REFERENCES app (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
        $this->addSql('ALTER TABLE site ADD CONSTRAINT FK_694309E4BF396750 FOREIGN KEY (id) REFERENCES entity (id) ON UPDATE NO ACTION ON DELETE CASCADE');
        $this->addSql('ALTER TABLE website DROP FOREIGN KEY FK_476F5DE77987212D');
        $this->addSql('ALTER TABLE website DROP FOREIGN KEY FK_476F5DE7BF396750');
        $this->addSql('ALTER TABLE website_options DROP FOREIGN KEY FK_7C1B86237987212D');
        $this->addSql('ALTER TABLE website_options DROP FOREIGN KEY FK_7C1B8623BF396750');
        $this->addSql('DROP TABLE website');
        $this->addSql('DROP TABLE website_options');
    }
}
