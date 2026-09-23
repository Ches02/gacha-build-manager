import { prisma } from "../../../src/lib/prisma.ts";
import { calculateCharacterAscensionMaterials } from "../calculator/ascencionMaterialCalculationService.ts";
import { calculateCharacterTalentMaterials } from "../calculator/talentMaterialCalculationService.ts";
import { calculateWeaponAscensionMaterials } from "../calculator/weaponMaterialCalculationService.ts";

type MaterialAmount = {
    materialKey: string;
    quantity: number;
    type: string;
};

type MaterialCategory = {
    materials: MaterialAmount[];
};

type CharacterCardMaterials = {
    ascension: MaterialCategory;
    talents: MaterialCategory;
    weapon: MaterialCategory;
};

const LANGUAGE = "es";

/*
 * Convierte un nivel a la ascensión correspondiente.
 *
 * Los niveles compartidos se interpretan como el final
 * del rango anterior:
 *
 * 20 -> 0
 * 40 -> 1
 * 50 -> 2
 * 60 -> 3
 * 70 -> 4
 * 80 -> 5
 * 90 -> 6
 *
 * Los niveles intermedios pertenecen a la ascensión
 * que permite alcanzarlos.
 */
function levelToAscension(level: number): number {
    if (level <= 20) return 0;
    if (level <= 40) return 1;
    if (level <= 50) return 2;
    if (level <= 60) return 3;
    if (level <= 70) return 4;
    if (level <= 80) return 5;

    return 6;
}

/*function addMaterials(
    target: Map<string, number>,
    materials: MaterialAmount[],
) {
    for (const material of materials) {
        if (material.quantity <= 0) continue;

        target.set(
            material.materialKey,
            (target.get(material.materialKey) ?? 0) +
                material.quantity,
        );
    }
}

function mapToMaterials(
    totals: Map<string, number>,
): MaterialAmount[] {
    return Array.from(totals.entries()).map(
        ([materialKey, quantity]) => ({
            materialKey,
            quantity,
        }),
    );
}*/

