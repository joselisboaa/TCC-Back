/*
  Warnings:

  - You are about to drop the `_OrientationToResponse` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_OrientationToResponse" DROP CONSTRAINT "_OrientationToResponse_A_fkey";

-- DropForeignKey
ALTER TABLE "_OrientationToResponse" DROP CONSTRAINT "_OrientationToResponse_B_fkey";

-- DropTable
DROP TABLE "_OrientationToResponse";

-- CreateTable
CREATE TABLE "response_orientation" (
    "response_id" INTEGER NOT NULL,
    "orientation_id" INTEGER NOT NULL,

    CONSTRAINT "response_orientation_pkey" PRIMARY KEY ("response_id","orientation_id")
);

-- AddForeignKey
ALTER TABLE "response_orientation" ADD CONSTRAINT "response_orientation_response_id_fkey" FOREIGN KEY ("response_id") REFERENCES "response"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "response_orientation" ADD CONSTRAINT "response_orientation_orientation_id_fkey" FOREIGN KEY ("orientation_id") REFERENCES "orientation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
