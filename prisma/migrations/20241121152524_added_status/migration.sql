-- AlterTable
ALTER TABLE "interviews" ADD COLUMN     "errorMessage" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'PROCESSING';
