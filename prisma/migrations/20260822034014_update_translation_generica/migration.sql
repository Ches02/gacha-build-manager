/*
  Warnings:

  - You are about to drop the column `elementKey` on the `CharacterDefinition` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ArtifactDefinition" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "setKey" TEXT NOT NULL,
    "slotKey" TEXT NOT NULL,
    CONSTRAINT "ArtifactDefinition_setKey_fkey" FOREIGN KEY ("setKey") REFERENCES "ArtifactSetDefinition" ("key") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ArtifactDefinition_slotKey_fkey" FOREIGN KEY ("slotKey") REFERENCES "ArtifactSlot" ("key") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ArtifactDefinition" ("id", "setKey", "slotKey") SELECT "id", "setKey", "slotKey" FROM "ArtifactDefinition";
DROP TABLE "ArtifactDefinition";
ALTER TABLE "new_ArtifactDefinition" RENAME TO "ArtifactDefinition";
CREATE UNIQUE INDEX "ArtifactDefinition_setKey_slotKey_key" ON "ArtifactDefinition"("setKey", "slotKey");
CREATE TABLE "new_CharacterDefinition" (
    "key" TEXT NOT NULL PRIMARY KEY,
    "rarity" INTEGER NOT NULL,
    "element" TEXT NOT NULL DEFAULT '0',
    "weaponTypeKey" TEXT NOT NULL,
    CONSTRAINT "CharacterDefinition_weaponTypeKey_fkey" FOREIGN KEY ("weaponTypeKey") REFERENCES "WeaponType" ("key") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CharacterDefinition" ("key", "rarity", "weaponTypeKey") SELECT "key", "rarity", "weaponTypeKey" FROM "CharacterDefinition";
DROP TABLE "CharacterDefinition";
ALTER TABLE "new_CharacterDefinition" RENAME TO "CharacterDefinition";
CREATE TABLE "new_Translation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "entityType" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "text" TEXT NOT NULL
);
INSERT INTO "new_Translation" ("entityType", "field", "id", "key", "language", "text") SELECT "entityType", "field", "id", "key", "language", "text" FROM "Translation";
DROP TABLE "Translation";
ALTER TABLE "new_Translation" RENAME TO "Translation";
CREATE UNIQUE INDEX "Translation_entityType_key_language_field_key" ON "Translation"("entityType", "key", "language", "field");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
