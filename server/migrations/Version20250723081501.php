<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20250723081501 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Make product_id_id the primary key and remove auto-incremented id';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE images DROP FOREIGN KEY FK_E01FBE6ADE18E50B');
        $this->addSql('ALTER TABLE images MODIFY id INT NOT NULL');
        $this->addSql('DROP INDEX IDX_E01FBE6ADE18E50B ON images');
        $this->addSql('DROP INDEX `primary` ON images');
        $this->addSql('ALTER TABLE images DROP id');
        $this->addSql('ALTER TABLE images ADD PRIMARY KEY (product_id_id)');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE images ADD id INT AUTO_INCREMENT NOT NULL');
        $this->addSql('ALTER TABLE images DROP PRIMARY KEY');
        $this->addSql('ALTER TABLE images ADD PRIMARY KEY (id)');
        $this->addSql('CREATE INDEX IDX_E01FBE6ADE18E50B ON images (product_id_id)');
        $this->addSql('ALTER TABLE images ADD CONSTRAINT FK_E01FBE6ADE18E50B FOREIGN KEY (product_id_id) REFERENCES product (id)');
    }
}
