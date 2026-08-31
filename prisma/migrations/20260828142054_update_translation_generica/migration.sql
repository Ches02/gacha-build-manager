/*
  Warnings:

  - You are about to drop the column `BaseATK` on the `WeaponDefinition` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CharacterDefinition" (
    "key" TEXT NOT NULL PRIMARY KEY,
    "rarity" INTEGER NOT NULL,
    "element" TEXT NOT NULL,
    "weaponTypeKey" TEXT NOT NULL,
    CONSTRAINT "CharacterDefinition_weaponTypeKey_fkey" FOREIGN KEY ("weaponTypeKey") REFERENCES "WeaponType" ("key") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CharacterDefinition" ("element", "key", "rarity", "weaponTypeKey") SELECT "element", "key", "rarity", "weaponTypeKey" FROM "CharacterDefinition";
DROP TABLE "CharacterDefinition";
ALTER TABLE "new_CharacterDefinition" RENAME TO "CharacterDefinition";
CREATE TABLE "new_WeaponDefinition" (
    "key" TEXT NOT NULL PRIMARY KEY,
    "rarity" INTEGER NOT NULL,
    "baseATK" INTEGER NOT NULL DEFAULT 46,
    "subStatType" TEXT NOT NULL,
    "subStat" REAL NOT NULL,
    "weaponTypeKey" TEXT NOT NULL DEFAULT '0',
    CONSTRAINT "WeaponDefinition_weaponTypeKey_fkey" FOREIGN KEY ("weaponTypeKey") REFERENCES "WeaponType" ("key") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_WeaponDefinition" ("key", "rarity", "subStat", "subStatType") SELECT "key", "rarity", "subStat", "subStatType" FROM "WeaponDefinition";
DROP TABLE "WeaponDefinition";
ALTER TABLE "new_WeaponDefinition" RENAME TO "WeaponDefinition";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
