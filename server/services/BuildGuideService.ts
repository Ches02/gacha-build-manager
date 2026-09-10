import { prisma } from "../../src/lib/prisma.ts";
import { ReferenceValidationError } from "./serviceError.ts";

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
   VALIDATE BUILD GUIDE REFERENCES
   ========================= */

async function validateBuildGuideReferences(
  data: {
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
  const errors: string[] = [];

  /* =========================
     CHARACTERS
     ========================= */

  if (
    data.characters !== undefined &&
    data.characters.length > 0
  ) {
    const uniqueCharacterKeys = [
      ...new Set(data.characters),
    ];

    const characters =
      await prisma.characterDefinition.findMany({
        where: {
          key: {
            in: uniqueCharacterKeys,
          },
        },
        select: {
          key: true,
        },
      });

    const validCharacterKeys = new Set(
      characters.map(
        (character) => character.key,
      ),
    );

    const missingCharacterKeys =
      uniqueCharacterKeys.filter(
        (key) =>
          !validCharacterKeys.has(key),
      );

    missingCharacterKeys.forEach((key) => {
      errors.push(
        `characters contiene una referencia que no corresponde a un personaje existente: ${key}`,
      );
    });
  }

  /* =========================
     WEAPONS
     ========================= */

  if (
    data.weapons !== undefined &&
    data.weapons.length > 0
  ) {
    const uniqueWeaponKeys = [
      ...new Set(data.weapons),
    ];

    const weapons =
      await prisma.weaponDefinition.findMany({
        where: {
          key: {
            in: uniqueWeaponKeys,
          },
        },
        select: {
          key: true,
        },
      });

    const validWeaponKeys = new Set(
      weapons.map(
        (weapon) => weapon.key,
      ),
    );

    const missingWeaponKeys =
      uniqueWeaponKeys.filter(
        (key) =>
          !validWeaponKeys.has(key),
      );

    missingWeaponKeys.forEach((key) => {
      errors.push(
        `weapons contiene una referencia que no corresponde a un arma existente: ${key}`,
      );
    });
  }

  /* =========================
     ARTIFACT SETS
     ========================= */

  if (
    data.artifactSets !== undefined &&
    data.artifactSets.length > 0
  ) {
    const uniqueArtifactSetKeys = [
      ...new Set(
        data.artifactSets.map(
          (artifactSet) =>
            artifactSet.artifactSetKey,
        ),
      ),
    ];

    const artifactSets =
      await prisma.artifactSetDefinition.findMany({
        where: {
          key: {
            in: uniqueArtifactSetKeys,
          },
        },
        select: {
          key: true,
        },
      });

    const validArtifactSetKeys = new Set(
      artifactSets.map(
        (artifactSet) =>
          artifactSet.key,
      ),
    );

    const missingArtifactSetKeys =
      uniqueArtifactSetKeys.filter(
        (key) =>
          !validArtifactSetKeys.has(key),
      );

    missingArtifactSetKeys.forEach((key) => {
      errors.push(
        `artifactSetKey contiene una referencia que no corresponde a un conjunto de artefactos existente: ${key}`,
      );
    });
  }

  /* =========================
     MAIN STATS
     ========================= */

  if (
    data.mainStats !== undefined &&
    data.mainStats.length > 0
  ) {
    const uniqueSlotKeys = [
      ...new Set(
        data.mainStats.map(
          (mainStat) =>
            mainStat.slotKey,
        ),
      ),
    ];

    const uniqueMainStatKeys = [
      ...new Set(
        data.mainStats.map(
          (mainStat) =>
            mainStat.statTypeKey,
        ),
      ),
    ];

    const slots =
      await prisma.artifactSlot.findMany({
        where: {
          key: {
            in: uniqueSlotKeys,
          },
        },
        select: {
          key: true,
        },
      });

    const stats =
      await prisma.statType.findMany({
        where: {
          key: {
            in: uniqueMainStatKeys,
          },
        },
        select: {
          key: true,
        },
      });

    const validSlotKeys = new Set(
      slots.map(
        (slot) => slot.key,
      ),
    );

    const validStatKeys = new Set(
      stats.map(
        (stat) => stat.key,
      ),
    );

    const missingSlotKeys =
      uniqueSlotKeys.filter(
        (key) =>
          !validSlotKeys.has(key),
      );

    const missingStatKeys =
      uniqueMainStatKeys.filter(
        (key) =>
          !validStatKeys.has(key),
      );

    missingSlotKeys.forEach((key) => {
      errors.push(
        `slotKey contiene una referencia que no corresponde a un slot de artefacto existente: ${key}`,
      );
    });

    missingStatKeys.forEach((key) => {
      errors.push(
        `statTypeKey contiene una referencia que no corresponde a un stat existente: ${key}`,
      );
    });
  }

  /* =========================
     STAT PRIORITIES
     ========================= */

  if (
    data.statPriorities !== undefined &&
    data.statPriorities.length > 0
  ) {
    const uniqueStatPriorityKeys = [
      ...new Set(
        data.statPriorities.map(
          (statPriority) =>
            statPriority.statTypeKey,
        ),
      ),
    ];

    const stats =
      await prisma.statType.findMany({
        where: {
          key: {
            in: uniqueStatPriorityKeys,
          },
        },
        select: {
          key: true,
        },
      });

    const validStatKeys = new Set(
      stats.map(
        (stat) => stat.key,
      ),
    );

    const missingStatKeys =
      uniqueStatPriorityKeys.filter(
        (key) =>
          !validStatKeys.has(key),
      );

    missingStatKeys.forEach((key) => {
      errors.push(
        `statTypeKey contiene una referencia que no corresponde a un stat existente: ${key}`,
      );
    });
  }

  if (errors.length > 0) {
    throw new ReferenceValidationError(
      errors,
    );
  }
}

/* =========================
   USER BUILD GUIDES
   ========================= */

export async function getUserBuildGuides(
  userId: number,
) {
  const buildGuides =
    await prisma.buildGuide.findMany({
      where: {
        userId,
      },
      include: buildGuideInclude,
    });

  const translations =
    await getTranslations();

  return buildGuides.map(
    (buildGuide) =>
      formatBuildGuide(
        buildGuide,
        translations,
      ),
  );
}

export async function getUserBuildGuide(
  id: number,
  userId: number,
) {
  const buildGuide =
    await prisma.buildGuide.findFirst({
      where: {
        id,
        userId,
      },
      include: buildGuideInclude,
    });

  if (!buildGuide) {
    return null;
  }

  const translations =
    await getTranslations();

  return formatBuildGuide(
    buildGuide,
    translations,
  );
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
  await validateBuildGuideReferences(data);

  const buildGuide =
    await prisma.buildGuide.create({
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
              create: data.weapons.map(
                (weaponKey) => ({
                  weaponKey,
                }),
              ),
            }
          : undefined,

        artifactSets: data.artifactSets
          ? {
              create: data.artifactSets.map(
                (artifactSet) => ({
                  artifactSetKey:
                    artifactSet.artifactSetKey,
                  pieces:
                    artifactSet.pieces,
                }),
              ),
            }
          : undefined,

        mainStats: data.mainStats
          ? {
              create: data.mainStats.map(
                (mainStat) => ({
                  slotKey:
                    mainStat.slotKey,
                  statTypeKey:
                    mainStat.statTypeKey,
                }),
              ),
            }
          : undefined,

        statPriorities:
          data.statPriorities
            ? {
                create:
                  data.statPriorities.map(
                    (statPriority) => ({
                      statTypeKey:
                        statPriority.statTypeKey,
                      priority:
                        statPriority.priority,
                      targetValue:
                        statPriority.targetValue,
                    }),
                  ),
              }
            : undefined,
      },

      include: buildGuideInclude,
    });

  const translations =
    await getTranslations();

  return formatBuildGuide(
    buildGuide,
    translations,
  );
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
  const buildGuide =
    await prisma.buildGuide.findFirst({
      where: {
        id,
        userId,
      },
    });

  if (!buildGuide) {
    return null;
  }

  await validateBuildGuideReferences(data);

  const updatedBuildGuide =
    await prisma.$transaction(
      async (transaction) => {
        if (
          data.characters !== undefined
        ) {
          await transaction.buildGuideCharacter.deleteMany(
            {
              where: {
                buildGuideId: id,
              },
            },
          );

          if (data.characters.length > 0) {
            await transaction.buildGuideCharacter.createMany(
              {
                data: data.characters.map(
                  (
                    characterDefinitionKey,
                  ) => ({
                    buildGuideId: id,
                    characterDefinitionKey,
                  }),
                ),
              },
            );
          }
        }

        if (
          data.weapons !== undefined
        ) {
          await transaction.buildGuideWeapon.deleteMany(
            {
              where: {
                buildGuideId: id,
              },
            },
          );

          if (data.weapons.length > 0) {
            await transaction.buildGuideWeapon.createMany(
              {
                data: data.weapons.map(
                  (weaponKey) => ({
                    buildGuideId: id,
                    weaponKey,
                  }),
                ),
              },
            );
          }
        }

        if (
          data.artifactSets !==
          undefined
        ) {
          await transaction.buildGuideArtifactSet.deleteMany(
            {
              where: {
                buildGuideId: id,
              },
            },
          );

          if (
            data.artifactSets.length > 0
          ) {
            await transaction.buildGuideArtifactSet.createMany(
              {
                data: data.artifactSets.map(
                  (artifactSet) => ({
                    buildGuideId: id,
                    artifactSetKey:
                      artifactSet.artifactSetKey,
                    pieces:
                      artifactSet.pieces,
                  }),
                ),
              },
            );
          }
        }

        if (
          data.mainStats !== undefined
        ) {
          await transaction.buildGuideMainStat.deleteMany(
            {
              where: {
                buildGuideId: id,
              },
            },
          );

          if (data.mainStats.length > 0) {
            await transaction.buildGuideMainStat.createMany(
              {
                data: data.mainStats.map(
                  (mainStat) => ({
                    buildGuideId: id,
                    slotKey:
                      mainStat.slotKey,
                    statTypeKey:
                      mainStat.statTypeKey,
                  }),
                ),
              },
            );
          }
        }

        if (
          data.statPriorities !==
          undefined
        ) {
          await transaction.buildGuideStatPriority.deleteMany(
            {
              where: {
                buildGuideId: id,
              },
            },
          );

          if (
            data.statPriorities.length > 0
          ) {
            await transaction.buildGuideStatPriority.createMany(
              {
                data:
                  data.statPriorities.map(
                    (statPriority) => ({
                      buildGuideId: id,
                      statTypeKey:
                        statPriority.statTypeKey,
                      priority:
                        statPriority.priority,
                      targetValue:
                        statPriority.targetValue,
                    }),
                  ),
              },
            );
          }
        }

        return transaction.buildGuide.update(
          {
            where: {
              id,
            },
            data: {
              name: data.name,
              description:
                data.description,
            },
            include: buildGuideInclude,
          },
        );
      },
    );

  const translations =
    await getTranslations();

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
  const buildGuide =
    await prisma.buildGuide.findFirst({
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