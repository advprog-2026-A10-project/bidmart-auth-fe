export type AuthSession = {
  userId: string;
  email: string;
  accessToken: string;
  expiresAt: number;
};

export type AuthSessionNullable = AuthSession | null;
