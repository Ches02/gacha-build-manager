import { validateText, validateIntegerRange, validatePositiveNumber } from "./commonValidator.ts";

/* =========================
   VALIDATE SUBSTATS
   ========================= */

function validateSubStats(
  value: unknown,
): string[] {
  const errors: string[] = [];

  if (!Array.isArray(value)) {
    errors.push("subStats debe ser un array");
    return errors;
  }

  if (value.length > 4) {
    errors.push("subStats no puede tener más de 4 substats");
  }

  value.forEach((subStat, index) => {
    if (
      typeof subStat !== "object" ||
      subStat === null ||
      Array.isArray(subStat)
    ) {
      errors.push(
        `subStats[${index}] debe ser un objeto`,
      );
      return;
    }

    const data = subStat as Record<string, unknown>;

    const statTypeKeyError = validateText(
      data.statTypeKey,
      `subStats[${index}].statTypeKey`,
      40,
    );

    if (statTypeKeyError) {
      errors.push(statTypeKeyError);
    }

    const valueError = validatePositiveNumber(
      data.value,
      `subStats[${index}].value`,
    );

    if (valueError) {
      errors.push(valueError);
    }
  });

  return errors;
}

/* =========================
   CREATE ARTIFACT
   ========================= */

export function validateArtifact(
  data: Record<string, unknown>,
): string[] {
  const errors: string[] = [];

  const setKeyError = validateText(
    data.setKey,
    "setKey",
    40,
  );

  if (setKeyError) {
    errors.push(setKeyError);
  }

  const slotKeyError = validateText(
    data.slotKey,
    "slotKey",
    40,
  );

  if (slotKeyError) {
    errors.push(slotKeyError);
  }

  const levelError = validateIntegerRange(
    data.level,
    "level",
    0,
    20,
  );

  if (levelError) {
    errors.push(levelError);
  }

  const mainStatTypeKeyError = validateText(
    data.mainStatTypeKey,
    "mainStatTypeKey",
    40,
  );

  if (mainStatTypeKeyError) {
    errors.push(mainStatTypeKeyError);
  }

  const mainStatValueError = validatePositiveNumber(
    data.mainStatValue,
    "mainStatValue",
  );

  if (mainStatValueError) {
    errors.push(mainStatValueError);
  }

  if (data.subStats !== undefined) {
    errors.push(
      ...validateSubStats(data.subStats),
    );
  }

  return errors;
}

/* =========================
   UPDATE ARTIFACT
   ========================= */

export function validateArtifactUpdate(
  data: Record<string, unknown>,
): string[] {
  const errors: string[] = [];

  if (data.setKey !== undefined) {
    const setKeyError = validateText(
      data.setKey,
      "setKey",
      40,
    );

    if (setKeyError) {
      errors.push(setKeyError);
    }
  }

  if (data.slotKey !== undefined) {
    const slotKeyError = validateText(
      data.slotKey,
      "slotKey",
      40,
    );

    if (slotKeyError) {
      errors.push(slotKeyError);
    }
  }

  if (data.level !== undefined) {
    const levelError = validateIntegerRange(
      data.level,
      "level",
      0,
      20,
    );

    if (levelError) {
      errors.push(levelError);
    }
  }

  if (data.mainStatTypeKey !== undefined) {
    const mainStatTypeKeyError = validateText(
      data.mainStatTypeKey,
      "mainStatTypeKey",
      40,
    );

    if (mainStatTypeKeyError) {
      errors.push(mainStatTypeKeyError);
    }
  }

  if (data.mainStatValue !== undefined) {
    const mainStatValueError = validatePositiveNumber(
      data.mainStatValue,
      "mainStatValue",
    );

    if (mainStatValueError) {
      errors.push(mainStatValueError);
    }
  }

  if (data.subStats !== undefined) {
    errors.push(
      ...validateSubStats(data.subStats),
    );
  }

  return errors;
}