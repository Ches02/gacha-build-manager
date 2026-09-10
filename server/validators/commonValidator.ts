/* =========================
   COMMON VALIDATORS
   ========================= */

/*
 * Valida textos permitiendo Unicode.
 *
 * Permitimos:
 * - Letras de cualquier idioma
 * - Números
 * - Espacios
 * - Puntuación y símbolos habituales
 *
 * Bloqueamos:
 * - < >
 * - comillas simples y dobles
 * - backticks
 * - caracteres de control
 *
 * La idea es evitar que los textos puedan convertirse
 * directamente en HTML o código.
 */

const FORBIDDEN_CHARACTERS = /[<>"'`]/u;

const CONTROL_CHARACTERS = /[\u0000-\u001F\u007F]/u;

/*=== maximos aprox definitos: name 40 | description 5000 ===*/
export function validateText(
  value: unknown,
  fieldName: string,
  maxLength: number,
): string | null {
  if (typeof value !== "string") {
    return `${fieldName} debe ser un texto`;
  }

  if (value.trim().length === 0) {
    return `${fieldName} no puede estar vacío`;
  }

  if (value.length > maxLength) {
    return `${fieldName} no puede superar los ${maxLength} caracteres`;
  }

  if (FORBIDDEN_CHARACTERS.test(value)) {
    return `${fieldName} contiene caracteres no permitidos`;
  }

  if (CONTROL_CHARACTERS.test(value)) {
    return `${fieldName} contiene caracteres no permitidos`;
  }

  return null;
}

/* =========================
   OPTIONAL TEXT VALIDATOR
   ========================= */

export function validateOptionalText(
  value: unknown,
  fieldName: string,
  maxLength: number,
): string | null {
  // undefined = campo no enviado
  if (value === undefined) {
    return null;
  }

  // null = campo enviado explícitamente como null
  if (value === null) {
    return null;
  }

  if (typeof value !== "string") {
    return `${fieldName} debe ser un texto`;
  }

  if (value.length > maxLength) {
    return `${fieldName} no puede superar los ${maxLength} caracteres`;
  }

  if (FORBIDDEN_CHARACTERS.test(value)) {
    return `${fieldName} contiene caracteres no permitidos`;
  }

  if (CONTROL_CHARACTERS.test(value)) {
    return `${fieldName} contiene caracteres no permitidos`;
  }

  return null;
}

/* =========================
   INTEGER
   ========================= */

export function validateInteger(
  value: unknown,
  fieldName: string,
): string | null {
  if (
    typeof value !== "number" ||
    !Number.isInteger(value)
  ) {
    return `${fieldName} debe ser un número entero`;
  }

  return null;
}

/* =========================
   INTEGER RANGE
   ========================= */

export function validateIntegerRange(
  value: unknown,
  fieldName: string,
  min: number,
  max: number,
): string | null {
  const integerError = validateInteger(
    value,
    fieldName,
  );

  if (integerError) {
    return integerError;
  }

  if (
    (value as number) < min ||
    (value as number) > max
  ) {
    return `${fieldName} debe estar entre ${min} y ${max}`;
  }

  return null;
}

/* =========================
   POSITIVE ID
   ========================= */

export function validateId(
  value: unknown,
  fieldName: string,
): string | null {
  const integerError = validateInteger(
    value,
    fieldName,
  );

  if (integerError) {
    return integerError;
  }

  if ((value as number) <= 0) {
    return `${fieldName} debe ser un número entero positivo`;
  }

  return null;
}

/* =========================
   OPTIONAL ID
   ========================= */

export function validateOptionalId(
  value: unknown,
  fieldName: string,
): string | null {
  if (value === null) {
    return null;
  }

  return validateId(
    value,
    fieldName,
  );
}

/* =========================
   POSITIVE NUMBER
   ========================= */

export function validatePositiveNumber(
  value: unknown,
  fieldName: string,
): string | null {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value)
  ) {
    return `${fieldName} debe ser un número`;
  }

  if (value < 0) {
    return `${fieldName} debe ser un número positivo`;
  }

  return null;
}

/* =========================
   STRING ARRAY
   ========================= */

export function validateStringArray(
  value: unknown,
  fieldName: string,
  maxLength: number,
): string[] {
  const errors: string[] = [];

  if (!Array.isArray(value)) {
    errors.push(
      `${fieldName} debe ser un array`,
    );
    return errors;
  }

  value.forEach((item, index) => {
    const error = validateText(
      item,
      `${fieldName}[${index}]`,
      maxLength,
    );

    if (error) {
      errors.push(error);
    }
  });

  return errors;
}

/* =========================
   ID ARRAY
   ========================= */

export function validateIdArray(
  value: unknown,
  fieldName: string,
): string[] {
  const errors: string[] = [];

  if (!Array.isArray(value)) {
    errors.push(
      `${fieldName} debe ser un array`,
    );
    return errors;
  }

  value.forEach((item, index) => {
    const error = validateId(
      item,
      `${fieldName}[${index}]`,
    );

    if (error) {
      errors.push(error);
    }
  });

  return errors;
}