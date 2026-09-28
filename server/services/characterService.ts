import { prisma } from "../../src/lib/prisma.ts";
import { ReferenceValidationError } from "./serviceError.ts";

/* =========================
   GLOBAL CHARACTERS
   ========================= */

export async function getCharacters(
  language: string,
  filters?: {
    element?: string;
    rarity?: number;
    weaponType?: string;
    nation?: string;
  },
) {
  const characters = await prisma.characterDefinition.findMany({
    where: {
      ...(filters?.element !== undefined && {
        element: filters.element,
      }),
      ...(filters?.rarity !== undefined && {
        rarity: filters.rarity,
      }),
      ...(filters?.weaponType !== undefined && {
        weaponTypeKey: filters.weaponType,
      }),
      ...(filters?.nation !== undefined && {
        nation: filters.nation,
      }),
    },
  });

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

    const weaponTypeTranslation =
      weaponTypeTranslations.find(
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
        name:
          weaponTypeTranslation?.text ??
          character.weaponTypeKey,
      },
      rarity: character.rarity,
      nation: character.nation,
    };
  });
}

export async function getCharacter(
  key: string,
  language: string,
) {
  const character =
    await prisma.characterDefinition.findUnique({
      where: {
        key,
      },
    });

  if (!character) {
    return null;
  }

  const nameTranslation =
    await prisma.translation.findFirst({
      where: {
        entityType: "character",
        key: character.key,
        field: "name",
        language,
      },
    });

  const weaponTypeTranslation =
    await prisma.translation.findFirst({
      where: {
        entityType: "weapontype",
        key: character.weaponTypeKey,
        field: "name",
        language,
      },
    });

  return {
    key: character.key,
    name:
      nameTranslation?.text ??
      character.key,
    element: character.element,
    weaponType: {
      key: character.weaponTypeKey,
      name:
        weaponTypeTranslation?.text ??
        character.weaponTypeKey,
    },
    rarity: character.rarity,
    nation: character.nation,
  };
}

/* =========================
   CREATE CHARACTER
   ========================= */

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
    isPreferred?: boolean;
  },
) {
  const definition =
    await prisma.characterDefinition.findUnique({
      where: {
        key: data.definitionKey,
      },
    });

  if (!definition) {
    return null;
  }

  const isPreferred =
    data.isPreferred ?? false;

  /*
   * Si este personaje se crea como preferido,
   * desmarcamos cualquier otro personaje del mismo
   * usuario y de la misma definición.
   */
  if (isPreferred) {
    await prisma.character.updateMany({
      where: {
        userId,
        definitionKey: data.definitionKey,
      },
      data: {
        isPreferred: false,
      },
    });
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
      isPreferred,
    },
  });
}

/* =========================
   USER CHARACTERS
   ========================= */

