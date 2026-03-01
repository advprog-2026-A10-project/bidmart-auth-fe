import { AppError } from "~/shared/domain/errors/app-error";

export class ValidationError extends AppError {
  constructor(
    message: string,
    public readonly fieldErrors?: Record<string, string[]>,
  ) {
    super(message, "VALIDATION_ERROR", 422);
    this.name = "ValidationError";
  }
}
