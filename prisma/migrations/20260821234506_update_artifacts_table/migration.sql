/*
  Warnings:

  - Made the column `passiveEffect` on table `WeaponTranslation` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateTable
CREATE TABLE "ArtifactSetDefinition" (
    "key" TEXT NOT NULL PRIMARY KEY
);

-- CreateTable
CREATE TABLE "ArtifactSetTranslation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "artifactSetKey" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "twoEffect" TEXT NOT NULL,
    "fourEffect" TEXT NOT NULL,
    CONSTRAINT "ArtifactSetTranslation_artifactSetKey_fkey" FOREIGN KEY ("artifactSetKey") REFERENCES "ArtifactSetDefinition" ("key") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_WeaponTranslation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "weaponKey" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "passiveEffect" TEXT NOT NULL,
    CONSTRAINT "WeaponTranslation_weaponKey_fkey" FOREIGN KEY ("weaponKey") REFERENCES "WeaponDefinition" ("key") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_WeaponTranslation" ("displayName", "id", "language", "passiveEffect", "weaponKey") SELECT "displayName", "id", "language", "passiveEffect", "weaponKey" FROM "WeaponTranslation";
DROP TABLE "WeaponTranslation";
ALTER TABLE "new_WeaponTranslation" RENAME TO "WeaponTranslation";
CREATE UNIQUE INDEX "WeaponTranslation_weaponKey_language_key" ON "WeaponTranslation"("weaponKey", "language");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "ArtifactSetTranslation_artifactSetKey_language_key" ON "ArtifactSetTranslation"("artifactSetKey", "language");
