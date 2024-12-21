-- CreateTable
CREATE TABLE "learning_resources" (
    "id" TEXT NOT NULL,
    "interviewDataId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "learning_resources_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "learning_resources_interviewDataId_idx" ON "learning_resources"("interviewDataId");

-- AddForeignKey
ALTER TABLE "learning_resources" ADD CONSTRAINT "learning_resources_interviewDataId_fkey" FOREIGN KEY ("interviewDataId") REFERENCES "interview_data"("id") ON DELETE CASCADE ON UPDATE CASCADE;
