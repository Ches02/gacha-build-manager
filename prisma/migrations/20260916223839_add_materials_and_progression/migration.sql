-- AlterTable
ALTER TABLE "Loadout" ADD COLUMN "targetAscension" INTEGER;
ALTER TABLE "Loadout" ADD COLUMN "targetElementalBurstLevel" INTEGER;
ALTER TABLE "Loadout" ADD COLUMN "targetElementalSkillLevel" INTEGER;
ALTER TABLE "Loadout" ADD COLUMN "targetLevel" INTEGER;
ALTER TABLE "Loadout" ADD COLUMN "targetNormalAttackLevel" INTEGER;
ALTER TABLE "Loadout" ADD COLUMN "targetWeaponLevel" INTEGER;

-- CreateTable
CREATE TABLE "MaterialDefinition" (
    "key" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "CharacterMaterial" (
    "characterDefinitionKey" TEXT NOT NULL PRIMARY KEY,
    "bossMaterialKey" TEXT NOT NULL,
    "regionalSpecialtyKey" TEXT NOT NULL,
    "commonMaterialKey" TEXT NOT NULL,
    "talentMaterialKey" TEXT NOT NULL,
    "weeklyBossMaterialKey" TEXT NOT NULL,
    CONSTRAINT "CharacterMaterial_characterDefinitionKey_fkey" FOREIGN KEY ("characterDefinitionKey") REFERENCES "CharacterDefinition" ("key") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CharacterMaterial_bossMaterialKey_fkey" FOREIGN KEY ("bossMaterialKey") REFERENCES "MaterialDefinition" ("key") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CharacterMaterial_regionalSpecialtyKey_fkey" FOREIGN KEY ("regionalSpecialtyKey") REFERENCES "MaterialDefinition" ("key") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CharacterMaterial_commonMaterialKey_fkey" FOREIGN KEY ("commonMaterialKey") REFERENCES "MaterialDefinition" ("key") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CharacterMaterial_talentMaterialKey_fkey" FOREIGN KEY ("talentMaterialKey") REFERENCES "MaterialDefinition" ("key") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CharacterMaterial_weeklyBossMaterialKey_fkey" FOREIGN KEY ("weeklyBossMaterialKey") REFERENCES "MaterialDefinition" ("key") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "WeaponMaterial" (
    "weaponDefinitionKey" TEXT NOT NULL PRIMARY KEY,
    "domainMaterialKey" TEXT NOT NULL,
    "commonMaterial1Key" TEXT NOT NULL,
    "commonMaterial2Key" TEXT NOT NULL,
    CONSTRAINT "WeaponMaterial_weaponDefinitionKey_fkey" FOREIGN KEY ("weaponDefinitionKey") REFERENCES "WeaponDefinition" ("key") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "WeaponMaterial_domainMaterialKey_fkey" FOREIGN KEY ("domainMaterialKey") REFERENCES "MaterialDefinition" ("key") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "WeaponMaterial_commonMaterial1Key_fkey" FOREIGN KEY ("commonMaterial1Key") REFERENCES "MaterialDefinition" ("key") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "WeaponMaterial_commonMaterial2Key_fkey" FOREIGN KEY ("commonMaterial2Key") REFERENCES "MaterialDefinition" ("key") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AscensionRequirement" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "ascension" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "rarity" INTEGER,
    "materialKey" TEXT NOT NULL,
    CONSTRAINT "AscensionRequirement_materialKey_fkey" FOREIGN KEY ("materialKey") REFERENCES "MaterialDefinition" ("key") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TalentRequirement" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "talentLevel" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "rarity" INTEGER,
    "materialKey" TEXT NOT NULL,
    CONSTRAINT "TalentRequirement_materialKey_fkey" FOREIGN KEY ("materialKey") REFERENCES "MaterialDefinition" ("key") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "WeaponLevelRequirement" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "weaponRarity" INTEGER NOT NULL,
    "ascension" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "rarity" INTEGER,
    "materialKey" TEXT NOT NULL,
    "weaponDefinitionKey" TEXT,
    CONSTRAINT "WeaponLevelRequirement_weaponDefinitionKey_fkey" FOREIGN KEY ("weaponDefinitionKey") REFERENCES "WeaponDefinition" ("key") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "WeaponLevelRequirement_materialKey_fkey" FOREIGN KEY ("materialKey") REFERENCES "MaterialDefinition" ("key") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MaterialSource" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "materialKey" TEXT NOT NULL,
    "sourceType" TEXT NOT NULL,
    "sourceKey" TEXT,
    "monday" BOOLEAN NOT NULL DEFAULT false,
    "tuesday" BOOLEAN NOT NULL DEFAULT false,
    "wednesday" BOOLEAN NOT NULL DEFAULT false,
    "thursday" BOOLEAN NOT NULL DEFAULT false,
    "friday" BOOLEAN NOT NULL DEFAULT false,
    "saturday" BOOLEAN NOT NULL DEFAULT false,
    "sunday" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "MaterialSource_materialKey_fkey" FOREIGN KEY ("materialKey") REFERENCES "MaterialDefinition" ("key") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "AscensionRequirement_type_ascension_rarity_materialKey_key" ON "AscensionRequirement"("type", "ascension", "rarity", "materialKey");

-- CreateIndex
CREATE UNIQUE INDEX "TalentRequirement_talentLevel_type_rarity_materialKey_key" ON "TalentRequirement"("talentLevel", "type", "rarity", "materialKey");

-- CreateIndex
CREATE UNIQUE INDEX "WeaponLevelRequirement_weaponRarity_ascension_rarity_materialKey_weaponDefinitionKey_key" ON "WeaponLevelRequirement"("weaponRarity", "ascension", "rarity", "materialKey", "weaponDefinitionKey");
