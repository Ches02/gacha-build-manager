/*
  Warnings:

  - You are about to drop the column `materialKey` on the `AscensionRequirement` table. All the data in the column will be lost.
  - You are about to drop the column `materialType` on the `AscensionRequirement` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `AscensionRequirement` table. All the data in the column will be lost.
  - You are about to drop the column `rarity` on the `AscensionRequirement` table. All the data in the column will be lost.
  - You are about to drop the column `materialKey` on the `TalentRequirement` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `TalentRequirement` table. All the data in the column will be lost.
  - You are about to drop the column `rarity` on the `TalentRequirement` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `TalentRequirement` table. All the data in the column will be lost.
  - You are about to drop the column `materialKey` on the `WeaponLevelRequirement` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `WeaponLevelRequirement` table. All the data in the column will be lost.
  - You are about to drop the column `rarity` on the `WeaponLevelRequirement` table. All the data in the column will be lost.
  - You are about to drop the column `weaponDefinitionKey` on the `WeaponLevelRequirement` table. All the data in the column will be lost.
  - Added the required column `bossQuantity` to the `AscensionRequirement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gemQuality` to the `AscensionRequirement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gemQuantity` to the `AscensionRequirement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `matQuality` to the `AscensionRequirement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `matQuantity` to the `AscensionRequirement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `specialtyQuantity` to the `AscensionRequirement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `domainQuality` to the `TalentRequirement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `domainQuantity` to the `TalentRequirement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `matQuality` to the `TalentRequirement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `matQuantity` to the `TalentRequirement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weeklyBossQuantity` to the `TalentRequirement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `domainQuality` to the `WeaponLevelRequirement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `domainQuantity` to the `WeaponLevelRequirement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mat1Quality` to the `WeaponLevelRequirement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mat1Quantity` to the `WeaponLevelRequirement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mat2Quality` to the `WeaponLevelRequirement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mat2Quantity` to the `WeaponLevelRequirement` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AscensionRequirement" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ascension" INTEGER NOT NULL,
    "gemQuantity" INTEGER NOT NULL,
    "gemQuality" INTEGER NOT NULL,
    "bossQuantity" INTEGER NOT NULL,
    "specialtyQuantity" INTEGER NOT NULL,
    "matQuantity" INTEGER NOT NULL,
    "matQuality" INTEGER NOT NULL
);
INSERT INTO "new_AscensionRequirement" ("ascension", "id") SELECT "ascension", "id" FROM "AscensionRequirement";
DROP TABLE "AscensionRequirement";
ALTER TABLE "new_AscensionRequirement" RENAME TO "AscensionRequirement";
CREATE UNIQUE INDEX "AscensionRequirement_ascension_key" ON "AscensionRequirement"("ascension");
CREATE TABLE "new_TalentRequirement" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "talentLevel" INTEGER NOT NULL,
    "domainQuantity" INTEGER NOT NULL,
    "domainQuality" INTEGER NOT NULL,
    "matQuantity" INTEGER NOT NULL,
    "matQuality" INTEGER NOT NULL,
    "weeklyBossQuantity" INTEGER NOT NULL
);
INSERT INTO "new_TalentRequirement" ("id", "talentLevel") SELECT "id", "talentLevel" FROM "TalentRequirement";
DROP TABLE "TalentRequirement";
ALTER TABLE "new_TalentRequirement" RENAME TO "TalentRequirement";
CREATE UNIQUE INDEX "TalentRequirement_talentLevel_key" ON "TalentRequirement"("talentLevel");
CREATE TABLE "new_WeaponLevelRequirement" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "weaponRarity" INTEGER NOT NULL,
    "ascension" INTEGER NOT NULL,
    "domainQuantity" INTEGER NOT NULL,
    "domainQuality" INTEGER NOT NULL,
    "mat1Quantity" INTEGER NOT NULL,
    "mat1Quality" INTEGER NOT NULL,
    "mat2Quantity" INTEGER NOT NULL,
    "mat2Quality" INTEGER NOT NULL
);
INSERT INTO "new_WeaponLevelRequirement" ("ascension", "id", "weaponRarity") SELECT "ascension", "id", "weaponRarity" FROM "WeaponLevelRequirement";
DROP TABLE "WeaponLevelRequirement";
ALTER TABLE "new_WeaponLevelRequirement" RENAME TO "WeaponLevelRequirement";
CREATE UNIQUE INDEX "WeaponLevelRequirement_weaponRarity_ascension_key" ON "WeaponLevelRequirement"("weaponRarity", "ascension");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
