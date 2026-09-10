import {
  validateText,
  validateIntegerRange,
} from "./commonValidator.ts";

/* =========================
   CREATE WEAPON
   ========================= */

export function validateWeapon(
  data: Record<string, unknown>,
): string[] {
  const errors: string[] = [];

  const definitionKeyError = validateText(
    data.definitionKey,
    "definitionKey",
    40,
  );

  if (definitionKeyError) {
    errors.push(definitionKeyError);
  }

  const levelError = validateIntegerRange(
    data.level,
    "level",
    0,
    90,
  );

  if (levelError) {
    errors.push(levelError);
  }

  const refinementError = validateIntegerRange(
    data.refinement,
    "refinement",
    1,
    5,
  );

  if (refinementError) {
    errors.push(refinementError);
  }

  return errors;
}

/* =========================
   UPDATE WEAPON
   ========================= */

export function validateWeaponUpdate(
  data: Record<string, unknown>,
): string[] {
  const errors: string[] = [];

  if (data.definitionKey !== undefined) {
    const definitionKeyError = validateText(
      data.definitionKey,
      "definitionKey",
      40,
    );

    if (definitionKeyError) {
      errors.push(definitionKeyError);
    }
  }

  if (data.level !== undefined) {
    const levelError = validateIntegerRange(
      data.level,
      "level",
      0,
      90,
    );

    if (levelError) {
      errors.push(levelError);
    }
  }

  if (data.refinement !== undefined) {
    const refinementError = validateIntegerRange(
      data.refinement,
      "refinement",
      1,
      5,
    );

    if (refinementError) {
      errors.push(refinementError);
    }
  }

  return errors;
}