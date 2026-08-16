-- AlterTable CompanyInfo: responsable de facturation + coordonnées bancaires
ALTER TABLE "CompanyInfo" ADD COLUMN "representative" TEXT NOT NULL DEFAULT '',
ADD COLUMN "representativeRole" TEXT NOT NULL DEFAULT '',
ADD COLUMN "legalStatus" TEXT,
ADD COLUMN "iban" TEXT,
ADD COLUMN "bic" TEXT;

-- AlterTable Invoice: jeton de téléchargement public
ALTER TABLE "Invoice" ADD COLUMN "downloadToken" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_downloadToken_key" ON "Invoice"("downloadToken");

-- AlterTable Service: colonne slug restée non migrée (drift)
ALTER TABLE "Service" ADD COLUMN "slug" TEXT;
UPDATE "Service" SET "slug" = lower(regexp_replace(regexp_replace("name", '[^a-zA-Z0-9]+', '-', 'g'), '^-+|-+$', '', 'g')) WHERE "slug" IS NULL;
ALTER TABLE "Service" ALTER COLUMN "slug" SET NOT NULL;
CREATE UNIQUE INDEX "Service_slug_key" ON "Service"("slug");
