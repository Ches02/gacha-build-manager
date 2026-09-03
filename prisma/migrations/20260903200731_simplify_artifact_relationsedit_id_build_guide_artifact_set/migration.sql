/*
  Warnings:

  - The primary key for the `BuildGuideArtifactSet` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_BuildGuideArtifactSet" (
    "buildGuideId" INTEGER NOT NULL,
    "artifactSetKey" TEXT NOT NULL,
    "pieces" INTEGER NOT NULL,

    PRIMARY KEY ("buildGuideId", "artifactSetKey", "pieces"),
    CONSTRAINT "BuildGuideArtifactSet_buildGuideId_fkey" FOREIGN KEY ("buildGuideId") REFERENCES "BuildGuide" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "BuildGuideArtifactSet_artifactSetKey_fkey" FOREIGN KEY ("artifactSetKey") REFERENCES "ArtifactSetDefinition" ("key") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_BuildGuideArtifactSet" ("artifactSetKey", "buildGuideId", "pieces") SELECT "artifactSetKey", "buildGuideId", "pieces" FROM "BuildGuideArtifactSet";
DROP TABLE "BuildGuideArtifactSet";
ALTER TABLE "new_BuildGuideArtifactSet" RENAME TO "BuildGuideArtifactSet";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
