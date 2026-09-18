import { prisma } from "../../../src/lib/prisma.ts";

type MaterialAmount = {
    materialKey: string;
    quantity: number;
};

type CharacterAscensionCalculation = {
    characterKey: string;
    currentAscension: number;
    targetAscension: number;
    materials: MaterialAmount[];
};

export async function calculateCharacterAscensionMaterials(
    characterKey: string,
    currentAscension: number,
    targetAscension: number,
): Promise<CharacterAscensionCalculation> {
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

    if (targetAscension <= currentAscension) {
        throw new Error(
            "La ascensión objetivo no puede ser menor que la actual",
        );
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
            "No hay materiales de ascensión configurados para este personaje",
        );
    }

    const requirements = await prisma.ascensionRequirement.findMany({
        where: {
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
        materialTotals.set(materialKey, currentQuantity + quantity);
    }

    function getQualityVariant(materialKey: string, quality: number) {
        // Las claves de materiales terminan en el número de calidad:
        // insignia-fatui1, insignia-fatui2, insignia-fatui3.
        const materialFamily = materialKey.replace(/\d+$/, "");

        return `${materialFamily}${quality}`;
    }

    for (const requirement of requirements) {
        // Gema elemental: la calidad determina la variante de la gema.
        const gemKey = `${character.element.toLowerCase()}${requirement.gemQuality}`;

        addMaterial(gemKey, requirement.gemQuantity);

        // Material de jefe.
        const bossKey = character.materials.bossMaterialKey;

        addMaterial(
            bossKey,
            requirement.bossQuantity,
        );

        // Especialidad regional.
        const specialtyKey = character.materials.regionalSpecialtyKey;

        addMaterial(
            specialtyKey,
            requirement.specialtyQuantity,
        );

        // Material común de enemigos, usando la calidad requerida.
        const commonKey = getQualityVariant(
            character.materials.commonMaterialKey,
            requirement.matQuality,
        );

        addMaterial(
            commonKey,
            requirement.matQuantity,
        );
    }

    return {
        characterKey,
        currentAscension,
        targetAscension,
        materials: Array.from(materialTotals.entries()).map(
            ([materialKey, quantity]) => ({
                materialKey,
                quantity,
            }),
        ),
    };
}