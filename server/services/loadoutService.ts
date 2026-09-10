import { prisma } from "../../src/lib/prisma.ts";
import { ReferenceValidationError } from "./serviceError.ts";

/* =========================
   USER LOADOUTS
   ========================= */

export async function getUserLoadouts(userId: number) {
  const loadouts = await prisma.loadout.findMany({
    where: {
      userId,
    },

    include: {
      character: {
        include: {
          definition: true,
        },
      },

      weapon: {
        include: {
          definition: true,
        },
      },

      artifactLoadout: {
        include: {
          artifacts: {
            include: {
              artifact: {
                include: {
                  subStats: true,
                },
              },
            },
          },
        },
      },

      buildGuide: true,
    },
  });

  const translations = await prisma.translation.findMany({
    where: {
      language: "es",
    },
  });

  const getTranslation = (
    entityType: string,
    key: string,
    field: string,
  ) => {
    return translations.find(
      (translation) =>
        translation.entityType === entityType &&
        translation.key === key &&
        translation.field === field,
    )?.text;
  };

  return loadouts.map((loadout) => ({
    id: loadout.id,
    name: loadout.name,
    description: loadout.description,

    character: loadout.character
      ? {
        id: loadout.character.id,
        key: loadout.character.definition.key,

        name:
          getTranslation(
            "character",
            loadout.character.definition.key,
            "name",
          ) ?? loadout.character.definition.key,

        element: loadout.character.definition.element,

        weaponType: {
          key: loadout.character.definition.weaponTypeKey,

          name:
            getTranslation(
              "weapontype",
              loadout.character.definition.weaponTypeKey,
              "name",
            ) ?? loadout.character.definition.weaponTypeKey,
        },

        rarity: loadout.character.definition.rarity,
        nation: loadout.character.definition.nation,

        level: loadout.character.level,
        constellation: loadout.character.constellation,
        friendship: loadout.character.friendship,
        ascension: loadout.character.ascension,

        talents: {
          normalAttack: loadout.character.normalAttackLevel,
          elementalSkill: loadout.character.elementalSkillLevel,
          elementalBurst: loadout.character.elementalBurstLevel,
        },
      }
      : null,

    weapon: loadout.weapon
      ? {
        id: loadout.weapon.id,
        key: loadout.weapon.definition.key,

        name:
          getTranslation(
            "weapon",
            loadout.weapon.definition.key,
            "name",
          ) ?? loadout.weapon.definition.key,

        level: loadout.weapon.level,
        refinement: loadout.weapon.refinement,
      }
      : null,

    artifactLoadout: loadout.artifactLoadout
      ? {
        id: loadout.artifactLoadout.id,
        name: loadout.artifactLoadout.name,
        description: loadout.artifactLoadout.description,

        artifacts: loadout.artifactLoadout.artifacts.map((item) => ({
          id: item.artifact.id,

          set: {
            key: item.artifact.setKey,

            name:
              getTranslation(
                "artefacto",
                item.artifact.setKey,
                "name",
              ) ?? item.artifact.setKey,
          },

          slot: {
            key: item.artifact.slotKey,

            name:
              getTranslation(
                "artifactSlot",
                item.artifact.slotKey,
                "name",
              ) ?? item.artifact.slotKey,
          },

          mainStat: {
            key: item.artifact.mainStatTypeKey,

            name:
              getTranslation(
                "stat",
                item.artifact.mainStatTypeKey,
                "name",
              ) ?? item.artifact.mainStatTypeKey,

            value: item.artifact.mainStatValue,
          },

          subStats: item.artifact.subStats.map((subStat) => ({
            key: subStat.statTypeKey,

            name:
              getTranslation(
                "stat",
                subStat.statTypeKey,
                "name",
              ) ?? subStat.statTypeKey,

            value: subStat.value,
          })),

          level: item.artifact.level,
        })),
      }
      : null,

    buildGuide: loadout.buildGuide
      ? {
        id: loadout.buildGuide.id,
        name: loadout.buildGuide.name,
        description: loadout.buildGuide.description,
      }
      : null,
  }));
}

