/*
  Warnings:

  - You are about to drop the column `nation` on the `Character` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Character" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "definitionKey" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "constellation" INTEGER NOT NULL,
    "friendship" INTEGER NOT NULL,
    "ascension" INTEGER NOT NULL,
    "normalAttackLevel" INTEGER NOT NULL,
    "elementalSkillLevel" INTEGER NOT NULL,
    "elementalBurstLevel" INTEGER NOT NULL,
    CONSTRAINT "Character_definitionKey_fkey" FOREIGN KEY ("definitionKey") REFERENCES "CharacterDefinition" ("key") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Character" ("ascension", "constellation", "definitionKey", "elementalBurstLevel", "elementalSkillLevel", "friendship", "id", "level", "normalAttackLevel") SELECT "ascension", "constellation", "definitionKey", "elementalBurstLevel", "elementalSkillLevel", "friendship", "id", "level", "normalAttackLevel" FROM "Character";
DROP TABLE "Character";
ALTER TABLE "new_Character" RENAME TO "Character";
CREATE TABLE "new_CharacterDefinition" (
    "key" TEXT NOT NULL PRIMARY KEY,
    "rarity" INTEGER NOT NULL,
    "element" TEXT NOT NULL,
    "weaponTypeKey" TEXT NOT NULL,
    "nation" TEXT NOT NULL DEFAULT 'Mondstat',
    CONSTRAINT "CharacterDefinition_weaponTypeKey_fkey" FOREIGN KEY ("weaponTypeKey") REFERENCES "WeaponType" ("key") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CharacterDefinition" ("element", "key", "rarity", "weaponTypeKey") SELECT "element", "key", "rarity", "weaponTypeKey" FROM "CharacterDefinition";
DROP TABLE "CharacterDefinition";
ALTER TABLE "new_CharacterDefinition" RENAME TO "CharacterDefinition";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
