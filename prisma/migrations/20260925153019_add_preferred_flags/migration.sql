-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Character" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "definitionKey" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "level" INTEGER NOT NULL,
    "constellation" INTEGER NOT NULL,
    "friendship" INTEGER NOT NULL,
    "ascension" INTEGER NOT NULL,
    "normalAttackLevel" INTEGER NOT NULL,
    "elementalSkillLevel" INTEGER NOT NULL,
    "elementalBurstLevel" INTEGER NOT NULL,
    "isPreferred" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Character_definitionKey_fkey" FOREIGN KEY ("definitionKey") REFERENCES "CharacterDefinition" ("key") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Character_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Character" ("ascension", "constellation", "definitionKey", "elementalBurstLevel", "elementalSkillLevel", "friendship", "id", "level", "normalAttackLevel", "userId") SELECT "ascension", "constellation", "definitionKey", "elementalBurstLevel", "elementalSkillLevel", "friendship", "id", "level", "normalAttackLevel", "userId" FROM "Character";
DROP TABLE "Character";
ALTER TABLE "new_Character" RENAME TO "Character";
CREATE TABLE "new_Loadout" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "characterId" INTEGER NOT NULL,
    "weaponId" INTEGER,
    "artifactLoadoutId" INTEGER,
    "targetLevel" INTEGER,
    "targetAscension" INTEGER,
    "targetNormalAttackLevel" INTEGER,
    "targetElementalSkillLevel" INTEGER,
    "targetElementalBurstLevel" INTEGER,
    "targetWeaponLevel" INTEGER,
    "showInHome" BOOLEAN NOT NULL DEFAULT false,
    "isPreferred" BOOLEAN NOT NULL DEFAULT false,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Loadout_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Loadout_weaponId_fkey" FOREIGN KEY ("weaponId") REFERENCES "Weapon" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Loadout_artifactLoadoutId_fkey" FOREIGN KEY ("artifactLoadoutId") REFERENCES "ArtifactLoadout" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Loadout_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Loadout" ("artifactLoadoutId", "characterId", "description", "id", "name", "showInHome", "targetAscension", "targetElementalBurstLevel", "targetElementalSkillLevel", "targetLevel", "targetNormalAttackLevel", "targetWeaponLevel", "userId", "weaponId") SELECT "artifactLoadoutId", "characterId", "description", "id", "name", "showInHome", "targetAscension", "targetElementalBurstLevel", "targetElementalSkillLevel", "targetLevel", "targetNormalAttackLevel", "targetWeaponLevel", "userId", "weaponId" FROM "Loadout";
DROP TABLE "Loadout";
ALTER TABLE "new_Loadout" RENAME TO "Loadout";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
