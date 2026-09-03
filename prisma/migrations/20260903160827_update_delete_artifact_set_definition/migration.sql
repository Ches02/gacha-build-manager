/*
  Warnings:

  - You are about to drop the `ArtifactDefinition` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `definitionId` on the `Artifact` table. All the data in the column will be lost.
  - Added the required column `setKey` to the `Artifact` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slotKey` to the `Artifact` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "ArtifactDefinition_setKey_slotKey_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ArtifactDefinition";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Artifact" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "setKey" TEXT NOT NULL,
    "slotKey" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "mainStatTypeKey" TEXT NOT NULL,
    "mainStatValue" REAL NOT NULL,
    CONSTRAINT "Artifact_setKey_fkey" FOREIGN KEY ("setKey") REFERENCES "ArtifactSetDefinition" ("key") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Artifact_slotKey_fkey" FOREIGN KEY ("slotKey") REFERENCES "ArtifactSlot" ("key") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Artifact_mainStatTypeKey_fkey" FOREIGN KEY ("mainStatTypeKey") REFERENCES "StatType" ("key") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Artifact" ("id", "level", "mainStatTypeKey", "mainStatValue") SELECT "id", "level", "mainStatTypeKey", "mainStatValue" FROM "Artifact";
DROP TABLE "Artifact";
ALTER TABLE "new_Artifact" RENAME TO "Artifact";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
