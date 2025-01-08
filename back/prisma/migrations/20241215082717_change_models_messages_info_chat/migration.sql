-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_id_fkey";

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "infoId" INTEGER;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_infoId_fkey" FOREIGN KEY ("infoId") REFERENCES "Info"("id") ON DELETE SET NULL ON UPDATE CASCADE;
