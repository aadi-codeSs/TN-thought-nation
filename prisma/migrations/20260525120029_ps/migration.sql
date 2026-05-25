/*
  Warnings:

  - You are about to drop the column `content` on the `Thought` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Thought" DROP COLUMN "content",
ADD COLUMN     "description" TEXT;
