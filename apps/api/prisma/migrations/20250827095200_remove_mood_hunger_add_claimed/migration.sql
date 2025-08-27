/*
  Warnings:

  - You are about to drop the column `hunger` on the `monsters` table. All the data in the column will be lost.
  - You are about to drop the column `lastFedAt` on the `monsters` table. All the data in the column will be lost.
  - You are about to drop the column `mood` on the `monsters` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_achievements" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "earnedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "claimed" BOOLEAN NOT NULL DEFAULT false,
    "meta" TEXT,
    CONSTRAINT "achievements_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_achievements" ("earnedAt", "id", "meta", "slug", "userId") SELECT "earnedAt", "id", "meta", "slug", "userId" FROM "achievements";
DROP TABLE "achievements";
ALTER TABLE "new_achievements" RENAME TO "achievements";
CREATE UNIQUE INDEX "achievements_userId_slug_key" ON "achievements"("userId", "slug");
CREATE TABLE "new_monsters" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ownerId" TEXT NOT NULL,
    "species" TEXT NOT NULL DEFAULT 'slime',
    "stage" INTEGER NOT NULL DEFAULT 1,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "lastActiveAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "monsters_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_monsters" ("createdAt", "id", "lastActiveAt", "ownerId", "species", "stage", "updatedAt", "xp") SELECT "createdAt", "id", "lastActiveAt", "ownerId", "species", "stage", "updatedAt", "xp" FROM "monsters";
DROP TABLE "monsters";
ALTER TABLE "new_monsters" RENAME TO "monsters";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