export async function getCharacterCards(
    userId: number,
    language: string = LANGUAGE,
) {
    const loadouts = await prisma.loadout.findMany({
        where: {
            userId,
            showInHome: true,
        },

        include: {
            character: {
                include: {
                    definition: {
                        include: {
                            materials: true,
                        },
                    },
                },
            },

            weapon: {
                include: {
                    definition: {
                        include: {
                            materials: true,
                        },
                    },
                },
            },

            artifactLoadout: {
                include: {
                    artifacts: {
                        include: {
                            artifact: {
                                include: {
                                    subStats: true,
                                },
                            },
                        },
                    },
                },
            },
        },

        orderBy: {
            id: "asc",
        },
    });

    const translations = await prisma.translation.findMany({
        where: {
            language,
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

    const cards = await Promise.all(
        loadouts.map(async (loadout) => {
            const character = loadout.character;
            const characterDefinition = character.definition;

            const materials: CharacterCardMaterials = {
                ascension: {
                    materials: [],
                },
                talents: {
                    materials: [],
                },
                weapon: {
                    materials: [],
                },
            };

            /*
             * ASCENSIÓN DEL PERSONAJE
             */
            if (
                loadout.targetAscension !== null &&
                loadout.targetAscension > character.ascension
            ) {
                const result =
                    await calculateCharacterAscensionMaterials(
                        characterDefinition.key,
                        character.ascension,
                        loadout.targetAscension,
                    );

                materials.ascension.materials =
                    result.materials;
            }

            /*
             * TALENTOS
             *
             * Solo enviamos los talentos cuyo objetivo
             * sea superior al nivel actual.
             */
            const talentSelections = {
                ...(loadout.targetNormalAttackLevel !== null &&
                    loadout.targetNormalAttackLevel >
                        character.normalAttackLevel && {
                        normalAttack: {
                            currentLevel:
                                character.normalAttackLevel,
                            targetLevel:
                                loadout.targetNormalAttackLevel,
                        },
                    }),

                ...(loadout.targetElementalSkillLevel !== null &&
                    loadout.targetElementalSkillLevel >
                        character.elementalSkillLevel && {
                        elementalSkill: {
                            currentLevel:
                                character.elementalSkillLevel,
                            targetLevel:
                                loadout.targetElementalSkillLevel,
                        },
                    }),

                ...(loadout.targetElementalBurstLevel !== null &&
                    loadout.targetElementalBurstLevel >
                        character.elementalBurstLevel && {
                        elementalBurst: {
                            currentLevel:
                                character.elementalBurstLevel,
                            targetLevel:
                                loadout.targetElementalBurstLevel,
                        },
                    }),
            };

            if (Object.keys(talentSelections).length > 0) {
                const result =
                    await calculateCharacterTalentMaterials(
                        characterDefinition.key,
                        talentSelections,
                    );

                materials.talents.materials =
                    result.materials;
            }

            /*
             * ASCENSIÓN DEL ARMA
             *
             * La ascensión se infiere del nivel actual
             * y del nivel objetivo.
             */
            if (
                loadout.weapon &&
                loadout.targetWeaponLevel !== null &&
                loadout.targetWeaponLevel >
                    loadout.weapon.level
            ) {
                const currentWeaponAscension =
                    levelToAscension(loadout.weapon.level);

                const targetWeaponAscension =
                    levelToAscension(
                        loadout.targetWeaponLevel,
                    );

                if (
                    targetWeaponAscension >
                    currentWeaponAscension
                ) {
                    const result =
                        await calculateWeaponAscensionMaterials(
                            loadout.weapon.definition.key,
                            currentWeaponAscension,
                            targetWeaponAscension,
                        );

                    materials.weapon.materials =
                        result.materials;
                }
            }

            /*
             * DATOS DE MATERIALES TRADUCIDOS
             */
            const allMaterialKeys = new Set([
                ...materials.ascension.materials.map(
                    (material) => material.materialKey,
                ),
                ...materials.talents.materials.map(
                    (material) => material.materialKey,
                ),
                ...materials.weapon.materials.map(
                    (material) => material.materialKey,
                ),
            ]);

            const materialTranslations =
                await prisma.translation.findMany({
                    where: {
                        entityType: "material",
                        language,
                        key: {
                            in: Array.from(allMaterialKeys),
                        },
                        field: "name",
                    },
                });

            const materialNames = new Map(
                materialTranslations.map((translation) => [
                    translation.key,
                    translation.text,
                ]),
            );

            const translateMaterials = (
                category: MaterialCategory,
            ) => ({
                materials: category.materials.map(
                    (material) => ({
                        ...material,
                        name:
                            materialNames.get(
                                material.materialKey,
                            ) ?? material.materialKey,
                    }),
                ),
            });

            /*
             * DATOS DE LA CARD
             */
            return {
                id: loadout.id,
                name: loadout.name,
                description: loadout.description,

                character: {
                    id: character.id,
                    key: characterDefinition.key,

                    name:
                        getTranslation(
                            "character",
                            characterDefinition.key,
                            "name",
                        ) ?? characterDefinition.key,

                    element: characterDefinition.element,
                    rarity: characterDefinition.rarity,
                    nation: characterDefinition.nation,

                    weaponType: {
                        key: characterDefinition.weaponTypeKey,
                        name:
                            getTranslation(
                                "weapontype",
                                characterDefinition.weaponTypeKey,
                                "name",
                            ) ??
                            characterDefinition.weaponTypeKey,
                    },

                    level: character.level,
                    ascension: character.ascension,

                    talents: {
                        normalAttack:
                            character.normalAttackLevel,
                        elementalSkill:
                            character.elementalSkillLevel,
                        elementalBurst:
                            character.elementalBurstLevel,
                    },
                },

                targets: {
                    level: loadout.targetLevel,
                    ascension: loadout.targetAscension,

                    normalAttackLevel:
                        loadout.targetNormalAttackLevel,

                    elementalSkillLevel:
                        loadout.targetElementalSkillLevel,

                    elementalBurstLevel:
                        loadout.targetElementalBurstLevel,

                    weaponLevel:
                        loadout.targetWeaponLevel,
                },

                weapon: loadout.weapon
                    ? {
                        id: loadout.weapon.id,
                        key: loadout.weapon.definition.key,

                        name:
                            getTranslation(
                                "weapon",
                                loadout.weapon.definition.key,
                                "name",
                            ) ??
                            loadout.weapon.definition.key,

                        level: loadout.weapon.level,
                        refinement:
                            loadout.weapon.refinement,
                    }
                    : null,

                artifactLoadout:
                    loadout.artifactLoadout
                        ? {
                            id: loadout.artifactLoadout.id,
                            name:
                                loadout.artifactLoadout.name,
                            description:
                                loadout.artifactLoadout
                                    .description,

                            artifacts:
                                loadout.artifactLoadout.artifacts
                                    .map((item) => ({
                                        id: item.artifact.id,

                                        set: {
                                            key: item.artifact.setKey,
                                            name:
                                                getTranslation(
                                                    "artefacto",
                                                    item.artifact.setKey,
                                                    "name",
                                                ) ??
                                                item.artifact.setKey,
                                        },

                                        slot: {
                                            key: item.artifact.slotKey,
                                            name:
                                                getTranslation(
                                                    "artifactSlot",
                                                    item.artifact.slotKey,
                                                    "name",
                                                ) ??
                                                item.artifact.slotKey,
                                        },

                                        level: item.artifact.level,
                                    })),
                        }
                        : null,

                materials: {
                    ascension: translateMaterials(
                        materials.ascension,
                    ),

                    talents: translateMaterials(
                        materials.talents,
                    ),

                    weapon: translateMaterials(
                        materials.weapon,
                    ),
                },
            };
        }),
    );

    /*
     * TOTAL GENERAL
     *
     * Se devuelve una lista consolidada para que
     * el frontend pueda usarla como referencia.
     *
     * La selección dinámica de categorías se hará
     * en el frontend, sin volver a consultar la API.
     */
   /* const totalMaterials = new Map<string, number>();

    for (const card of cards) {
        addMaterials(
            totalMaterials,
            card.materials.ascension.materials,
        );

        addMaterials(
            totalMaterials,
            card.materials.talents.materials,
        );

        addMaterials(
            totalMaterials,
            card.materials.weapon.materials,
        );
    }

    const totalKeys = Array.from(
        totalMaterials.keys(),
    );

    const totalTranslations =
        await prisma.translation.findMany({
            where: {
                entityType: "material",
                language,
                field: "name",
                key: {
                    in: totalKeys,
                },
            },
        });

    const totalNames = new Map(
        totalTranslations.map((translation) => [
            translation.key,
            translation.text,
        ]),
    );*/

    return {
        cards/*,

        totalMaterials: mapToMaterials(
            totalMaterials,
        ).map((material) => ({
            ...material,
            name:
                totalNames.get(material.materialKey) ??
                material.materialKey,
        })),*/
    };
}