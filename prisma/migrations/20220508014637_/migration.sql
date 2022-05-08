/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `participant` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `participant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `participant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "participant" ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "gender" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "settings" (
    "id" SERIAL NOT NULL,
    "words_per_minute" INTEGER NOT NULL,
    "instructions" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "participant_email_key" ON "participant"("email");
