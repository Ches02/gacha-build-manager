export class ReferenceValidationError extends Error {
  details: string[];

  constructor(details: string[]) {
    super("Referencia inválida");
    this.name = "ReferenceValidationError";
    this.details = details;
  }
}