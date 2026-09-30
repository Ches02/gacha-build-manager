-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_WeaponDefinition" (
    "key" TEXT NOT NULL PRIMARY KEY,
    "rarity" INTEGER NOT NULL,
    "baseATK" INTEGER NOT NULL,
    "subStatTypeKey" TEXT,
    "subStat" REAL,
    "weaponTypeKey" TEXT NOT NULL,
    "obtainType" TEXT NOT NULL,
    CONSTRAINT "WeaponDefinition_weaponTypeKey_fkey" FOREIGN KEY ("weaponTypeKey") REFERENCES "WeaponType" ("key") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "WeaponDefinition_subStatTypeKey_fkey" FOREIGN KEY ("subStatTypeKey") REFERENCES "StatType" ("key") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_WeaponDefinition" ("baseATK", "key", "obtainType", "rarity", "subStat", "subStatTypeKey", "weaponTypeKey") SELECT "baseATK", "key", "obtainType", "rarity", "subStat", "subStatTypeKey", "weaponTypeKey" FROM "WeaponDefinition";
DROP TABLE "WeaponDefinition";
ALTER TABLE "new_WeaponDefinition" RENAME TO "WeaponDefinition";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
