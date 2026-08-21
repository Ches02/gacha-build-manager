-- CreateTable
CREATE TABLE "CharacterDefinition" (
    "key" TEXT NOT NULL PRIMARY KEY
);

-- CreateTable
CREATE TABLE "CharacterTranslation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "characterKey" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    CONSTRAINT "CharacterTranslation_characterKey_fkey" FOREIGN KEY ("characterKey") REFERENCES "CharacterDefinition" ("key") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "CharacterTranslation_characterKey_language_key" ON "CharacterTranslation"("characterKey", "language");
