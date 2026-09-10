import { validateText, validateIntegerRange } from "./commonValidator.ts";

/* =========================
   CHARACTER VALIDATOR
   ========================= */

export function validateCharacter(data: Record<string, unknown>): string[] {
  const errors: string[] = [];

  /* =========================
     DEFINITION KEY
     ========================= */

  if (data.definitionKey === undefined) {
    errors.push("definitionKey es obligatorio");
  } else {
    const error = validateText(
      data.definitionKey,
      "definitionKey",
      40,
    );

    if (error) {
      errors.push(error);
    }
  }

  /* =========================
     LEVEL
     ========================= */

  if (data.level === undefined) {
    errors.push("level es obligatorio");
  } else {
    const error = validateIntegerRange(
      data.level,
      "level",
      0,
      90,
    );

    if (error) {
      errors.push(error);
    }
  }

  /* =========================
     CONSTELLATION
     ========================= */

  if (data.constellation === undefined) {
    errors.push("constellation es obligatorio");
  } else {
    const error = validateIntegerRange(
      data.constellation,
      "constellation",
      0,
      6,
    );

    if (error) {
      errors.push(error);
    }
  }

  /* =========================
     FRIENDSHIP
     ========================= */

  if (data.friendship === undefined) {
    errors.push("friendship es obligatorio");
  } else {
    const error = validateIntegerRange(
      data.friendship,
      "friendship",
      0,
      10,
    );

    if (error) {
      errors.push(error);
    }
  }

  /* =========================
     ASCENSION
     ========================= */

  if (data.ascension === undefined) {
    errors.push("ascension es obligatorio");
  } else {
    const error = validateIntegerRange(
      data.ascension,
      "ascension",
      0,
      6,
    );

    if (error) {
      errors.push(error);
    }
  }

  /* =========================
     NORMAL ATTACK
     ========================= */

  if (data.normalAttackLevel === undefined) {
    errors.push("normalAttackLevel es obligatorio");
  } else {
    const error = validateIntegerRange(
      data.normalAttackLevel,
      "normalAttackLevel",
      0,
      10,
    );

    if (error) {
      errors.push(error);
    }
  }

  /* =========================
     ELEMENTAL SKILL
     ========================= */

  if (data.elementalSkillLevel === undefined) {
    errors.push("elementalSkillLevel es obligatorio");
  } else {
    const error = validateIntegerRange(
      data.elementalSkillLevel,
      "elementalSkillLevel",
      0,
      10,
    );

    if (error) {
      errors.push(error);
    }
  }

  /* =========================
     ELEMENTAL BURST
     ========================= */

  if (data.elementalBurstLevel === undefined) {
    errors.push("elementalBurstLevel es obligatorio");
  } else {
    const error = validateIntegerRange(
      data.elementalBurstLevel,
      "elementalBurstLevel",
      0,
      10,
    );

    if (error) {
      errors.push(error);
    }
  }

  return errors;
}

/* =========================
   CHARACTER UPDATE VALIDATOR
   ========================= */

/*
 * Valida los campos enviados durante un PUT.
 *
 * A diferencia de validateCharacter(), acá los campos
 * son opcionales porque un PUT puede actualizar solamente
 * una parte del Character.
 *
 * Si un campo no viene en el body, no lo validamos.
 * Si viene, debe cumplir exactamente las mismas reglas
 * que usamos al crear un Character.
 */

export function validateCharacterUpdate(
  data: Record<string, unknown>,
): string[] {
  const errors: string[] = [];

  /* =========================
     DEFINITION KEY
     ========================= */

  if (data.definitionKey !== undefined) {
    const error = validateText(
      data.definitionKey,
      "definitionKey",
      40,
    );

    if (error) {
      errors.push(error);
    }
  }

  /* =========================
     LEVEL
     ========================= */

  if (data.level !== undefined) {
    const error = validateIntegerRange(
      data.level,
      "level",
      0,
      90,
    );

    if (error) {
      errors.push(error);
    }
  }

  /* =========================
     CONSTELLATION
     ========================= */

  if (data.constellation !== undefined) {
    const error = validateIntegerRange(
      data.constellation,
      "constellation",
      0,
      6,
    );

    if (error) {
      errors.push(error);
    }
  }

  /* =========================
     FRIENDSHIP
     ========================= */

  if (data.friendship !== undefined) {
    const error = validateIntegerRange(
      data.friendship,
      "friendship",
      0,
      10,
    );

    if (error) {
      errors.push(error);
    }
  }

  /* =========================
     ASCENSION
     ========================= */

  if (data.ascension !== undefined) {
    const error = validateIntegerRange(
      data.ascension,
      "ascension",
      0,
      6,
    );

    if (error) {
      errors.push(error);
    }
  }

  /* =========================
     NORMAL ATTACK
     ========================= */

  if (data.normalAttackLevel !== undefined) {
    const error = validateIntegerRange(
      data.normalAttackLevel,
      "normalAttackLevel",
      0,
      10,
    );

    if (error) {
      errors.push(error);
    }
  }

  /* =========================
     ELEMENTAL SKILL
     ========================= */

  if (data.elementalSkillLevel !== undefined) {
    const error = validateIntegerRange(
      data.elementalSkillLevel,
      "elementalSkillLevel",
      0,
      10,
    );

    if (error) {
      errors.push(error);
    }
  }

  /* =========================
     ELEMENTAL BURST
     ========================= */

  if (data.elementalBurstLevel !== undefined) {
    const error = validateIntegerRange(
      data.elementalBurstLevel,
      "elementalBurstLevel",
      0,
      10,
    );

    if (error) {
      errors.push(error);
    }
  }

  return errors;
}