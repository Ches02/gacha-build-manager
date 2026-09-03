import { prisma } from "../../src/lib/prisma.ts";

export async function getLoadouts() {
  const loadouts = await prisma.loadout.findMany({
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