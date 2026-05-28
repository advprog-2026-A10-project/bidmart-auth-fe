import { AppError } from "~/shared/domain/errors/app-error";

export class GoneError extends AppError {
  constructor(message = "This resource is no longer available.", metadata?: Record<string, unknown>) {
    super(message, "GONE", 410, metadata);
    this.name = "GoneError";
  }
}
