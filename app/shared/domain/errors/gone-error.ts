import { AppError } from "~/shared/domain/errors/app-error";

export class GoneError extends AppError {
  constructor(message = "This resource is no longer available.") {
    super(message, "GONE", 410);
    this.name = "GoneError";
  }
}
