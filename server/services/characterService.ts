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