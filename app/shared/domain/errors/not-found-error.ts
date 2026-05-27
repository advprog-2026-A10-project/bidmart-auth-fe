import { AppError } from "~/shared/domain/errors/app-error";

export class NotFoundError extends AppError {
  constructor(resource: string, id?: string | number, metadata?: Record<string, unknown>) {
    const message = id
      ? `${resource} with id "${id}" was not found.`
      : `${resource} was not found.`;
    super(message, "NOT_FOUND", 404, metadata);
    this.name = "NotFoundError";
  }
}
