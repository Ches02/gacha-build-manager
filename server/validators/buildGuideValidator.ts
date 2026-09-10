import { validateText, validateIntegerRange, validateStringArray } from "./commonValidator.ts";


/* =========================
   VALIDATE ARTIFACT SETS
   ========================= */

function validateArtifactSets(
  value: unknown,
): string[] {
  const errors: string[] = [];

  if (!Array.isArray(value)) {
    errors.push("artifactSets debe ser un array");
    return errors;
  }

  value.forEach((item, index) => {
    if (
      typeof item !== "object" ||
      item === null ||
      Array.isArray(item)
    ) {
      errors.push(
        `artifactSets[${index}] debe ser un objeto`,
      );
      return;
    }

    const artifactSet = item as Record<string, unknown>;

    const keyError = validateText(
      artifactSet.artifactSetKey,
      `artifactSets[${index}].artifactSetKey`,
      40,
    );

    if (keyError) {
      errors.push(keyError);
    }

    const piecesError = validateIntegerRange(
      artifactSet.pieces,
      `artifactSets[${index}].pieces`,
      2,
      4,
    );

    if (piecesError) {
      errors.push(piecesError);
    } else if (
      artifactSet.pieces !== 2 &&
      artifactSet.pieces !== 4
    ) {
      errors.push(
        `artifactSets[${index}].pieces debe ser 2 o 4`,
      );
    }
  });

  return errors;
}

/* =========================
   VALIDATE MAIN STATS
   ========================= */

function validateMainStats(
  value: unknown,
): string[] {
  const errors: string[] = [];

  if (!Array.isArray(value)) {
    errors.push("mainStats debe ser un array");
    return errors;
  }

  value.forEach((item, index) => {
    if (
      typeof item !== "object" ||
      item === null ||
      Array.isArray(item)
    ) {
      errors.push(
        `mainStats[${index}] debe ser un objeto`,
      );
      return;
    }

    const mainStat = item as Record<string, unknown>;

    const slotError = validateText(
      mainStat.slotKey,
      `mainStats[${index}].slotKey`,
      40,
    );

    if (slotError) {
      errors.push(slotError);
    }

    const statTypeError = validateText(
      mainStat.statTypeKey,
      `mainStats[${index}].statTypeKey`,
      40,
    );

    if (statTypeError) {
      errors.push(statTypeError);
    }
  });

  return errors;
}

/* =========================
   VALIDATE STAT PRIORITIES
   ========================= */

function validateStatPriorities(
  value: unknown,
): string[] {
  const errors: string[] = [];

  if (!Array.isArray(value)) {
    errors.push("statPriorities debe ser un array");
    return errors;
  }

  value.forEach((item, index) => {
    if (
      typeof item !== "object" ||
      item === null ||
      Array.isArray(item)
    ) {
      errors.push(
        `statPriorities[${index}] debe ser un objeto`,
      );
      return;
    }

    const statPriority =
      item as Record<string, unknown>;

    const statTypeError = validateText(
      statPriority.statTypeKey,
      `statPriorities[${index}].statTypeKey`,
      40,
    );

    if (statTypeError) {
      errors.push(statTypeError);
    }

    const priorityError = validateIntegerRange(
      statPriority.priority,
      `statPriorities[${index}].priority`,
      1,
      20,
    );

    if (priorityError) {
      errors.push(priorityError);
    }

    if (
      statPriority.targetValue !== undefined
    ) {
      if (
        typeof statPriority.targetValue !== "number" ||
        !Number.isFinite(
          statPriority.targetValue,
        )
      ) {
        errors.push(
          `statPriorities[${index}].targetValue debe ser un número`,
        );
      }
    }
  });

  return errors;
}

/* =========================
   CREATE BUILD GUIDE
   ========================= */

export function validateBuildGuide(
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

  if (data.description !== undefined) {
    const descriptionError = validateText(
      data.description,
      "description",
      500,
    );

    if (descriptionError) {
      errors.push(descriptionError);
    }
  }

  if (data.characters !== undefined) {
    errors.push(
      ...validateStringArray(
        data.characters,
        "characters",
        40,
      ),
    );
  }

  if (data.weapons !== undefined) {
    errors.push(
      ...validateStringArray(
        data.weapons,
        "weapons",
        40,
      ),
    );
  }

  if (data.artifactSets !== undefined) {
    errors.push(
      ...validateArtifactSets(
        data.artifactSets,
      ),
    );
  }

  if (data.mainStats !== undefined) {
    errors.push(
      ...validateMainStats(
        data.mainStats,
      ),
    );
  }

  if (data.statPriorities !== undefined) {
    errors.push(
      ...validateStatPriorities(
        data.statPriorities,
      ),
    );
  }

  return errors;
}

/* =========================
   UPDATE BUILD GUIDE
   ========================= */

export function validateBuildGuideUpdate(
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

  if (data.description !== undefined) {
    const descriptionError = validateText(
      data.description,
      "description",
      500,
    );

    if (descriptionError) {
      errors.push(descriptionError);
    }
  }

  if (data.characters !== undefined) {
    errors.push(
      ...validateStringArray(
        data.characters,
        "characters",
        40,
      ),
    );
  }

  if (data.weapons !== undefined) {
    errors.push(
      ...validateStringArray(
        data.weapons,
        "weapons",
        40,
      ),
    );
  }

  if (data.artifactSets !== undefined) {
    errors.push(
      ...validateArtifactSets(
        data.artifactSets,
      ),
    );
  }

  if (data.mainStats !== undefined) {
    errors.push(
      ...validateMainStats(
        data.mainStats,
      ),
    );
  }

  if (data.statPriorities !== undefined) {
    errors.push(
      ...validateStatPriorities(
        data.statPriorities,
      ),
    );
  }

  return errors;
}