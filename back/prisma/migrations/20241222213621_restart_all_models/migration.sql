/*
  Warnings:

  - Added the required column `type` to the `Chat` table without a default value. This is not possible if the table is not empty.
  - Made the column `creatorId` on table `Chat` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_creatorId_fkey";

-- AlterTable
ALTER TABLE "Chat" ADD COLUMN     "avatar" TEXT,
ADD COLUMN     "lastMessage" TEXT,
ADD COLUMN     "type" TEXT NOT NULL,
ALTER COLUMN "creatorId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
