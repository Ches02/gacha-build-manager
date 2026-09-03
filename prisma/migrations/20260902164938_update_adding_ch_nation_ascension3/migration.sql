-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CharacterDefinition" (
    "key" TEXT NOT NULL PRIMARY KEY,
    "rarity" INTEGER NOT NULL,
    "element" TEXT NOT NULL,
    "weaponTypeKey" TEXT NOT NULL,
    "nation" TEXT NOT NULL,
    CONSTRAINT "CharacterDefinition_weaponTypeKey_fkey" FOREIGN KEY ("weaponTypeKey") REFERENCES "WeaponType" ("key") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CharacterDefinition" ("element", "key", "nation", "rarity", "weaponTypeKey") SELECT "element", "key", "nation", "rarity", "weaponTypeKey" FROM "CharacterDefinition";
DROP TABLE "CharacterDefinition";
ALTER TABLE "new_CharacterDefinition" RENAME TO "CharacterDefinition";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
