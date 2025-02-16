/*
  Warnings:

  - You are about to drop the `QuestionsOnAnswers` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `question_id` to the `answer` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "QuestionsOnAnswers" DROP CONSTRAINT "QuestionsOnAnswers_answerId_fkey";

-- DropForeignKey
ALTER TABLE "QuestionsOnAnswers" DROP CONSTRAINT "QuestionsOnAnswers_questionId_fkey";

-- AlterTable
ALTER TABLE "answer" ADD COLUMN     "question_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "QuestionsOnAnswers";

-- AddForeignKey
ALTER TABLE "answer" ADD CONSTRAINT "answer_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
