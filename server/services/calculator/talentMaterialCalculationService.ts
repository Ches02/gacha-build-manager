import { prisma } from "../../../src/lib/prisma.ts";

type TalentLevels = {
  currentLevel: number;
  targetLevel: number;
};

type TalentMaterialAmount = {
  materialKey: string;
  quantity: number;
  type: string;
};

type TalentCalculation = {
  talent: "normalAttack" | "elementalSkill" | "elementalBurst";
  currentLevel: number;
  targetLevel: number;
};

type CharacterTalentCalculation = {
  characterKey: string;
  talents: TalentCalculation[];
  materials: TalentMaterialAmount[];
};

type TalentSelections = {
  normalAttack?: TalentLevels;
  elementalSkill?: TalentLevels;
  elementalBurst?: TalentLevels;
};

function validateTalentLevels(
  talentName: string,
  levels: TalentLevels,
) {
  if (
    !Number.isInteger(levels.currentLevel) ||
    levels.currentLevel < 1 ||
    levels.currentLevel > 10
  ) {
    throw new Error(
      `El nivel actual de ${talentName} debe estar entre 1 y 10`,
    );
  }

  if (
    !Number.isInteger(levels.targetLevel) ||
    levels.targetLevel < 1 ||
    levels.targetLevel > 10
  ) {
    throw new Error(
      `El nivel objetivo de ${talentName} debe estar entre 1 y 10`,
    );
  }

  if (levels.targetLevel <= levels.currentLevel) {
    throw new Error(
      `El nivel objetivo de ${talentName} no puede ser menor que el actual`,
    );
  }
}

function getQualityVariant(
  materialKey: string,
  quality: number,
) {
  const materialFamily = materialKey.replace(/\d+$/, "");

  return `${materialFamily}${quality}`;
}

export async function calculateCharacterTalentMaterials(
  characterKey: string,
  selections: TalentSelections,
): Promise<CharacterTalentCalculation> {
  const selectedTalents = Object.entries(selections).filter(
    ([, levels]) => levels !== undefined,
  ) as [keyof TalentSelections, TalentLevels][];

  if (selectedTalents.length === 0) {
    throw new Error("Debés seleccionar al menos un talento");
  }

  const talentNames: Record<keyof TalentSelections, string> = {
    normalAttack: "Ataque Normal",
    elementalSkill: "Habilidad Elemental",
    elementalBurst: "Habilidad Definitiva",
  };

  for (const [talentKey, levels] of selectedTalents) {
    validateTalentLevels(talentNames[talentKey], levels);
  }

  const character = await prisma.characterDefinition.findUnique({
    where: {
      key: characterKey,
    },
    include: {
      materials: true,
    },
  });

  if (!character) {
    throw new Error("No se encontró el personaje");
  }

  if (!character.materials) {
    throw new Error(
      "No hay materiales configurados para este personaje",
    );
  }

  const maxCurrentLevel = Math.min(
    ...selectedTalents.map(([, levels]) => levels.currentLevel),
  );

  const maxTargetLevel = Math.max(
    ...selectedTalents.map(([, levels]) => levels.targetLevel),
  );

  const requirements = await prisma.talentRequirement.findMany({
    where: {
      talentLevel: {
        gt: maxCurrentLevel,
        lte: maxTargetLevel,
      },
    },
    orderBy: {
      talentLevel: "asc",
    },
  });

  const requirementByLevel = new Map(
    requirements.map((requirement) => [
      requirement.talentLevel,
      requirement,
    ]),
  );

  const materialTotals = new Map<string, number>();

  function addMaterial(materialKey: string, quantity: number) {
    if (quantity <= 0) return;

    const currentQuantity = materialTotals.get(materialKey) ?? 0;

    materialTotals.set(
      materialKey,
      currentQuantity + quantity,
    );
  }

  const talentResults: TalentCalculation[] = [];

  for (const [talentKey, levels] of selectedTalents) {
    talentResults.push({
      talent: talentKey as TalentCalculation["talent"],
      currentLevel: levels.currentLevel,
      targetLevel: levels.targetLevel,
    });

    for (
      let level = levels.currentLevel + 1;
      level <= levels.targetLevel;
      level++
    ) {
      const requirement = requirementByLevel.get(level);

      if (!requirement) {
        throw new Error(
          `No se encontró el requisito para subir el talento al nivel ${level}`,
        );
      }

      const domainKey = getQualityVariant(
        character.materials.talentMaterialKey,
        requirement.domainQuality,
      );

      const commonKey = getQualityVariant(
        character.materials.commonMaterialKey,
        requirement.matQuality,
      );

      addMaterial(
        domainKey,
        requirement.domainQuantity,
      );

      addMaterial(
        commonKey,
        requirement.matQuantity,
      );

      addMaterial(
        character.materials.weeklyBossMaterialKey,
        requirement.weeklyBossQuantity,
      );
    }
  }

  async function addMaterialTypes(
    materials: {
      materialKey: string;
      quantity: number;
    }[],
  ) {
    const materialDefinitions =
      await prisma.materialDefinition.findMany({
        where: {
          key: {
            in: materials.map(
              (material) => material.materialKey,
            ),
          },
        },
        select: {
          key: true,
          type: true,
        },
      });

    const typesByKey = new Map(
      materialDefinitions.map((material) => [
        material.key,
        material.type,
      ]),
    );

    return materials.map((material) => {
      const type = typesByKey.get(material.materialKey);

      if (!type) {
        throw new Error(
          `No se encontró el tipo del material: ${material.materialKey}`,
        );
      }

      return {
        ...material,
        type,
      };
    });
  }

  return {
    characterKey,
    talents: talentResults,
    materials: await addMaterialTypes(
      Array.from(materialTotals.entries()).map(
        ([materialKey, quantity]) => ({
          materialKey,
          quantity,
        }),
      ),
    ),
  };
}