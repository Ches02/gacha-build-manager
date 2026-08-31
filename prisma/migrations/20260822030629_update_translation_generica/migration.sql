-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CharacterDefinition" (
    "key" TEXT NOT NULL PRIMARY KEY,
    "element" TEXT NOT NULL,
    "weaponType" TEXT NOT NULL,
    "rarity" INTEGER NOT NULL
);
INSERT INTO "new_CharacterDefinition" ("element", "key", "rarity", "weaponType") SELECT "element", "key", "rarity", "weaponType" FROM "CharacterDefinition";
DROP TABLE "CharacterDefinition";
ALTER TABLE "new_CharacterDefinition" RENAME TO "CharacterDefinition";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
