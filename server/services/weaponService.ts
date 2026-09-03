import { prisma } from "../../src/lib/prisma.ts";

const WEAPON_BASE_STAT_TYPE = "atk";

export async function getWeapons(language: string) {
  const weapons = await prisma.weaponDefinition.findMany();

  const translations = await prisma.translation.findMany({
    where: {
      entityType: "weapon",
      language,
    },
  });

  const statTranslations = await prisma.translation.findMany({
    where: {
      entityType: "stat",
      language,
    },
  });

  const weaponTypeTranslations = await prisma.translation.findMany({
    where: {
      entityType: "weapontype",
      language,
    },
  });

return weapons.map((weapon) => {
  const nameTranslation = translations.find(
    (translation) =>
      translation.key === weapon.key &&
      translation.field === "name",
  );

  const effectTranslation = translations.find(
    (translation) =>
      translation.key === weapon.key &&
      translation.field === "effect",
  );

  const subStatTranslation = statTranslations.find(
    (translation) =>
      translation.key === weapon.subStatTypeKey &&
      translation.field === "name",
  );

  const weaponTypeTranslation = weaponTypeTranslations.find(
    (translation) =>
      translation.key === weapon.weaponTypeKey &&
      translation.field === "name",
  );

  const baseStatTranslation = statTranslations.find(
    (translation) =>
      translation.key === WEAPON_BASE_STAT_TYPE &&
      translation.field === "name",
  );

  return {
    key: weapon.key,

    name: nameTranslation?.text ?? weapon.key,

    baseStat: {
      key: WEAPON_BASE_STAT_TYPE,
      name: baseStatTranslation?.text ?? WEAPON_BASE_STAT_TYPE,
      value: weapon.baseATK,
    },

    subStat: {
      key: weapon.subStatTypeKey,
      name: subStatTranslation?.text ?? weapon.subStatTypeKey,
      value: weapon.subStat,
    },

    effect: effectTranslation?.text ?? "",

    type: {
      key: weapon.weaponTypeKey,
      name: weaponTypeTranslation?.text ?? weapon.weaponTypeKey,
    },

    rarity: weapon.rarity,
  };
});
}