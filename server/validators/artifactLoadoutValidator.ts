import { validateText, validateIdArray } from "./commonValidator.ts";

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
      ...validateIdArray(
        data.artifactIds,
        "artifactIds",
      ),
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
      ...validateIdArray(
        data.artifactIds,
        "artifactIds",
      ),
    );
  }

  return errors;
}