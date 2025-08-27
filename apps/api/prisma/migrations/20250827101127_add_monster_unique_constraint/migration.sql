/*
  Warnings:

  - A unique constraint covering the columns `[ownerId,species]` on the table `monsters` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "monsters_ownerId_species_key" ON "monsters"("ownerId", "species");
