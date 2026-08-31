/*
  Warnings:

  - You are about to drop the `ArtifactSetTranslation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CharacterTranslation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WeaponTranslation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to alter the column `subStat` on the `WeaponDefinition` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.

*/
-- DropIndex
DROP INDEX "ArtifactSetTranslation_artifactSetKey_language_key";

-- DropIndex
DROP INDEX "CharacterTranslation_characterKey_language_key";

-- DropIndex
DROP INDEX "WeaponTranslation_weaponKey_language_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ArtifactSetTranslation";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "CharacterTranslation";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "WeaponTranslation";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Translation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "display" TEXT NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_WeaponDefinition" (
    "key" TEXT NOT NULL PRIMARY KEY,
    "rarity" INTEGER NOT NULL,
    "BaseATK" INTEGER NOT NULL,
    "subStatType" TEXT NOT NULL,
    "subStat" REAL NOT NULL
);
INSERT INTO "new_WeaponDefinition" ("BaseATK", "key", "rarity", "subStat", "subStatType") SELECT "BaseATK", "key", "rarity", "subStat", "subStatType" FROM "WeaponDefinition";
DROP TABLE "WeaponDefinition";
ALTER TABLE "new_WeaponDefinition" RENAME TO "WeaponDefinition";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Translation_type_key_language_key" ON "Translation"("type", "key", "language");