export async function getUserCharacters(
  userId: number,
) {
  return prisma.character.findMany({
    where: {
      userId,
    },
    include: {
      definition: true,
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

/* =========================
   UPDATE CHARACTER
   ========================= */

export async function updateCharacter(
  id: number,
  userId: number,
  data: {
    definitionKey?: string;
    level?: number;
    constellation?: number;
    friendship?: number;
    ascension?: number;
    normalAttackLevel?: number;
    elementalSkillLevel?: number;
    elementalBurstLevel?: number;
    isPreferred?: boolean;
  },
) {
  const character =
    await prisma.character.findFirst({
      where: {
        id,
        userId,
      },
    });

  if (!character) {
    return null;
  }

  /*
   * Si cambia la definición, verificamos que exista.
   */
  if (data.definitionKey !== undefined) {
    const definition =
      await prisma.characterDefinition.findUnique({
        where: {
          key: data.definitionKey,
        },
      });

    if (!definition) {
      throw new ReferenceValidationError([
        "definitionKey no corresponde a un personaje existente",
      ]);
    }
  }

  const newDefinitionKey =
    data.definitionKey ?? character.definitionKey;

  const newIsPreferred =
    data.isPreferred ?? character.isPreferred;

  /*
   * Si termina siendo preferido, desmarcamos los demás
   * personajes del mismo usuario y definición.
   */
  if (newIsPreferred) {
    await prisma.character.updateMany({
      where: {
        userId,
        definitionKey: newDefinitionKey,
        id: {
          not: id,
        },
      },
      data: {
        isPreferred: false,
      },
    });
  }

  return prisma.character.update({
    where: {
      id,
    },
    data: {
      ...(data.definitionKey !== undefined && {
        definitionKey: data.definitionKey,
      }),

      ...(data.level !== undefined && {
        level: data.level,
      }),

      ...(data.constellation !== undefined && {
        constellation: data.constellation,
      }),

      ...(data.friendship !== undefined && {
        friendship: data.friendship,
      }),

      ...(data.ascension !== undefined && {
        ascension: data.ascension,
      }),

      ...(data.normalAttackLevel !== undefined && {
        normalAttackLevel:
          data.normalAttackLevel,
      }),

      ...(data.elementalSkillLevel !== undefined && {
        elementalSkillLevel:
          data.elementalSkillLevel,
      }),

      ...(data.elementalBurstLevel !== undefined && {
        elementalBurstLevel:
          data.elementalBurstLevel,
      }),

      ...(data.isPreferred !== undefined && {
        isPreferred: data.isPreferred,
      }),
    },
  });
}

/* =========================
   DELETE CHARACTER
   ========================= */

export async function deleteCharacter(
  id: number,
  userId: number,
  transferLoadoutsToCharacterId?: number,
) {
  const character =
    await prisma.character.findFirst({
      where: {
        id,
        userId,
      },
    });

  if (!character) {
    return null;
  }

  /*
   * Si se indicó un personaje destino,
   * validamos que pertenezca al mismo usuario
   * y que sea una instancia de la misma definición.
   */
  if (transferLoadoutsToCharacterId !== undefined) {
    if (transferLoadoutsToCharacterId === id) {
      throw new ReferenceValidationError([
        "No se pueden transferir los loadouts al mismo personaje",
      ]);
    }

    const targetCharacter =
      await prisma.character.findFirst({
        where: {
          id: transferLoadoutsToCharacterId,
          userId,
        },
      });

    if (!targetCharacter) {
      throw new ReferenceValidationError([
        "El personaje destino no existe o no pertenece al usuario",
      ]);
    }

    if (
      targetCharacter.definitionKey !==
      character.definitionKey
    ) {
      throw new ReferenceValidationError([
        "Los loadouts solo pueden transferirse a otra instancia del mismo personaje",
      ]);
    }
  }

  /*
   * Contamos los loadouts antes de realizar la operación
   * para poder informar cuántos fueron transferidos/eliminados.
   */
  const loadoutCount =
    await prisma.loadout.count({
      where: {
        characterId: id,
      },
    });

  /*
   * Todo se realiza dentro de una única transacción:
   *
   * - Con destino: transferimos los loadouts y eliminamos
   *   el personaje origen.
   *
   * - Sin destino: eliminamos directamente el personaje.
   *   La relación Loadout -> Character tiene onDelete: Cascade,
   *   por lo que sus loadouts también se eliminan.
   */
  const deletedCharacter =
    await prisma.$transaction(async (tx) => {
      if (transferLoadoutsToCharacterId !== undefined) {
        await tx.loadout.updateMany({
          where: {
            characterId: character.id,
          },
          data: {
            characterId: transferLoadoutsToCharacterId,
            isPreferred: false,
          },
        });
      }

      return tx.character.delete({
        where: {
          id,
        },
      });
    });

  return {
    character: deletedCharacter,
    loadoutsTransferred:
      transferLoadoutsToCharacterId !== undefined
        ? loadoutCount
        : 0,
    loadoutsDeleted:
      transferLoadoutsToCharacterId === undefined
        ? loadoutCount
        : 0,
  };
}