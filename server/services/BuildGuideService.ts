import { prisma } from "../../src/lib/prisma.ts";

export async function getBuildGuides() {
  const buildGuides = await prisma.buildGuide.findMany({
    include: {
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
          priority: "asc",
        },
      },
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

  return buildGuides.map((buildGuide) => ({
    id: buildGuide.id,
    name: buildGuide.name,
    description: buildGuide.description,

    characters: buildGuide.characters.map((item) => ({
      key: item.character.key,
      name:
        getTranslation(
          "character",
          item.character.key,
          "name",
        ) ?? item.character.key,
    })),

    weapons: buildGuide.weapons.map((item) => ({
      key: item.weapon.key,
      name:
        getTranslation(
          "weapon",
          item.weapon.key,
          "name",
        ) ?? item.weapon.key,
    })),

    artifactSets: buildGuide.artifactSets.map((item) => ({
      key: item.artifactSet.key,
      name:
        getTranslation(
          "artefacto",
          item.artifactSet.key,
          "name",
        ) ?? item.artifactSet.key,
      pieces: item.pieces,
    })),

    mainStats: buildGuide.mainStats.map((item) => ({
      slot: {
        key: item.slot.key,
        name:
          getTranslation(
            "artifactSlot",
            item.slot.key,
            "name",
          ) ?? item.slot.key,
      },

      stat: {
        key: item.statType.key,
        name:
          getTranslation(
            "stat",
            item.statType.key,
            "name",
          ) ?? item.statType.key,
      },
    })),

    statPriorities: buildGuide.statPriorities.map((item) => ({
      priority: item.priority,

      stat: {
        key: item.statType.key,
        name:
          getTranslation(
            "stat",
            item.statType.key,
            "name",
          ) ?? item.statType.key,
      },

      targetValue: item.targetValue,
    })),
  }));
}

export async function getBuildGuide(id: number) {
  const buildGuide = await prisma.buildGuide.findUnique({
    where: {
      id,
    },
    include: {
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
          priority: "asc",
        },
      },
    },
  });

  if (!buildGuide) {
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
    id: buildGuide.id,
    name: buildGuide.name,
    description: buildGuide.description,

    characters: buildGuide.characters.map((item) => ({
      key: item.character.key,
      name:
        getTranslation(
          "character",
          item.character.key,
          "name",
        ) ?? item.character.key,
    })),

    weapons: buildGuide.weapons.map((item) => ({
      key: item.weapon.key,
      name:
        getTranslation(
          "weapon",
          item.weapon.key,
          "name",
        ) ?? item.weapon.key,
    })),

    artifactSets: buildGuide.artifactSets.map((item) => ({
      key: item.artifactSet.key,
      name:
        getTranslation(
          "artefacto",
          item.artifactSet.key,
          "name",
        ) ?? item.artifactSet.key,
      pieces: item.pieces,
    })),

    mainStats: buildGuide.mainStats.map((item) => ({
      slot: {
        key: item.slot.key,
        name:
          getTranslation(
            "artifactSlot",
            item.slot.key,
            "name",
          ) ?? item.slot.key,
      },

      stat: {
        key: item.statType.key,
        name:
          getTranslation(
            "stat",
            item.statType.key,
            "name",
          ) ?? item.statType.key,
      },
    })),

    statPriorities: buildGuide.statPriorities.map((item) => ({
      priority: item.priority,

      stat: {
        key: item.statType.key,
        name:
          getTranslation(
            "stat",
            item.statType.key,
            "name",
          ) ?? item.statType.key,
      },

      targetValue: item.targetValue,
    })),
  };
}