/*
  Warnings:

  - You are about to drop the `orientation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `response` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `response_orientation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "orientation" DROP CONSTRAINT "orientation_answer_id_fkey";

-- DropForeignKey
ALTER TABLE "response" DROP CONSTRAINT "response_user_id_fkey";

-- DropForeignKey
ALTER TABLE "response_orientation" DROP CONSTRAINT "response_orientation_orientation_id_fkey";

-- DropForeignKey
ALTER TABLE "response_orientation" DROP CONSTRAINT "response_orientation_response_id_fkey";

-- DropTable
DROP TABLE "orientation";

-- DropTable
DROP TABLE "response";

-- DropTable
DROP TABLE "response_orientation";

-- CreateTable
CREATE TABLE "Response" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "Response_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Orientation" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "answer_id" INTEGER NOT NULL,

    CONSTRAINT "Orientation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResponseOrientation" (
    "response_id" INTEGER NOT NULL,
    "orientation_id" INTEGER NOT NULL,

    CONSTRAINT "ResponseOrientation_pkey" PRIMARY KEY ("response_id","orientation_id")
);

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orientation" ADD CONSTRAINT "Orientation_answer_id_fkey" FOREIGN KEY ("answer_id") REFERENCES "answer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResponseOrientation" ADD CONSTRAINT "ResponseOrientation_response_id_fkey" FOREIGN KEY ("response_id") REFERENCES "Response"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResponseOrientation" ADD CONSTRAINT "ResponseOrientation_orientation_id_fkey" FOREIGN KEY ("orientation_id") REFERENCES "Orientation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
