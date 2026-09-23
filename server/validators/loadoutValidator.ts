import {
    validateId,
    validateIdArray,
    validateIntegerRange,
    validateOptionalId,
    validateOptionalText,
    validateText,
} from "./commonValidator.ts";

/* =========================
   OPTIONAL TARGETS
   ========================= */

function validateOptionalTarget(
    data: Record<string, unknown>,
    field: string,
    label: string,
    min: number,
    max: number,
    errors: string[],
): void {
    const value = data[field];

    // Si no se envía o es null, se permite.
    if (value === undefined || value === null) {
        return;
    }

    const error = validateIntegerRange(
        value,
        label,
        min,
        max,
    );

    if (error) {
        errors.push(error);
    }
}

function validateTargetFields(
    data: Record<string, unknown>,
    errors: string[],
): void {
    validateOptionalTarget(
        data,
        "targetLevel",
        "Nivel objetivo",
        1,
        90,
        errors,
    );

    validateOptionalTarget(
        data,
        "targetAscension",
        "Ascensión objetivo",
        0,
        6,
        errors,
    );

    validateOptionalTarget(
        data,
        "targetNormalAttackLevel",
        "Nivel objetivo de Ataque Normal",
        1,
        10,
        errors,
    );

    validateOptionalTarget(
        data,
        "targetElementalSkillLevel",
        "Nivel objetivo de Habilidad Elemental",
        1,
        10,
        errors,
    );

    validateOptionalTarget(
        data,
        "targetElementalBurstLevel",
        "Nivel objetivo de Habilidad Definitiva",
        1,
        10,
        errors,
    );

    validateOptionalTarget(
        data,
        "targetWeaponLevel",
        "Nivel objetivo del arma",
        1,
        90,
        errors,
    );
}

/* =========================
   CREATE LOADOUT
   ========================= */

export function validateLoadout(
    data: Record<string, unknown>,
): string[] {
    const errors: string[] = [];

    const nameError = validateText(
        data.name,
        "name",
        60,
    );

    if (nameError) {
        errors.push(nameError);
    }

    const descriptionError = validateOptionalText(
        data.description,
        "description",
        500,
    );

    if (descriptionError) {
        errors.push(descriptionError);
    }

    const characterIdError = validateId(
        data.characterId,
        "characterId",
    );

    if (characterIdError) {
        errors.push(characterIdError);
    }

    if (data.weaponId !== undefined) {
        const weaponIdError = validateOptionalId(
            data.weaponId,
            "weaponId",
        );

        if (weaponIdError) {
            errors.push(weaponIdError);
        }
    }

    if (data.artifactLoadoutId !== undefined) {
        const artifactLoadoutIdError =
            validateOptionalId(
                data.artifactLoadoutId,
                "artifactLoadoutId",
            );

        if (artifactLoadoutIdError) {
            errors.push(artifactLoadoutIdError);
        }
    }

    if (data.buildGuideIds !== undefined) {
        errors.push(
            ...validateIdArray(
                data.buildGuideIds,
                "buildGuideIds",
            ),
        );

        if (
            Array.isArray(data.buildGuideIds) &&
            new Set(data.buildGuideIds).size !==
            data.buildGuideIds.length
        ) {
            errors.push(
                "buildGuideIds no puede contener IDs repetidos",
            );
        }
    }

    if (
        data.showInHome !== undefined &&
        typeof data.showInHome !== "boolean"
    ) {
        errors.push("showInHome debe ser un booleano");
    }

    validateTargetFields(data, errors);

    return errors;
}

/* =========================
   UPDATE LOADOUT
   ========================= */

export function validateLoadoutUpdate(
    data: Record<string, unknown>,
): string[] {
    const errors: string[] = [];

    if (data.name !== undefined) {
        const nameError = validateText(
            data.name,
            "name",
            60,
        );

        if (nameError) {
            errors.push(nameError);
        }
    }

    const descriptionError = validateOptionalText(
        data.description,
        "description",
        500,
    );

    if (descriptionError) {
        errors.push(descriptionError);
    }

    if (data.characterId !== undefined) {
        const characterIdError = validateId(
            data.characterId,
            "characterId",
        );

        if (characterIdError) {
            errors.push(characterIdError);
        }
    }

    if (data.weaponId !== undefined) {
        const weaponIdError = validateOptionalId(
            data.weaponId,
            "weaponId",
        );

        if (weaponIdError) {
            errors.push(weaponIdError);
        }
    }

    if (data.artifactLoadoutId !== undefined) {
        const artifactLoadoutIdError =
            validateOptionalId(
                data.artifactLoadoutId,
                "artifactLoadoutId",
            );

        if (artifactLoadoutIdError) {
            errors.push(artifactLoadoutIdError);
        }
    }

    if (data.buildGuideIds !== undefined) {
        errors.push(
            ...validateIdArray(
                data.buildGuideIds,
                "buildGuideIds",
            ),
        );

        if (
            Array.isArray(data.buildGuideIds) &&
            new Set(data.buildGuideIds).size !==
            data.buildGuideIds.length
        ) {
            errors.push(
                "buildGuideIds no puede contener IDs repetidos",
            );
        }
    }

    if (
        data.showInHome !== undefined &&
        typeof data.showInHome !== "boolean"
    ) {
        errors.push("showInHome debe ser un booleano");
    }

    validateTargetFields(data, errors);

    return errors;
}