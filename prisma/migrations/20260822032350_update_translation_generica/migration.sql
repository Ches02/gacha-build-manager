/*
  Warnings:

  - You are about to drop the column `element` on the `CharacterDefinition` table. All the data in the column will be lost.
  - You are about to drop the column `weaponType` on the `CharacterDefinition` table. All the data in the column will be lost.
  - You are about to drop the column `display` on the `Translation` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Translation` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "ArtifactDefinition" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "setKey" TEXT NOT NULL,
    "slotKey" TEXT NOT NULL DEFAULT '0',
    CONSTRAINT "ArtifactDefinition_setKey_fkey" FOREIGN KEY ("setKey") REFERENCES "ArtifactSetDefinition" ("key") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "WeaponType" (
    "key" TEXT NOT NULL PRIMARY KEY
);

-- CreateTable
CREATE TABLE "ArtifactSlot" (
    "key" TEXT NOT NULL PRIMARY KEY
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CharacterDefinition" (
    "key" TEXT NOT NULL PRIMARY KEY,
    "rarity" INTEGER NOT NULL,
    "elementKey" TEXT NOT NULL DEFAULT '0',
    "weaponTypeKey" TEXT NOT NULL DEFAULT '0',
    CONSTRAINT "CharacterDefinition_weaponTypeKey_fkey" FOREIGN KEY ("weaponTypeKey") REFERENCES "WeaponType" ("key") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CharacterDefinition" ("key", "rarity") SELECT "key", "rarity" FROM "CharacterDefinition";
DROP TABLE "CharacterDefinition";
ALTER TABLE "new_CharacterDefinition" RENAME TO "CharacterDefinition";
CREATE TABLE "new_Translation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "entityType" TEXT NOT NULL DEFAULT '0',
    "key" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "field" TEXT NOT NULL DEFAULT '0',
    "text" TEXT NOT NULL DEFAULT '0'
);
INSERT INTO "new_Translation" ("id", "key", "language") SELECT "id", "key", "language" FROM "Translation";
DROP TABLE "Translation";
ALTER TABLE "new_Translation" RENAME TO "Translation";
CREATE UNIQUE INDEX "Translation_entityType_key_language_field_key" ON "Translation"("entityType", "key", "language", "field");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "ArtifactDefinition_setKey_slotKey_key" ON "ArtifactDefinition"("setKey", "slotKey");
