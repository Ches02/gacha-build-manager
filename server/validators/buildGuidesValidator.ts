import { validateText, validateId } from "./commonValidator.ts";

/* =========================
   VALIDATE CHARACTERS
   ========================= */

function validateCharacters(
  value: unknown,
): string[] {
  const errors: string[] = [];

  if (!Array.isArray(value)) {
    errors.push("characterIds debe ser un array");
    return errors;
  }

  value.forEach((characters, index) => {
    const idError = validateId(
      characters,
      `characters[${index}]`,
    );

    if (idError) {
      errors.push(idError);
    }
  });

  return errors;
}

/* =========================
   VALIDATE WEAPONS
   ========================= */

function validateWeapons(
  value: unknown,
): string[] {
  const errors: string[] = [];

  if (!Array.isArray(value)) {
    errors.push("weaponIds debe ser un array");
    return errors;
  }

  value.forEach((weapons, index) => {
    const idError = validateId(
      weapons,
      `weapons[${index}]`,
    );

    if (idError) {
      errors.push(idError);
    }
  });

  return errors;
}

/* =========================
   VALIDATE artifactSets
   ========================= */

   /* =========================
   VALIDATE mainStats
   ========================= */

   /* =========================
   VALIDATE statPriorities
   ========================= */

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
      ...validateCharacters(data.characters),
    );
  }

  if (data.weapons !== undefined) {
    errors.push(
      ...validateWeapons(data.weapons),
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
      ...validateCharacters(data.characters),
    );
  }

  if (data.weapons !== undefined) {
    errors.push(
      ...validateWeapons(data.weapons),
    );
  }

  return errors;
}

/*
  "name": "Diluc DPS Test",
  "description": "Build de prueba para Diluc",
  "characters": [ "diluc"],
  "weapons": [ "lapida_del_lobo","serpiente_marina"],
  "artifactSets": [
    {
      "artifactSetKey": "bruja_carmesi",
      "pieces": 2
    },
    {
      "artifactSetKey": "bruja_carmesi",
      "pieces": 4
    }
  ],
  "mainStats": [
    {
      "slotKey": "caliz",
      "statTypeKey": "atk-p"
    },
    {
      "slotKey": "reloj",
      "statTypeKey": "atk-p"
    },
    {
      "slotKey": "reloj",
      "statTypeKey": "maestria"
    },
    {
      "slotKey": "tiara",
      "statTypeKey": "c-dmg"
    },
    {
      "slotKey": "tiara",
      "statTypeKey": "c-rate"
    }
  ],
  "statPriorities": [
    {
      "statTypeKey": "c-dmg",
      "priority": 1,
      "targetValue": 300
    },
    {
      "statTypeKey": "c-rate",
      "priority": 2,
      "targetValue": 100
    },
    {
      "statTypeKey": "atk",
      "priority": 3,
      "targetValue": 3000
    }
  ]
}*/