export async function getUserLoadout(
  id: number,
  userId: number,
) {
  const loadout = await prisma.loadout.findFirst({
    where: {
      id,
      userId,
    },

    include: {
      character: {
        include: {
          definition: true,
        },
      },

      weapon: {
        include: {
          definition: true,
        },
      },

      artifactLoadout: {
        include: {
          artifacts: {
            include: {
              artifact: {
                include: {
                  subStats: true,
                },
              },
            },
          },
        },
      },

      buildGuide: true,
    },
  });

  if (!loadout) {
    return null;
  }

  const translations = await prisma.translation.findMany({
    where: {
      language: "es",
    },
  });

  const getTranslation = (
    entityType: string,
    key: string,
    field: string,
  ) => {
    return translations.find(
      (translation) =>
        translation.entityType === entityType &&
        translation.key === key &&
        translation.field === field,
    )?.text;
  };

  return {
    id: loadout.id,
    name: loadout.name,
    description: loadout.description,

    character: loadout.character
      ? {
        id: loadout.character.id,
        key: loadout.character.definition.key,

        name:
          getTranslation(
            "character",
            loadout.character.definition.key,
            "name",
          ) ?? loadout.character.definition.key,

        element: loadout.character.definition.element,

        weaponType: {
          key: loadout.character.definition.weaponTypeKey,

          name:
            getTranslation(
              "weapontype",
              loadout.character.definition.weaponTypeKey,
              "name",
            ) ?? loadout.character.definition.weaponTypeKey,
        },

        rarity: loadout.character.definition.rarity,
        nation: loadout.character.definition.nation,

        level: loadout.character.level,
        constellation: loadout.character.constellation,
        friendship: loadout.character.friendship,
        ascension: loadout.character.ascension,

        talents: {
          normalAttack: loadout.character.normalAttackLevel,
          elementalSkill: loadout.character.elementalSkillLevel,
          elementalBurst: loadout.character.elementalBurstLevel,
        },
      }
      : null,

    weapon: loadout.weapon
      ? {
        id: loadout.weapon.id,
        key: loadout.weapon.definition.key,

        name:
          getTranslation(
            "weapon",
            loadout.weapon.definition.key,
            "name",
          ) ?? loadout.weapon.definition.key,

        level: loadout.weapon.level,
        refinement: loadout.weapon.refinement,
      }
      : null,

    artifactLoadout: loadout.artifactLoadout
      ? {
        id: loadout.artifactLoadout.id,
        name: loadout.artifactLoadout.name,
        description: loadout.artifactLoadout.description,

        artifacts: loadout.artifactLoadout.artifacts.map((item) => ({
          id: item.artifact.id,

          set: {
            key: item.artifact.setKey,

            name:
              getTranslation(
                "artefacto",
                item.artifact.setKey,
                "name",
              ) ?? item.artifact.setKey,
          },

          slot: {
            key: item.artifact.slotKey,

            name:
              getTranslation(
                "artifactSlot",
                item.artifact.slotKey,
                "name",
              ) ?? item.artifact.slotKey,
          },

          mainStat: {
            key: item.artifact.mainStatTypeKey,

            name:
              getTranslation(
                "stat",
                item.artifact.mainStatTypeKey,
                "name",
              ) ?? item.artifact.mainStatTypeKey,

            value: item.artifact.mainStatValue,
          },

          subStats: item.artifact.subStats.map((subStat) => ({
            key: subStat.statTypeKey,

            name:
              getTranslation(
                "stat",
                subStat.statTypeKey,
                "name",
              ) ?? subStat.statTypeKey,

            value: subStat.value,
          })),

          level: item.artifact.level,
        })),
      }
      : null,

    buildGuide: loadout.buildGuide
      ? {
        id: loadout.buildGuide.id,
        name: loadout.buildGuide.name,
        description: loadout.buildGuide.description,
      }
      : null,
  };
}

/* =========================
   VALIDATE LOADOUT REFERENCES
   ========================= */

