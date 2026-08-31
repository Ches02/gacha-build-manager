/*
  Warnings:

  - You are about to drop the column `subStatType` on the `WeaponDefinition` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "StatType" (
    "key" TEXT NOT NULL PRIMARY KEY
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_WeaponDefinition" (
    "key" TEXT NOT NULL PRIMARY KEY,
    "rarity" INTEGER NOT NULL,
    "baseATK" INTEGER NOT NULL,
    "subStatTypeKey" TEXT NOT NULL DEFAULT 'ATK%',
    "subStat" REAL NOT NULL,
    "weaponTypeKey" TEXT NOT NULL,
    CONSTRAINT "WeaponDefinition_weaponTypeKey_fkey" FOREIGN KEY ("weaponTypeKey") REFERENCES "WeaponType" ("key") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "WeaponDefinition_subStatTypeKey_fkey" FOREIGN KEY ("subStatTypeKey") REFERENCES "StatType" ("key") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_WeaponDefinition" ("baseATK", "key", "rarity", "subStat", "weaponTypeKey") SELECT "baseATK", "key", "rarity", "subStat", "weaponTypeKey" FROM "WeaponDefinition";
DROP TABLE "WeaponDefinition";
ALTER TABLE "new_WeaponDefinition" RENAME TO "WeaponDefinition";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
