/*
  Warnings:

  - You are about to drop the column `friday` on the `MaterialSource` table. All the data in the column will be lost.
  - You are about to drop the column `monday` on the `MaterialSource` table. All the data in the column will be lost.
  - You are about to drop the column `saturday` on the `MaterialSource` table. All the data in the column will be lost.
  - You are about to drop the column `sourceKey` on the `MaterialSource` table. All the data in the column will be lost.
  - You are about to drop the column `sourceType` on the `MaterialSource` table. All the data in the column will be lost.
  - You are about to drop the column `sunday` on the `MaterialSource` table. All the data in the column will be lost.
  - You are about to drop the column `thursday` on the `MaterialSource` table. All the data in the column will be lost.
  - You are about to drop the column `tuesday` on the `MaterialSource` table. All the data in the column will be lost.
  - You are about to drop the column `wednesday` on the `MaterialSource` table. All the data in the column will be lost.
  - Added the required column `days` to the `MaterialSource` table without a default value. This is not possible if the table is not empty.
  - Added the required column `domainName` to the `MaterialSource` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `MaterialSource` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MaterialSource" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "domainName" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "days" TEXT NOT NULL,
    "materialKey" TEXT NOT NULL,
    CONSTRAINT "MaterialSource_materialKey_fkey" FOREIGN KEY ("materialKey") REFERENCES "MaterialDefinition" ("key") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_MaterialSource" ("id", "materialKey") SELECT "id", "materialKey" FROM "MaterialSource";
DROP TABLE "MaterialSource";
ALTER TABLE "new_MaterialSource" RENAME TO "MaterialSource";
CREATE UNIQUE INDEX "MaterialSource_domainName_materialKey_key" ON "MaterialSource"("domainName", "materialKey");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
