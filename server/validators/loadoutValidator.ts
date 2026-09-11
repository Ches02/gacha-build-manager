import {
    validateId,
    validateIdArray,
    validateOptionalId,
    validateOptionalText,
    validateText,
} from "./commonValidator.ts";

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
        const weaponIdError =
            validateOptionalId(
                data.weaponId,
                "weaponId",
            );

        if (weaponIdError) {
            errors.push(weaponIdError);
        }
    }

    if (
        data.artifactLoadoutId !== undefined
    ) {
        const artifactLoadoutIdError =
            validateOptionalId(
                data.artifactLoadoutId,
                "artifactLoadoutId",
            );

        if (artifactLoadoutIdError) {
            errors.push(
                artifactLoadoutIdError,
            );
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
            new Set(data.buildGuideIds).size !== data.buildGuideIds.length
        ) {
            errors.push(
                "buildGuideIds no puede contener IDs repetidos",
            );
        }
    }

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
        const characterIdError =
            validateId(
                data.characterId,
                "characterId",
            );

        if (characterIdError) {
            errors.push(characterIdError);
        }
    }

    if (data.weaponId !== undefined) {
        const weaponIdError =
            validateOptionalId(
                data.weaponId,
                "weaponId",
            );

        if (weaponIdError) {
            errors.push(weaponIdError);
        }
    }

    if (
        data.artifactLoadoutId !== undefined
    ) {
        const artifactLoadoutIdError =
            validateOptionalId(
                data.artifactLoadoutId,
                "artifactLoadoutId",
            );

        if (artifactLoadoutIdError) {
            errors.push(
                artifactLoadoutIdError,
            );
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
            new Set(data.buildGuideIds).size !== data.buildGuideIds.length
        ) {
            errors.push(
                "buildGuideIds no puede contener IDs repetidos",
            );
        }
    }

    return errors;
}
