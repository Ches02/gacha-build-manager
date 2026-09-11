-- CreateTable
CREATE TABLE "LoadoutBuildGuide" (
    "loadoutId" INTEGER NOT NULL,
    "buildGuideId" INTEGER NOT NULL,

    PRIMARY KEY ("loadoutId", "buildGuideId"),
    CONSTRAINT "LoadoutBuildGuide_loadoutId_fkey" FOREIGN KEY ("loadoutId") REFERENCES "Loadout" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "LoadoutBuildGuide_buildGuideId_fkey" FOREIGN KEY ("buildGuideId") REFERENCES "BuildGuide" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Preserve the previous optional guide association before removing its column.
INSERT INTO "LoadoutBuildGuide" ("loadoutId", "buildGuideId")
SELECT "id", "buildGuideId"
FROM "Loadout"
WHERE "buildGuideId" IS NOT NULL;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Loadout" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "characterId" INTEGER NOT NULL,
    "weaponId" INTEGER,
    "artifactLoadoutId" INTEGER,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Loadout_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Loadout_weaponId_fkey" FOREIGN KEY ("weaponId") REFERENCES "Weapon" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Loadout_artifactLoadoutId_fkey" FOREIGN KEY ("artifactLoadoutId") REFERENCES "ArtifactLoadout" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Loadout_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Loadout" ("artifactLoadoutId", "characterId", "description", "id", "name", "userId", "weaponId")
SELECT "artifactLoadoutId", "characterId", "description", "id", "name", "userId", "weaponId"
FROM "Loadout";
DROP TABLE "Loadout";
ALTER TABLE "new_Loadout" RENAME TO "Loadout";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
