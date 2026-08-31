-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CharacterDefinition" (
    "key" TEXT NOT NULL PRIMARY KEY,
    "element" TEXT NOT NULL DEFAULT '0',
    "weaponType" TEXT NOT NULL DEFAULT '0',
    "rarity" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_CharacterDefinition" ("key") SELECT "key" FROM "CharacterDefinition";
DROP TABLE "CharacterDefinition";
ALTER TABLE "new_CharacterDefinition" RENAME TO "CharacterDefinition";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
