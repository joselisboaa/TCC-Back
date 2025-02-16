/*
  Warnings:

  - You are about to drop the column `question_id` on the `answer` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "answer" DROP CONSTRAINT "answer_question_id_fkey";

-- AlterTable
ALTER TABLE "answer" DROP COLUMN "question_id";

-- CreateTable
CREATE TABLE "QuestionsOnAnswers" (
    "questionId" INTEGER NOT NULL,
    "answerId" INTEGER NOT NULL,

    CONSTRAINT "QuestionsOnAnswers_pkey" PRIMARY KEY ("questionId","answerId")
);

-- AddForeignKey
ALTER TABLE "QuestionsOnAnswers" ADD CONSTRAINT "QuestionsOnAnswers_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionsOnAnswers" ADD CONSTRAINT "QuestionsOnAnswers_answerId_fkey" FOREIGN KEY ("answerId") REFERENCES "answer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
