-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Character" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "definitionKey" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "constellation" INTEGER NOT NULL,
    "friendship" INTEGER NOT NULL,
    "nation" TEXT NOT NULL DEFAULT 'Mondstat',
    "ascension" INTEGER NOT NULL DEFAULT 1,
    "normalAttackLevel" INTEGER NOT NULL,
    "elementalSkillLevel" INTEGER NOT NULL,
    "elementalBurstLevel" INTEGER NOT NULL,
    CONSTRAINT "Character_definitionKey_fkey" FOREIGN KEY ("definitionKey") REFERENCES "CharacterDefinition" ("key") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Character" ("constellation", "definitionKey", "elementalBurstLevel", "elementalSkillLevel", "friendship", "id", "level", "normalAttackLevel") SELECT "constellation", "definitionKey", "elementalBurstLevel", "elementalSkillLevel", "friendship", "id", "level", "normalAttackLevel" FROM "Character";
DROP TABLE "Character";
ALTER TABLE "new_Character" RENAME TO "Character";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
