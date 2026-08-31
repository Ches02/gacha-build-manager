-- CreateTable
CREATE TABLE "Character" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "definitionKey" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "constellation" INTEGER NOT NULL,
    "friendship" INTEGER NOT NULL,
    "normalAttackLevel" INTEGER NOT NULL,
    "elementalSkillLevel" INTEGER NOT NULL,
    "elementalBurstLevel" INTEGER NOT NULL,
    CONSTRAINT "Character_definitionKey_fkey" FOREIGN KEY ("definitionKey") REFERENCES "CharacterDefinition" ("key") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Weapon" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "definitionKey" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "ascension" INTEGER NOT NULL,
    "refinement" INTEGER NOT NULL,
    CONSTRAINT "Weapon_definitionKey_fkey" FOREIGN KEY ("definitionKey") REFERENCES "WeaponDefinition" ("key") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Artifact" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "definitionId" INTEGER NOT NULL,
    "level" INTEGER NOT NULL,
    "locked" BOOLEAN NOT NULL DEFAULT false,
    "mainStatTypeKey" TEXT NOT NULL,
    "mainStatValue" REAL NOT NULL,
    CONSTRAINT "Artifact_definitionId_fkey" FOREIGN KEY ("definitionId") REFERENCES "ArtifactDefinition" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Artifact_mainStatTypeKey_fkey" FOREIGN KEY ("mainStatTypeKey") REFERENCES "StatType" ("key") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ArtifactSubStat" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "artifactId" INTEGER NOT NULL,
    "statTypeKey" TEXT NOT NULL,
    "value" REAL NOT NULL,
    CONSTRAINT "ArtifactSubStat_artifactId_fkey" FOREIGN KEY ("artifactId") REFERENCES "Artifact" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ArtifactSubStat_statTypeKey_fkey" FOREIGN KEY ("statTypeKey") REFERENCES "StatType" ("key") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BuildGuide" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT
);

-- CreateTable
CREATE TABLE "BuildGuideCharacter" (
    "buildGuideId" INTEGER NOT NULL,
    "characterDefinitionKey" TEXT NOT NULL,

    PRIMARY KEY ("buildGuideId", "characterDefinitionKey"),
    CONSTRAINT "BuildGuideCharacter_buildGuideId_fkey" FOREIGN KEY ("buildGuideId") REFERENCES "BuildGuide" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "BuildGuideCharacter_characterDefinitionKey_fkey" FOREIGN KEY ("characterDefinitionKey") REFERENCES "CharacterDefinition" ("key") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BuildGuideWeapon" (
    "buildGuideId" INTEGER NOT NULL,
    "weaponKey" TEXT NOT NULL,

    PRIMARY KEY ("buildGuideId", "weaponKey"),
    CONSTRAINT "BuildGuideWeapon_buildGuideId_fkey" FOREIGN KEY ("buildGuideId") REFERENCES "BuildGuide" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "BuildGuideWeapon_weaponKey_fkey" FOREIGN KEY ("weaponKey") REFERENCES "WeaponDefinition" ("key") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BuildGuideArtifactSet" (
    "buildGuideId" INTEGER NOT NULL,
    "artifactSetKey" TEXT NOT NULL,
    "pieces" INTEGER NOT NULL,

    PRIMARY KEY ("buildGuideId", "artifactSetKey"),
    CONSTRAINT "BuildGuideArtifactSet_buildGuideId_fkey" FOREIGN KEY ("buildGuideId") REFERENCES "BuildGuide" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "BuildGuideArtifactSet_artifactSetKey_fkey" FOREIGN KEY ("artifactSetKey") REFERENCES "ArtifactSetDefinition" ("key") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BuildGuideMainStat" (
    "buildGuideId" INTEGER NOT NULL,
    "slotKey" TEXT NOT NULL,
    "statTypeKey" TEXT NOT NULL,

    PRIMARY KEY ("buildGuideId", "slotKey", "statTypeKey"),
    CONSTRAINT "BuildGuideMainStat_buildGuideId_fkey" FOREIGN KEY ("buildGuideId") REFERENCES "BuildGuide" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "BuildGuideMainStat_slotKey_fkey" FOREIGN KEY ("slotKey") REFERENCES "ArtifactSlot" ("key") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "BuildGuideMainStat_statTypeKey_fkey" FOREIGN KEY ("statTypeKey") REFERENCES "StatType" ("key") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BuildGuideStatPriority" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "buildGuideId" INTEGER NOT NULL,
    "statTypeKey" TEXT NOT NULL,
    "priority" INTEGER NOT NULL,
    "targetValue" REAL,
    CONSTRAINT "BuildGuideStatPriority_buildGuideId_fkey" FOREIGN KEY ("buildGuideId") REFERENCES "BuildGuide" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "BuildGuideStatPriority_statTypeKey_fkey" FOREIGN KEY ("statTypeKey") REFERENCES "StatType" ("key") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ArtifactLoadout" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT
);

-- CreateTable
CREATE TABLE "ArtifactLoadoutItem" (
    "artifactLoadoutId" INTEGER NOT NULL,
    "artifactId" INTEGER NOT NULL,

    PRIMARY KEY ("artifactLoadoutId", "artifactId"),
    CONSTRAINT "ArtifactLoadoutItem_artifactLoadoutId_fkey" FOREIGN KEY ("artifactLoadoutId") REFERENCES "ArtifactLoadout" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ArtifactLoadoutItem_artifactId_fkey" FOREIGN KEY ("artifactId") REFERENCES "Artifact" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_WeaponDefinition" (
    "key" TEXT NOT NULL PRIMARY KEY,
    "rarity" INTEGER NOT NULL,
    "baseATK" INTEGER NOT NULL,
    "subStatTypeKey" TEXT NOT NULL,
    "subStat" REAL NOT NULL,
    "weaponTypeKey" TEXT NOT NULL,
    CONSTRAINT "WeaponDefinition_weaponTypeKey_fkey" FOREIGN KEY ("weaponTypeKey") REFERENCES "WeaponType" ("key") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "WeaponDefinition_subStatTypeKey_fkey" FOREIGN KEY ("subStatTypeKey") REFERENCES "StatType" ("key") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_WeaponDefinition" ("baseATK", "key", "rarity", "subStat", "subStatTypeKey", "weaponTypeKey") SELECT "baseATK", "key", "rarity", "subStat", "subStatTypeKey", "weaponTypeKey" FROM "WeaponDefinition";
DROP TABLE "WeaponDefinition";
ALTER TABLE "new_WeaponDefinition" RENAME TO "WeaponDefinition";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "BuildGuideStatPriority_buildGuideId_priority_key" ON "BuildGuideStatPriority"("buildGuideId", "priority");
