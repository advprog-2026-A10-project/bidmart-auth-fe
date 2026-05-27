import { AppError } from "~/shared/domain/errors/app-error";

export class NetworkError extends AppError {
  constructor(message: string, statusCode?: number, metadata?: Record<string, unknown>) {
    super(message, "NETWORK_ERROR", statusCode, metadata);
    this.name = "NetworkError";
  }
}
