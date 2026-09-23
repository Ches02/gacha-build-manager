import { prisma } from "../../../src/lib/prisma.ts";

type MaterialAmount = {
  materialKey: string;
  quantity: number;
  type: string;
};

type WeaponAscensionCalculation = {
  weaponKey: string;
  currentAscension: number;
  targetAscension: number;
  materials: MaterialAmount[];
};

export async function calculateWeaponAscensionMaterials(
  weaponKey: string,
  currentAscension: number,
  targetAscension: number,
): Promise<WeaponAscensionCalculation> {
  if (
    !Number.isInteger(currentAscension) ||
    currentAscension < 0 ||
    currentAscension > 6
  ) {
    throw new Error("La ascensión actual debe estar entre 0 y 6");
  }

  if (
    !Number.isInteger(targetAscension) ||
    targetAscension < 0 ||
    targetAscension > 6
  ) {
    throw new Error("La ascensión objetivo debe estar entre 0 y 6");
  }

  if (targetAscension < currentAscension) {
    throw new Error(
      "La ascensión objetivo no puede ser menor que la actual",
    );
  }

  const weapon = await prisma.weaponDefinition.findUnique({
    where: {
      key: weaponKey,
    },
    include: {
      materials: true,
    },
  });

  if (!weapon) {
    throw new Error("No se encontró el arma");
  }

  if (!weapon.materials) {
    throw new Error(
      "No hay materiales de ascensión configurados para esta arma",
    );
  }

  const requirements = await prisma.weaponLevelRequirement.findMany({
    where: {
      weaponRarity: weapon.rarity,
      ascension: {
        gt: currentAscension,
        lte: targetAscension,
      },
    },
    orderBy: {
      ascension: "asc",
    },
  });

  const materialTotals = new Map<string, number>();

  function addMaterial(materialKey: string, quantity: number) {
    if (quantity <= 0) return;

    const currentQuantity = materialTotals.get(materialKey) ?? 0;

    materialTotals.set(
      materialKey,
      currentQuantity + quantity,
    );
  }

  function getQualityVariant(
    materialKey: string,
    quality: number,
  ) {
    const materialFamily = materialKey.replace(/\d+$/, "");

    return `${materialFamily}${quality}`;
  }

  for (const requirement of requirements) {
    const domainKey = getQualityVariant(
      weapon.materials.domainMaterialKey,
      requirement.domainQuality,
    );

    const common1Key = getQualityVariant(
      weapon.materials.commonMaterial1Key,
      requirement.mat1Quality,
    );

    const common2Key = getQualityVariant(
      weapon.materials.commonMaterial2Key,
      requirement.mat2Quality,
    );

    addMaterial(domainKey, requirement.domainQuantity);
    addMaterial(common1Key, requirement.mat1Quantity);
    addMaterial(common2Key, requirement.mat2Quantity);
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
    weaponKey,
    currentAscension,
    targetAscension,
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