-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL
);

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
    "userId" INTEGER,
    CONSTRAINT "Artifact_setKey_fkey" FOREIGN KEY ("setKey") REFERENCES "ArtifactSetDefinition" ("key") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Artifact_slotKey_fkey" FOREIGN KEY ("slotKey") REFERENCES "ArtifactSlot" ("key") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Artifact_mainStatTypeKey_fkey" FOREIGN KEY ("mainStatTypeKey") REFERENCES "StatType" ("key") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Artifact_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Artifact" ("id", "level", "mainStatTypeKey", "mainStatValue", "setKey", "slotKey") SELECT "id", "level", "mainStatTypeKey", "mainStatValue", "setKey", "slotKey" FROM "Artifact";
DROP TABLE "Artifact";
ALTER TABLE "new_Artifact" RENAME TO "Artifact";
CREATE TABLE "new_ArtifactLoadout" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "userId" INTEGER,
    CONSTRAINT "ArtifactLoadout_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_ArtifactLoadout" ("description", "id", "name") SELECT "description", "id", "name" FROM "ArtifactLoadout";
DROP TABLE "ArtifactLoadout";
ALTER TABLE "new_ArtifactLoadout" RENAME TO "ArtifactLoadout";
CREATE TABLE "new_BuildGuide" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "userId" INTEGER,
    CONSTRAINT "BuildGuide_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_BuildGuide" ("description", "id", "name") SELECT "description", "id", "name" FROM "BuildGuide";
DROP TABLE "BuildGuide";
ALTER TABLE "new_BuildGuide" RENAME TO "BuildGuide";
CREATE TABLE "new_Character" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "definitionKey" TEXT NOT NULL,
    "userId" INTEGER,
    "level" INTEGER NOT NULL,
    "constellation" INTEGER NOT NULL,
    "friendship" INTEGER NOT NULL,
    "ascension" INTEGER NOT NULL,
    "normalAttackLevel" INTEGER NOT NULL,
    "elementalSkillLevel" INTEGER NOT NULL,
    "elementalBurstLevel" INTEGER NOT NULL,
    CONSTRAINT "Character_definitionKey_fkey" FOREIGN KEY ("definitionKey") REFERENCES "CharacterDefinition" ("key") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Character_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Character" ("ascension", "constellation", "definitionKey", "elementalBurstLevel", "elementalSkillLevel", "friendship", "id", "level", "normalAttackLevel") SELECT "ascension", "constellation", "definitionKey", "elementalBurstLevel", "elementalSkillLevel", "friendship", "id", "level", "normalAttackLevel" FROM "Character";
DROP TABLE "Character";
ALTER TABLE "new_Character" RENAME TO "Character";
CREATE TABLE "new_Loadout" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "characterId" INTEGER,
    "weaponId" INTEGER,
    "artifactLoadoutId" INTEGER,
    "buildGuideId" INTEGER,
    "userId" INTEGER,
    CONSTRAINT "Loadout_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Loadout_weaponId_fkey" FOREIGN KEY ("weaponId") REFERENCES "Weapon" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Loadout_artifactLoadoutId_fkey" FOREIGN KEY ("artifactLoadoutId") REFERENCES "ArtifactLoadout" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Loadout_buildGuideId_fkey" FOREIGN KEY ("buildGuideId") REFERENCES "BuildGuide" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Loadout_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Loadout" ("artifactLoadoutId", "buildGuideId", "characterId", "description", "id", "name", "weaponId") SELECT "artifactLoadoutId", "buildGuideId", "characterId", "description", "id", "name", "weaponId" FROM "Loadout";
DROP TABLE "Loadout";
ALTER TABLE "new_Loadout" RENAME TO "Loadout";
CREATE TABLE "new_Weapon" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "definitionKey" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "refinement" INTEGER NOT NULL,
    "userId" INTEGER,
    CONSTRAINT "Weapon_definitionKey_fkey" FOREIGN KEY ("definitionKey") REFERENCES "WeaponDefinition" ("key") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Weapon_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Weapon" ("definitionKey", "id", "level", "refinement") SELECT "definitionKey", "id", "level", "refinement" FROM "Weapon";
DROP TABLE "Weapon";
ALTER TABLE "new_Weapon" RENAME TO "Weapon";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
