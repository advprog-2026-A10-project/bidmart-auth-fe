import type {
  LoginDTO,
  RegisterDTO,
  ResendVerificationDTO,
  VerifyEmailDTO,
  ForgotPasswordDTO,
  ResetPasswordDTO,
  SendMfaEmailDTO,
  VerifyMfaEmailDTO,
  VerifyMfaTotpDTO,
} from "~/modules/auth/application/dtos/auth.dto";
import type { UserDTO } from "~/modules/auth/application/dtos/user.dto";
import { createUserId } from "~/modules/auth/domain/entities/user";

type LoginSuccessResponse = UserDTO;
type RegisterSuccessResponse = { message: string };
type VerifyEmailSuccessResponse = { message: string };
type ResendVerificationSuccessResponse = { message: string };
type ForgotPasswordSuccessResponse = { message: string };
type ResetPasswordSuccessResponse = { message: string };
type SendMfaEmailSuccessResponse = { message: string };
type VerifyMfaSuccessResponse = UserDTO;

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
      mfaRequired: {
        ticket: "mock-mfa-ticket",
        mfaType: "totp" as "totp" | "email",
      },
    },
  },
  register: {
    request: {
      firstName: "Alice",
      lastName: "Johnson",
      email: "alice@example.com",
      password: "secret123",
      confirmPassword: "secret123",
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
      error: {
        message: "Verification token is invalid or expired.",
        code: "INVALID_VERIFICATION_TOKEN",
      },
    },
  },
  forgotPassword: {
    request: {
      email: "alice@example.com",
    } satisfies ForgotPasswordDTO,
    response: {
      success: {
        message: "Password reset link sent.",
      } satisfies ForgotPasswordSuccessResponse,
    },
  },
  resetPassword: {
    request: {
      token: "mock-reset-token",
      password: "newSecret123",
    } satisfies ResetPasswordDTO,
    response: {
      success: {
        message: "Password reset successful.",
      } satisfies ResetPasswordSuccessResponse,
      tokenExpired: {
        message: "This link has expired.",
        code: "TOKEN_EXPIRED",
      },
      invalidToken: {
        message: "This password reset link is invalid.",
        code: "INVALID_RESET_TOKEN",
      },
    },
  },
  mfa: {
    routeInput: {
      ticket: "mock-mfa-ticket",
      mfaType: "totp" as "totp" | "email",
    },
  },
  mfaEmail: {
    sendCodeRequest: {
      ticket: "mock-mfa-email-ticket",
    } satisfies SendMfaEmailDTO,
    verifyRequest: {
      ticket: "mock-mfa-email-ticket",
      code: "123456",
    } satisfies VerifyMfaEmailDTO,
    response: {
      sendCodeSuccess: {
        message: "MFA code sent.",
      } satisfies SendMfaEmailSuccessResponse,
      verifySuccess: {
        id: createUserId("user-1"),
        name: "Alice",
        email: "alice@example.com",
        emailVerified: true,
      } satisfies VerifyMfaSuccessResponse,
      expiredError: {
        message: "The MFA code has expired. Please try again.",
        code: "MFA_EXPIRED",
      },
    },
  },
  mfaTotp: {
    verifyRequest: {
      ticket: "mock-mfa-totp-ticket",
      code: "123456",
    } satisfies VerifyMfaTotpDTO,
    response: {
      verifySuccess: {
        id: createUserId("user-1"),
        name: "Alice",
        email: "alice@example.com",
        emailVerified: true,
      } satisfies VerifyMfaSuccessResponse,
      expiredError: {
        message: "The MFA code has expired. Please try again.",
        code: "MFA_EXPIRED",
      },
    },
  },
} as const;
