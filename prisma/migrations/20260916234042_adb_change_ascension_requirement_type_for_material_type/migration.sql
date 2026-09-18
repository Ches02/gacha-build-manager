/*
  Warnings:

  - You are about to drop the column `type` on the `AscensionRequirement` table. All the data in the column will be lost.
  - Added the required column `materialType` to the `AscensionRequirement` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AscensionRequirement" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "materialType" TEXT NOT NULL,
    "ascension" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "rarity" INTEGER,
    "materialKey" TEXT NOT NULL,
    CONSTRAINT "AscensionRequirement_materialKey_fkey" FOREIGN KEY ("materialKey") REFERENCES "MaterialDefinition" ("key") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_AscensionRequirement" ("ascension", "id", "materialKey", "quantity", "rarity") SELECT "ascension", "id", "materialKey", "quantity", "rarity" FROM "AscensionRequirement";
DROP TABLE "AscensionRequirement";
ALTER TABLE "new_AscensionRequirement" RENAME TO "AscensionRequirement";
CREATE UNIQUE INDEX "AscensionRequirement_materialType_ascension_rarity_materialKey_key" ON "AscensionRequirement"("materialType", "ascension", "rarity", "materialKey");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
