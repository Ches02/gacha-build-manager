import { validateText, validateId } from "./commonValidator.ts";

/* =========================
   VALIDATE ARTIFACT IDS
   ========================= */

function validateArtifactIds(
  value: unknown,
): string[] {
  const errors: string[] = [];

  if (!Array.isArray(value)) {
    errors.push("artifactIds debe ser un array");
    return errors;
  }

  value.forEach((artifactId, index) => {
    const idError = validateId(
      artifactId,
      `artifactIds[${index}]`,
    );

    if (idError) {
      errors.push(idError);
    }
  });

  return errors;
}

/* =========================
   CREATE ARTIFACT LOADOUT
   ========================= */

export function validateArtifactLoadout(
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

  if (data.artifactIds !== undefined) {
    errors.push(
      ...validateArtifactIds(data.artifactIds),
    );
  }

  return errors;
}

/* =========================
   UPDATE ARTIFACT LOADOUT
   ========================= */

export function validateArtifactLoadoutUpdate(
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

  if (data.artifactIds !== undefined) {
    errors.push(
      ...validateArtifactIds(data.artifactIds),
    );
  }

  return errors;
}