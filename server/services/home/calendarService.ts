import { prisma } from "../../../src/lib/prisma.ts";
import { getCharacterCards } from "./characterCardsService.ts";
import { MaterialSourceDays } from "../../../src/generated/prisma/client.js";

const LANGUAGE = "es";

type CalendarMaterial = {
    materialKey: string;
    name: string;
    type: string;
    rarity: number;
    quantity?: number;
};

function getCurrentDay(): string {
    return new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        timeZone: "America/Argentina/Buenos_Aires",
    }).format(new Date()).toUpperCase();
}

function getAvailableSourceDays(
    day: string,
): MaterialSourceDays | MaterialSourceDays[] {
    switch (day) {
        case "MONDAY":
        case "THURSDAY":
            return MaterialSourceDays.MONDAY_THURSDAY_SUNDAY;

        case "TUESDAY":
        case "FRIDAY":
            return MaterialSourceDays.TUESDAY_FRIDAY_SUNDAY;

        case "WEDNESDAY":
        case "SATURDAY":
            return MaterialSourceDays.WEDNESDAY_SATURDAY_SUNDAY;

        case "SUNDAY":
            return [
                MaterialSourceDays.MONDAY_THURSDAY_SUNDAY,
                MaterialSourceDays.TUESDAY_FRIDAY_SUNDAY,
                MaterialSourceDays.WEDNESDAY_SATURDAY_SUNDAY,
            ];

        default:
            throw new Error(
                `Día no válido: ${day}`,
            );
    }
}

function getRarity(materialKey: string): number {
    const match = materialKey.match(/(\d+)$/);

    if (!match) {
        throw new Error(
            `No se pudo determinar la rareza del material: ${materialKey}`,
        );
    }

    return Number(match[1]);
}

function getMaterialFamily(materialKey: string): string {
    return materialKey.replace(/\d+$/, "");
}

function sortMaterialsBySourceOrder(
  materials: CalendarMaterial[],
  sources: { id: number; materialKey: string; type: string }[],
): CalendarMaterial[] {
  const sourceOrder = new Map<string, number>();

  for (const source of sources) {
    sourceOrder.set(getMaterialFamily(source.materialKey), source.id);
  }

  return [...materials].sort((a, b) => {
    const familyA = getMaterialFamily(a.materialKey);
    const familyB = getMaterialFamily(b.materialKey);

    const orderA = sourceOrder.get(familyA) ?? Number.MAX_SAFE_INTEGER;
    const orderB = sourceOrder.get(familyB) ?? Number.MAX_SAFE_INTEGER;

    if (orderA !== orderB) {
      return orderA - orderB;
    }

    return getRarity(a.materialKey) - getRarity(b.materialKey);
  });
}

