-- CreateEnum
CREATE TYPE "InterviewDifficulty" AS ENUM ('JUNIOR', 'MID_LEVEL', 'SENIOR', 'LEAD', 'PRINCIPAL');

-- AlterTable
ALTER TABLE "interviews" ADD COLUMN     "communicationScore" DOUBLE PRECISION,
ADD COLUMN     "difficulty" "InterviewDifficulty" NOT NULL DEFAULT 'JUNIOR',
ADD COLUMN     "duration" INTEGER,
ADD COLUMN     "problemSolvingScore" DOUBLE PRECISION,
ADD COLUMN     "questionsAnswered" INTEGER,
ADD COLUMN     "skillsAssessed" TEXT[],
ADD COLUMN     "technicalScore" DOUBLE PRECISION,
ADD COLUMN     "yearsOfExperience" INTEGER NOT NULL DEFAULT 0;
