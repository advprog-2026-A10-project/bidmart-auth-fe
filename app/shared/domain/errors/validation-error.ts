import { AppError } from "~/shared/domain/errors/app-error";

export class ValidationError extends AppError {
  constructor(
    message: string,
    public readonly fieldErrors?: Record<string, string[]>,
    metadata?: Record<string, unknown>,
  ) {
    super(message, "VALIDATION_ERROR", 422, metadata);
    this.name = "ValidationError";
  }
}
