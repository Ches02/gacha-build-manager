/*
  Warnings:

  - You are about to alter the column `BaseATK` on the `WeaponDefinition` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_WeaponDefinition" (
    "key" TEXT NOT NULL PRIMARY KEY,
    "rarity" INTEGER NOT NULL,
    "BaseATK" INTEGER NOT NULL,
    "subStatType" TEXT NOT NULL,
    "subStat" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_WeaponDefinition" ("BaseATK", "key", "rarity", "subStatType") SELECT "BaseATK", "key", "rarity", "subStatType" FROM "WeaponDefinition";
DROP TABLE "WeaponDefinition";
ALTER TABLE "new_WeaponDefinition" RENAME TO "WeaponDefinition";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
