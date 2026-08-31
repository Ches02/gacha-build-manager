/*
  Warnings:

  - You are about to drop the column `mainStatType` on the `WeaponDefinition` table. All the data in the column will be lost.
  - Added the required column `BaseATK` to the `WeaponDefinition` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_WeaponDefinition" (
    "key" TEXT NOT NULL PRIMARY KEY,
    "rarity" INTEGER NOT NULL,
    "BaseATK" TEXT NOT NULL,
    "subStatType" TEXT NOT NULL
);
INSERT INTO "new_WeaponDefinition" ("key", "rarity", "subStatType") SELECT "key", "rarity", "subStatType" FROM "WeaponDefinition";
DROP TABLE "WeaponDefinition";
ALTER TABLE "new_WeaponDefinition" RENAME TO "WeaponDefinition";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
