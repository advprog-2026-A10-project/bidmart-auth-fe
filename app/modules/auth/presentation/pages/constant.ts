import type {
  LoginDTO,
  RegisterDTO,
  ResendVerificationDTO,
  VerifyEmailDTO,
} from "~/modules/auth/application/dtos/auth.dto";
import type { UserDTO } from "~/modules/auth/application/dtos/user.dto";
import { createUserId } from "~/modules/auth/domain/entities/user";

type LoginSuccessResponse = UserDTO;
type RegisterSuccessResponse = { message: string };
type VerifyEmailSuccessResponse = { message: string };
type ResendVerificationSuccessResponse = { message: string };

export const AUTH_PAGE_MOCK_PAYLOADS = {
  login: {
    request: {
      email: "alice@example.com",
      password: "secret123",
    } satisfies LoginDTO,
    response: {
      success: {
        id: createUserId("user-1"),
        name: "Alice",
        email: "alice@example.com",
        emailVerified: true,
      } satisfies LoginSuccessResponse,
    },
  },
  register: {
    request: {
      name: "Alice",
      email: "alice@example.com",
      password: "secret123",
    } satisfies RegisterDTO,
    response: {
      success: {
        message: "Registration successful. Please verify your email.",
      } satisfies RegisterSuccessResponse,
    },
  },
  verifyEmail: {
    request: {
      token: "mock-verify-email-token",
    } satisfies VerifyEmailDTO,
    resendRequest: {
      email: "alice@example.com",
    } satisfies ResendVerificationDTO,
    response: {
      success: {
        message: "Email verified.",
      } satisfies VerifyEmailSuccessResponse,
      resendSuccess: {
        message: "Verification email sent.",
      } satisfies ResendVerificationSuccessResponse,
      tokenExpired: {
        message: "Token expired.",
        code: "TOKEN_EXPIRED",
      },
      invalidToken: {
        message: "Invalid verification token.",
        code: "INVALID_VERIFICATION_TOKEN",
      },
    },
  },
  checkEmail: {
    resendRequest: {
      email: "alice@example.com",
    } satisfies ResendVerificationDTO,
    response: {
      resendSuccess: {
        message: "Verification email sent.",
      } satisfies ResendVerificationSuccessResponse,
    },
  },
} as const;
