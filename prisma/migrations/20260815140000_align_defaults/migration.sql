-- Alignement des valeurs par défaut CompanyInfo et Service
ALTER TABLE "CompanyInfo" ALTER COLUMN "name" SET DEFAULT 'collab·dev',
ALTER COLUMN "legalName" SET DEFAULT 'Collectif collab·dev';

ALTER TABLE "Service" ALTER COLUMN "details" DROP DEFAULT;
