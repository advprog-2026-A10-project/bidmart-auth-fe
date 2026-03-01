import { AppError } from "~/shared/domain/errors/app-error";

export class NotFoundError extends AppError {
  constructor(resource: string, id?: string | number) {
    const message = id
      ? `${resource} with id "${id}" was not found.`
      : `${resource} was not found.`;
    super(message, "NOT_FOUND", 404);
    this.name = "NotFoundError";
  }
}