async function validateLoadoutReferences(
  userId: number,
  data: {
    characterId?: number | null;
    weaponId?: number | null;
    artifactLoadoutId?: number | null;
    buildGuideId?: number | null;
  },
) {
  const errors: string[] = [];

  if (data.characterId !== undefined && data.characterId !== null) {
    const character = await prisma.character.findFirst({
      where: {
        id: data.characterId,
        userId,
      },
      select: {
        id: true,
      },
    });

    if (!character) {
      errors.push(
        "characterId no existe o no pertenece al usuario",
      );
    }
  }

  if (data.weaponId !== undefined && data.weaponId !== null) {
    const weapon = await prisma.weapon.findFirst({
      where: {
        id: data.weaponId,
        userId,
      },
      select: {
        id: true,
      },
    });

    if (!weapon) {
      errors.push(
        "weaponId no existe o no pertenece al usuario",
      );
    }
  }

  if (
    data.artifactLoadoutId !== undefined &&
    data.artifactLoadoutId !== null
  ) {
    const artifactLoadout =
      await prisma.artifactLoadout.findFirst({
        where: {
          id: data.artifactLoadoutId,
          userId,
        },
        select: {
          id: true,
        },
      });

    if (!artifactLoadout) {
      errors.push(
        "artifactLoadoutId no existe o no pertenece al usuario",
      );
    }
  }

  if (
    data.buildGuideId !== undefined &&
    data.buildGuideId !== null
  ) {
    const buildGuide = await prisma.buildGuide.findFirst({
      where: {
        id: data.buildGuideId,
        userId,
      },
      select: {
        id: true,
      },
    });

    if (!buildGuide) {
      errors.push(
        "buildGuideId no existe o no pertenece al usuario",
      );
    }
  }

  if (errors.length > 0) {
    throw new ReferenceValidationError(errors);
  }
}

/* =========================
   CREATE LOADOUT
   ========================= */

export async function createLoadout(
  userId: number,
  data: {
    name: string;
    description?: string;
    characterId?: number | null;
    weaponId?: number | null;
    artifactLoadoutId?: number | null;
    buildGuideId?: number | null;
  },
) {
  await validateLoadoutReferences(
    userId,
    data,
  );

  const loadout = await prisma.loadout.create({
    data: {
      userId,
      name: data.name,
      description: data.description ?? null,
      characterId: data.characterId ?? null,
      weaponId: data.weaponId ?? null,
      artifactLoadoutId: data.artifactLoadoutId ?? null,
      buildGuideId: data.buildGuideId ?? null,
    },
  });

  return loadout;
}

/* =========================
   UPDATE LOADOUT
   ========================= */

export async function updateLoadout(
  id: number,
  userId: number,
  data: {
    name?: string;
    description?: string | null;
    characterId?: number | null;
    weaponId?: number | null;
    artifactLoadoutId?: number | null;
    buildGuideId?: number | null;
  },
) {
  const existingLoadout = await prisma.loadout.findFirst({
    where: {
      id,
      userId,
    },
  });

  if (!existingLoadout) {
    return null;
  }

  await validateLoadoutReferences(
    userId,
    data,
  );

  const loadout = await prisma.loadout.update({
    where: {
      id,
    },
    data: {
      ...(data.name !== undefined && {
        name: data.name,
      }),

      ...(data.description !== undefined && {
        description: data.description,
      }),

      ...(data.characterId !== undefined && {
        characterId: data.characterId,
      }),

      ...(data.weaponId !== undefined && {
        weaponId: data.weaponId,
      }),

      ...(data.artifactLoadoutId !== undefined && {
        artifactLoadoutId: data.artifactLoadoutId,
      }),

      ...(data.buildGuideId !== undefined && {
        buildGuideId: data.buildGuideId,
      }),
    },
  });

  return loadout;
}

/* =========================
   DELETE LOADOUT
   ========================= */

export async function deleteLoadout(
  id: number,
  userId: number,
) {
  const existingLoadout = await prisma.loadout.findFirst({
    where: {
      id,
      userId,
    },
  });

  if (!existingLoadout) {
    return null;
  }

  await prisma.loadout.delete({
    where: {
      id,
    },
  });

  return existingLoadout;
}