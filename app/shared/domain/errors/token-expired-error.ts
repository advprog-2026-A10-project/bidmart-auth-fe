import { AppError } from "~/shared/domain/errors/app-error";

export class TokenExpiredError extends AppError {
  constructor(message = "The verification link has expired.") {
    super(message, "TOKEN_EXPIRED", 410);
    this.name = "TokenExpiredError";
  }
}
