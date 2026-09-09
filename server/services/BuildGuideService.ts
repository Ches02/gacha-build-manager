import { prisma } from "../../src/lib/prisma.ts";

/* =========================
   BUILD GUIDE INCLUDE
   ========================= */

const buildGuideInclude = {
  characters: {
    include: {
      character: true,
    },
  },

  weapons: {
    include: {
      weapon: true,
    },
  },

  artifactSets: {
    include: {
      artifactSet: true,
    },
  },

  mainStats: {
    include: {
      slot: true,
      statType: true,
    },
  },

  statPriorities: {
    include: {
      statType: true,
    },
    orderBy: {
      priority: "asc" as const,
    },
  },
};

/* =========================
   TRANSLATIONS
   ========================= */

async function getTranslations() {
  return prisma.translation.findMany({
    where: {
      language: "es",
    },
  });
}

function getTranslation(
  translations: {
    entityType: string;
    key: string;
    field: string;
    text: string;
  }[],
  entityType: string,
  key: string,
  field: string,
) {
  return translations.find(
    (translation) =>
      translation.entityType === entityType &&
      translation.key === key &&
      translation.field === field,
  )?.text;
}

/* =========================
   FORMAT BUILD GUIDE
   ========================= */

function formatBuildGuide(
  buildGuide: any,
  translations: {
    entityType: string;
    key: string;
    field: string;
    text: string;
  }[],
) {
  return {
    id: buildGuide.id,
    name: buildGuide.name,
    description: buildGuide.description,

    characters: buildGuide.characters.map((item: any) => ({
      key: item.character.key,
      name:
        getTranslation(
          translations,
          "character",
          item.character.key,
          "name",
        ) ?? item.character.key,
    })),

    weapons: buildGuide.weapons.map((item: any) => ({
      key: item.weapon.key,
      name:
        getTranslation(
          translations,
          "weapon",
          item.weapon.key,
          "name",
        ) ?? item.weapon.key,
    })),

    artifactSets: buildGuide.artifactSets.map((item: any) => ({
      key: item.artifactSet.key,
      name:
        getTranslation(
          translations,
          "artefacto",
          item.artifactSet.key,
          "name",
        ) ?? item.artifactSet.key,
      pieces: item.pieces,
    })),

    mainStats: buildGuide.mainStats.map((item: any) => ({
      slot: {
        key: item.slot.key,
        name:
          getTranslation(
            translations,
            "artifactSlot",
            item.slot.key,
            "name",
          ) ?? item.slot.key,
      },

      stat: {
        key: item.statType.key,
        name:
          getTranslation(
            translations,
            "stat",
            item.statType.key,
            "name",
          ) ?? item.statType.key,
      },
    })),

    statPriorities: buildGuide.statPriorities.map((item: any) => ({
      priority: item.priority,

      stat: {
        key: item.statType.key,
        name:
          getTranslation(
            translations,
            "stat",
            item.statType.key,
            "name",
          ) ?? item.statType.key,
      },

      targetValue: item.targetValue,
    })),
  };
}

/* =========================
   USER BUILD GUIDES
   ========================= */

export async function getUserBuildGuides(userId: number) {
  const buildGuides = await prisma.buildGuide.findMany({
    where: {
      userId,
    },
    include: buildGuideInclude,
  });

  const translations = await getTranslations();

  return buildGuides.map((buildGuide) =>
    formatBuildGuide(buildGuide, translations),
  );
}

export async function getUserBuildGuide(
  id: number,
  userId: number,
) {
  const buildGuide = await prisma.buildGuide.findFirst({
    where: {
      id,
      userId,
    },
    include: buildGuideInclude,
  });

  if (!buildGuide) {
    return null;
  }

  const translations = await getTranslations();

  return formatBuildGuide(buildGuide, translations);
}

/* =========================
   CREATE BUILD GUIDE
   ========================= */

