export type LoginDTO = {
  email: string;
  password: string;
};

export type RegisterDTO = {
  name: string;
  email: string;
  password: string;
};

export type VerifyEmailDTO = {
  token: string;
};

export type ResendVerificationDTO = {
  email: string;
};

export type ForgotPasswordDTO = {
  email: string;
};

export type ResetPasswordDTO = {
  token: string;
  password: string;
};

export type VerifyMfaTotpDTO = {
  ticket: string;
  code: string;
};

export type SendMfaEmailDTO = {
  ticket: string;
};

export type VerifyMfaEmailDTO = {
  ticket: string;
  code: string;
};