export async function getHomeCalendar(
    userId: number,
    language: string = LANGUAGE,
) {
    const day = getCurrentDay();

    /*
     * MATERIAL DE DOMINIO DISPONIBLE HOY
     *
     * La disponibilidad por día está definida en MaterialSource.
     *
     * MaterialDefinition:
     * - define el material
     * - key
     * - type
     *
     * MaterialSource:
     * - define dónde se consigue
     * - qué días está disponible
     * - qué material entrega
     */
    const availableSourceDays =
        getAvailableSourceDays(day);

const availableSources = await prisma.materialSource.findMany({
  where: {
    days: Array.isArray(availableSourceDays)
      ? { in: availableSourceDays }
      : availableSourceDays,
    type: {
      in: ["TALENT_MATERIAL", "WEAPON_MATERIAL"],
    },
  },
  select: {
    id: true,
    materialKey: true,
    type: true,
  },
  orderBy: {
    id: "asc",
  },
});

    /*
     * Un mismo material puede tener más de una fuente.
     *
     * Nos quedamos con una sola entrada por materialKey.
     */
    const availableMaterialsByKey =
        new Map<string, {
            materialKey: string;
            type: string;
        }>();

    for (const source of availableSources) {
        availableMaterialsByKey.set(
            source.materialKey,
            {
                materialKey: source.materialKey,
                type: source.type,
            },
        );
    }

    const availableMaterials =
        Array.from(
            availableMaterialsByKey.values(),
        );

    /*
     * Traducciones de los materiales disponibles.
     */
    const availableKeys = availableMaterials.map(
        (material) => material.materialKey,
    );

    const translations =
        await prisma.translation.findMany({
            where: {
                entityType: "material",
                language,
                field: "name",
                key: {
                    in: availableKeys,
                },
            },
        });

    const namesByKey = new Map(
        translations.map((translation) => [
            translation.key,
            translation.text,
        ]),
    );

    /*
     * CARDS DEL HOME
     *
     * getCharacterCards ya:
     * - filtra showInHome = true
     * - calcula talentos
     * - calcula armas
     * - calcula las cantidades según los objetivos
     */
    const { cards } = await getCharacterCards(
        userId,
        language,
    );

    /*
     * Sumamos los materiales requeridos por todos
     * los personajes que están actualmente en Home.
     */
    const talentTotals = new Map<string, number>();
    const weaponTotals = new Map<string, number>();

    for (const card of cards) {
        for (const material of card.materials.talents.materials) {
            const current =
                talentTotals.get(material.materialKey) ?? 0;

            talentTotals.set(
                material.materialKey,
                current + material.quantity,
            );
        }

        for (const material of card.materials.weapon.materials) {
            const current =
                weaponTotals.get(material.materialKey) ?? 0;

            weaponTotals.set(
                material.materialKey,
                current + material.quantity,
            );
        }
    }

/*
 * PRIMERA FILA
 *
 * Solo materiales que:
 * - están siendo requeridos por algún loadout del Home
 * - están disponibles hoy
 * - pertenecen al tipo correspondiente
 *
 * Se muestran todas las rarezas que realmente se necesitan.
 * El orden principal lo determina MaterialSource.id.
 * Dentro de una misma familia: rareza 1 → 2 → 3 → 4.
 */

const talentSourceFamilies = new Set(
    availableSources
        .filter((source) => source.type === "TALENT_MATERIAL")
        .map((source) => getMaterialFamily(source.materialKey)),
);

const weaponSourceFamilies = new Set(
    availableSources
        .filter((source) => source.type === "WEAPON_MATERIAL")
        .map((source) => getMaterialFamily(source.materialKey)),
);

const requiredTalents = sortMaterialsBySourceOrder(
    Array.from(talentTotals.entries())
        .filter(([materialKey]) =>
            talentSourceFamilies.has(getMaterialFamily(materialKey)),
        )
        .map(([materialKey, quantity]) => ({
            materialKey,
            name: namesByKey.get(materialKey) ?? materialKey,
            type: "TALENT_MATERIAL",
            rarity: getRarity(materialKey),
            quantity,
        })),
    availableSources,
);

const requiredWeapons = sortMaterialsBySourceOrder(
    Array.from(weaponTotals.entries())
        .filter(([materialKey]) =>
            weaponSourceFamilies.has(getMaterialFamily(materialKey)),
        )
        .map(([materialKey, quantity]) => ({
            materialKey,
            name: namesByKey.get(materialKey) ?? materialKey,
            type: "WEAPON_MATERIAL",
            rarity: getRarity(materialKey),
            quantity,
        })),
    availableSources,
);

    /*
 * SEGUNDA FILA
 *
 * Mostramos la variante de mayor rareza disponible
 * para cada familia de materiales.
 *
 * Talentos → rareza 3
 * Armas → rareza 4
 *
 * MaterialSource guarda únicamente la variante base (1).
 * Buscamos la variante visual correspondiente en
 * MaterialDefinition.
 */

    const availableTalentFamilies =
        availableMaterials
            .filter(
                (material) =>
                    material.type === "TALENT_MATERIAL",
            )
            .map((material) =>
                getMaterialFamily(material.materialKey),
            );

    const availableWeaponFamilies =
        availableMaterials
            .filter(
                (material) =>
                    material.type === "WEAPON_MATERIAL",
            )
            .map((material) =>
                getMaterialFamily(material.materialKey),
            );

    const rare3TalentKeys =
        availableTalentFamilies.map(
            (family) => `${family}3`,
        );

    const rare4WeaponKeys =
        availableWeaponFamilies.map(
            (family) => `${family}4`,
        );

    const rareVisualKeys = [
        ...rare3TalentKeys,
        ...rare4WeaponKeys,
    ];

    const rareVisualDefinitions =
        await prisma.materialDefinition.findMany({
            where: {
                key: {
                    in: rareVisualKeys,
                },
            },
            select: {
                key: true,
                type: true,
            },
        });

    const availableRare3Talents: CalendarMaterial[] =
    rareVisualDefinitions
        .filter(
            (material) =>
                material.type === "TALENT_MATERIAL" &&
                rare3TalentKeys.includes(material.key),
        )
        .map((material) => ({
            materialKey: material.key,
            name:
                namesByKey.get(material.key) ??
                material.key,
            type: material.type,
            rarity: 3,
        }))
        .sort((a, b) => {
            const familyA = getMaterialFamily(a.materialKey);
            const familyB = getMaterialFamily(b.materialKey);

            const sourceA = availableSources.find(
                (source) =>
                    source.type === "TALENT_MATERIAL" &&
                    getMaterialFamily(source.materialKey) === familyA,
            );

            const sourceB = availableSources.find(
                (source) =>
                    source.type === "TALENT_MATERIAL" &&
                    getMaterialFamily(source.materialKey) === familyB,
            );

            return (sourceA?.id ?? Number.MAX_SAFE_INTEGER) -
                (sourceB?.id ?? Number.MAX_SAFE_INTEGER);
        });

    const availableRare4Weapons: CalendarMaterial[] =
    rareVisualDefinitions
        .filter(
            (material) =>
                material.type === "WEAPON_MATERIAL" &&
                rare4WeaponKeys.includes(material.key),
        )
        .map((material) => ({
            materialKey: material.key,
            name:
                namesByKey.get(material.key) ??
                material.key,
            type: material.type,
            rarity: 4,
        }))
        .sort((a, b) => {
            const familyA = getMaterialFamily(a.materialKey);
            const familyB = getMaterialFamily(b.materialKey);

            const sourceA = availableSources.find(
                (source) =>
                    source.type === "WEAPON_MATERIAL" &&
                    getMaterialFamily(source.materialKey) === familyA,
            );

            const sourceB = availableSources.find(
                (source) =>
                    source.type === "WEAPON_MATERIAL" &&
                    getMaterialFamily(source.materialKey) === familyB,
            );

            return (sourceA?.id ?? Number.MAX_SAFE_INTEGER) -
                (sourceB?.id ?? Number.MAX_SAFE_INTEGER);
        });

    return {
        day,
        talents: {
            required: requiredTalents,
            availableRare3: availableRare3Talents,
        },
        weapons: {
            required: requiredWeapons,
            availableRare4: availableRare4Weapons,
        },
    };
}