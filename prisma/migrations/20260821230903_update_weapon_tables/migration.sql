-- CreateTable
CREATE TABLE "WeaponDefinition" (
    "key" TEXT NOT NULL PRIMARY KEY,
    "rarity" INTEGER NOT NULL,
    "mainStatType" TEXT NOT NULL,
    "subStatType" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "WeaponTranslation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "weaponKey" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "passiveEffect" TEXT,
    CONSTRAINT "WeaponTranslation_weaponKey_fkey" FOREIGN KEY ("weaponKey") REFERENCES "WeaponDefinition" ("key") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "WeaponTranslation_weaponKey_language_key" ON "WeaponTranslation"("weaponKey", "language");
