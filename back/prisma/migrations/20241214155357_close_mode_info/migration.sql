/*
  Warnings:

  - You are about to drop the `Info` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_id_fkey";

-- DropTable
DROP TABLE "Info";