export async function createBuildGuide(
  userId: number,
  data: {
    name: string;
    description?: string;

    characters?: string[];

    weapons?: string[];

    artifactSets?: {
      artifactSetKey: string;
      pieces: number;
    }[];

    mainStats?: {
      slotKey: string;
      statTypeKey: string;
    }[];

    statPriorities?: {
      statTypeKey: string;
      priority: number;
      targetValue?: number;
    }[];
  },
) {
  const buildGuide = await prisma.buildGuide.create({
    data: {
      userId,
      name: data.name,
      description: data.description,

      characters: data.characters
        ? {
            create: data.characters.map(
              (characterDefinitionKey) => ({
                characterDefinitionKey,
              }),
            ),
          }
        : undefined,

      weapons: data.weapons
        ? {
            create: data.weapons.map((weaponKey) => ({
              weaponKey,
            })),
          }
        : undefined,

      artifactSets: data.artifactSets
        ? {
            create: data.artifactSets.map((artifactSet) => ({
              artifactSetKey: artifactSet.artifactSetKey,
              pieces: artifactSet.pieces,
            })),
          }
        : undefined,

      mainStats: data.mainStats
        ? {
            create: data.mainStats.map((mainStat) => ({
              slotKey: mainStat.slotKey,
              statTypeKey: mainStat.statTypeKey,
            })),
          }
        : undefined,

      statPriorities: data.statPriorities
        ? {
            create: data.statPriorities.map((statPriority) => ({
              statTypeKey: statPriority.statTypeKey,
              priority: statPriority.priority,
              targetValue: statPriority.targetValue,
            })),
          }
        : undefined,
    },

    include: buildGuideInclude,
  });

  const translations = await getTranslations();

  return formatBuildGuide(buildGuide, translations);
}

/* =========================
   UPDATE BUILD GUIDE
   ========================= */

export async function updateBuildGuide(
  id: number,
  userId: number,
  data: {
    name?: string;
    description?: string;

    characters?: string[];

    weapons?: string[];

    artifactSets?: {
      artifactSetKey: string;
      pieces: number;
    }[];

    mainStats?: {
      slotKey: string;
      statTypeKey: string;
    }[];

    statPriorities?: {
      statTypeKey: string;
      priority: number;
      targetValue?: number;
    }[];
  },
) {
  const buildGuide = await prisma.buildGuide.findFirst({
    where: {
      id,
      userId,
    },
  });

  if (!buildGuide) {
    return null;
  }

  const updatedBuildGuide = await prisma.$transaction(
    async (transaction) => {
      if (data.characters !== undefined) {
        await transaction.buildGuideCharacter.deleteMany({
          where: {
            buildGuideId: id,
          },
        });

        if (data.characters.length > 0) {
          await transaction.buildGuideCharacter.createMany({
            data: data.characters.map(
              (characterDefinitionKey) => ({
                buildGuideId: id,
                characterDefinitionKey,
              }),
            ),
          });
        }
      }

      if (data.weapons !== undefined) {
        await transaction.buildGuideWeapon.deleteMany({
          where: {
            buildGuideId: id,
          },
        });

        if (data.weapons.length > 0) {
          await transaction.buildGuideWeapon.createMany({
            data: data.weapons.map((weaponKey) => ({
              buildGuideId: id,
              weaponKey,
            })),
          });
        }
      }

      if (data.artifactSets !== undefined) {
        await transaction.buildGuideArtifactSet.deleteMany({
          where: {
            buildGuideId: id,
          },
        });

        if (data.artifactSets.length > 0) {
          await transaction.buildGuideArtifactSet.createMany({
            data: data.artifactSets.map((artifactSet) => ({
              buildGuideId: id,
              artifactSetKey: artifactSet.artifactSetKey,
              pieces: artifactSet.pieces,
            })),
          });
        }
      }

      if (data.mainStats !== undefined) {
        await transaction.buildGuideMainStat.deleteMany({
          where: {
            buildGuideId: id,
          },
        });

        if (data.mainStats.length > 0) {
          await transaction.buildGuideMainStat.createMany({
            data: data.mainStats.map((mainStat) => ({
              buildGuideId: id,
              slotKey: mainStat.slotKey,
              statTypeKey: mainStat.statTypeKey,
            })),
          });
        }
      }

      if (data.statPriorities !== undefined) {
        await transaction.buildGuideStatPriority.deleteMany({
          where: {
            buildGuideId: id,
          },
        });

        if (data.statPriorities.length > 0) {
          await transaction.buildGuideStatPriority.createMany({
            data: data.statPriorities.map((statPriority) => ({
              buildGuideId: id,
              statTypeKey: statPriority.statTypeKey,
              priority: statPriority.priority,
              targetValue: statPriority.targetValue,
            })),
          });
        }
      }

      return transaction.buildGuide.update({
        where: {
          id,
        },
        data: {
          name: data.name,
          description: data.description,
        },
        include: buildGuideInclude,
      });
    },
  );

  const translations = await getTranslations();

  return formatBuildGuide(
    updatedBuildGuide,
    translations,
  );
}

/* =========================
   DELETE BUILD GUIDE
   ========================= */

export async function deleteBuildGuide(
  id: number,
  userId: number,
) {
  const buildGuide = await prisma.buildGuide.findFirst({
    where: {
      id,
      userId,
    },
  });

  if (!buildGuide) {
    return null;
  }

  return prisma.buildGuide.delete({
    where: {
      id,
    },
  });
}