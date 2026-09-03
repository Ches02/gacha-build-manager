/*
  Warnings:

  - You are about to drop the column `locked` on the `Artifact` table. All the data in the column will be lost.
  - You are about to drop the column `ascension` on the `Weapon` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Artifact" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "definitionId" INTEGER NOT NULL,
    "level" INTEGER NOT NULL,
    "mainStatTypeKey" TEXT NOT NULL,
    "mainStatValue" REAL NOT NULL,
    CONSTRAINT "Artifact_definitionId_fkey" FOREIGN KEY ("definitionId") REFERENCES "ArtifactDefinition" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Artifact_mainStatTypeKey_fkey" FOREIGN KEY ("mainStatTypeKey") REFERENCES "StatType" ("key") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Artifact" ("definitionId", "id", "level", "mainStatTypeKey", "mainStatValue") SELECT "definitionId", "id", "level", "mainStatTypeKey", "mainStatValue" FROM "Artifact";
DROP TABLE "Artifact";
ALTER TABLE "new_Artifact" RENAME TO "Artifact";
CREATE TABLE "new_Weapon" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "definitionKey" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "refinement" INTEGER NOT NULL,
    CONSTRAINT "Weapon_definitionKey_fkey" FOREIGN KEY ("definitionKey") REFERENCES "WeaponDefinition" ("key") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Weapon" ("definitionKey", "id", "level", "refinement") SELECT "definitionKey", "id", "level", "refinement" FROM "Weapon";
DROP TABLE "Weapon";
ALTER TABLE "new_Weapon" RENAME TO "Weapon";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
