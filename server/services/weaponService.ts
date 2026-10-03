import { prisma } from "../../src/lib/prisma.ts";
import { ReferenceValidationError } from "./serviceError.ts";

const WEAPON_BASE_STAT_TYPE = "atk";

export async function getWeapons(
  language: string,
  filters?: {
    rarity?: number;
    weaponType?: string;
  },
) {
  const weapons = await prisma.weaponDefinition.findMany({
    where: {
      ...(filters?.rarity !== undefined && {
        rarity: filters.rarity,
      }),
      ...(filters?.weaponType !== undefined && {
        weaponTypeKey: filters.weaponType,
      }),
    },
  });

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

      subStat:
        weapon.subStatTypeKey !== null &&
          weapon.subStat !== null
          ? {
            key: weapon.subStatTypeKey,
            name:
              subStatTranslation?.text ??
              weapon.subStatTypeKey,
            value: weapon.subStat,
          }
          : null,

      effect: effectTranslation?.text ?? "",

      type: {
        key: weapon.weaponTypeKey,
        name: weaponTypeTranslation?.text ?? weapon.weaponTypeKey,
      },

      rarity: weapon.rarity,
      obtainType: weapon.obtainType,
    };
  });
}

export async function getWeapon(key: string, language: string) {
  const weapon = await prisma.weaponDefinition.findUnique({
    where: {
      key,
    },
  });

  if (!weapon) {
    return null;
  }

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

    subStat:
      weapon.subStatTypeKey !== null &&
        weapon.subStat !== null
        ? {
          key: weapon.subStatTypeKey,
          name:
            subStatTranslation?.text ??
            weapon.subStatTypeKey,
          value: weapon.subStat,
        }
        : null,

    effect: effectTranslation?.text ?? "",

    type: {
      key: weapon.weaponTypeKey,
      name: weaponTypeTranslation?.text ?? weapon.weaponTypeKey,
    },

    rarity: weapon.rarity,
    obtainType: weapon.obtainType,
  };
}

/* =========================
   USER WEAPONS
   ========================= */

export async function getUserWeapons(userId: number) {
  return prisma.weapon.findMany({
    where: {
      userId,
    },
    include: {
      definition: true,
    },
  });
}

export async function getUserWeapon(
  id: number,
  userId: number,
) {
  return prisma.weapon.findFirst({
    where: {
      id,
      userId,
    },
    include: {
      definition: true,
    },
  });
}

export async function createWeapon(
  userId: number,
  data: {
    definitionKey: string;
    level: number;
    refinement: number;
  },
) {
  const definition = await prisma.weaponDefinition.findUnique({
    where: {
      key: data.definitionKey,
    },
  });

  if (!definition) {
    throw new ReferenceValidationError([
      "definitionKey no corresponde a un arma existente",
    ]);
  }

  return prisma.weapon.create({
    data: {
      userId,
      definitionKey: data.definitionKey,
      level: data.level,
      refinement: data.refinement,
    },
    include: {
      definition: true,
    },
  });
}

export async function updateWeapon(
  id: number,
  userId: number,
  data: {
    definitionKey?: string;
    level?: number;
    refinement?: number;
  },
) {
  const weapon = await prisma.weapon.findFirst({
    where: {
      id,
      userId,
    },
  });

  if (!weapon) {
    return null;
  }

  if (data.definitionKey !== undefined) {
    const definition = await prisma.weaponDefinition.findUnique({
      where: {
        key: data.definitionKey,
      },
    });

    if (!definition) {
      throw new ReferenceValidationError([
        "definitionKey no corresponde a un arma existente",
      ]);
    }
  }

  return prisma.weapon.update({
    where: {
      id,
    },
    data,
    include: {
      definition: true,
    },
  });
}

export async function deleteWeapon(
  id: number,
  userId: number,
) {
  const weapon = await prisma.weapon.findFirst({
    where: {
      id,
      userId,
    },
  });

  if (!weapon) {
    return null;
  }

  return prisma.weapon.delete({
    where: {
      id,
    },
  });
}
