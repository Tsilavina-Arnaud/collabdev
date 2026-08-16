-- AlterTable Service: colonnes details et duration restées non migrées (drift)
ALTER TABLE "Service" ADD COLUMN     "details" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "duration" TEXT;
