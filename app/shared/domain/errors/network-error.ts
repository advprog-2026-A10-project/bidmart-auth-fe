import { AppError } from "~/shared/domain/errors/app-error";

export class NetworkError extends AppError {
  constructor(message: string, statusCode?: number) {
    super(message, "NETWORK_ERROR", statusCode);
    this.name = "NetworkError";
  }
}
