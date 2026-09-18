/*
  Warnings:

  - Added the required column `weaponStars` to the `WeaponLevelRequirement` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_WeaponLevelRequirement" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "weaponRarity" INTEGER NOT NULL,
    "ascension" INTEGER NOT NULL,
    "weaponStars" INTEGER NOT NULL,
    "domainQuantity" INTEGER NOT NULL,
    "domainQuality" INTEGER NOT NULL,
    "mat1Quantity" INTEGER NOT NULL,
    "mat1Quality" INTEGER NOT NULL,
    "mat2Quantity" INTEGER NOT NULL,
    "mat2Quality" INTEGER NOT NULL
);
INSERT INTO "new_WeaponLevelRequirement" ("ascension", "domainQuality", "domainQuantity", "id", "mat1Quality", "mat1Quantity", "mat2Quality", "mat2Quantity", "weaponRarity") SELECT "ascension", "domainQuality", "domainQuantity", "id", "mat1Quality", "mat1Quantity", "mat2Quality", "mat2Quantity", "weaponRarity" FROM "WeaponLevelRequirement";
DROP TABLE "WeaponLevelRequirement";
ALTER TABLE "new_WeaponLevelRequirement" RENAME TO "WeaponLevelRequirement";
CREATE UNIQUE INDEX "WeaponLevelRequirement_weaponRarity_ascension_key" ON "WeaponLevelRequirement"("weaponRarity", "ascension");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
