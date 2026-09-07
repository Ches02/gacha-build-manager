import { prisma } from "../../src/lib/prisma.ts";

export async function getCharacters(language: string) {
  const characters = await prisma.characterDefinition.findMany();

  const translations = await prisma.translation.findMany({
    where: {
      entityType: "character",
      language,
    },
  });

  const weaponTypeTranslations = await prisma.translation.findMany({
    where: {
      entityType: "weapontype",
      language,
    },
  });

  return characters.map((character) => {
    const nameTranslation = translations.find(
      (translation) =>
        translation.key === character.key &&
        translation.field === "name",
    );

    const weaponTypeTranslation = weaponTypeTranslations.find(
      (translation) =>
        translation.key === character.weaponTypeKey &&
        translation.field === "name",
    );

    return {
      key: character.key,

      name: nameTranslation?.text ?? character.key,

      element: character.element,

      weaponType: {
        key: character.weaponTypeKey,
        name: weaponTypeTranslation?.text ?? character.weaponTypeKey,
      },

      rarity: character.rarity,

      nation: character.nation,
    };
  });
}

export async function getCharacter(key: string, language: string) {
  const character = await prisma.characterDefinition.findUnique({
    where: {
      key,
    },
  });

  if (!character) {
    return null;
  }

  const nameTranslation = await prisma.translation.findFirst({
    where: {
      entityType: "character",
      key: character.key,
      field: "name",
      language,
    },
  });

  const weaponTypeTranslation = await prisma.translation.findFirst({
    where: {
      entityType: "weapontype",
      key: character.weaponTypeKey,
      field: "name",
      language,
    },
  });

  return {
    key: character.key,

    name: nameTranslation?.text ?? character.key,

    element: character.element,

    weaponType: {
      key: character.weaponTypeKey,
      name: weaponTypeTranslation?.text ?? character.weaponTypeKey,
    },

    rarity: character.rarity,

    nation: character.nation,
  };
}

export async function createCharacter(
  userId: number,
  data: {
    definitionKey: string;
    level: number;
    constellation: number;
    friendship: number;
    ascension: number;
    normalAttackLevel: number;
    elementalSkillLevel: number;
    elementalBurstLevel: number;
  },
) {
  const definition = await prisma.characterDefinition.findUnique({
    where: {
      key: data.definitionKey,
    },
  });

  if (!definition) {
    return null;
  }

  return prisma.character.create({
    data: {
      definitionKey: data.definitionKey,
      userId,
      level: data.level,
      constellation: data.constellation,
      friendship: data.friendship,
      ascension: data.ascension,
      normalAttackLevel: data.normalAttackLevel,
      elementalSkillLevel: data.elementalSkillLevel,
      elementalBurstLevel: data.elementalBurstLevel,
    },
  });
}

export async function getUserCharacters(userId: number) {
  return prisma.character.findMany({
    where: {
      userId,
    },
    include: {
      definition: true,
    },
  });
}

export async function updateCharacter(
  id: number,
  userId: number,
  data: {
    level: number;
    constellation: number;
    friendship: number;
    ascension: number;
    normalAttackLevel: number;
    elementalSkillLevel: number;
    elementalBurstLevel: number;
  },
) {
  const character = await prisma.character.findFirst({
    where: {
      id,
      userId,
    },
  });

  if (!character) {
    return null;
  }

  return prisma.character.update({
    where: {
      id,
    },
    data: {
      level: data.level,
      constellation: data.constellation,
      friendship: data.friendship,
      ascension: data.ascension,
      normalAttackLevel: data.normalAttackLevel,
      elementalSkillLevel: data.elementalSkillLevel,
      elementalBurstLevel: data.elementalBurstLevel,
    },
  });
}

export async function deleteCharacter(id: number, userId: number) {
  const character = await prisma.character.findFirst({
    where: {
      id,
      userId,
    },
  });

  if (!character) {
    return null;
  }

  return prisma.character.delete({
    where: {
      id,
    },
  });
}

export async function getUserCharacter(
  id: number,
  userId: number,
) {
  return prisma.character.findFirst({
    where: {
      id,
      userId,
    },
    include: {
      definition: true,
    },
  });
}