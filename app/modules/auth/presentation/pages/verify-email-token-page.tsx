import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { AuthCard } from "../components/auth-card";
import { useVerifyEmailMutation } from "../hooks/use-verify-email-mutation";
import { TokenExpiredError } from "~/modules/auth/domain/errors/auth-errors";
import { GoneError } from "~/shared/domain/errors/gone-error";

const pendingVerificationTokens = new Set<string>();
const verifiedEmailTokens = new Set<string>();

export function VerifyEmailTokenPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const verifyEmail = useVerifyEmailMutation();

  useEffect(() => {
    if (!token) {
      void navigate("/auth/check-email", { replace: true });
      return;
    }

    if (verifiedEmailTokens.has(token)) {
      void navigate("/auth/verify-email/success", { replace: true });
      return;
    }

    if (pendingVerificationTokens.has(token)) {
      return;
    }

    pendingVerificationTokens.add(token);
    verifyEmail
      .mutateAsync({ token })
      .then(() => {
        verifiedEmailTokens.add(token);
        void navigate("/auth/verify-email/success", { replace: true });
      })
      .catch((error: unknown) => {
        if (verifiedEmailTokens.has(token)) {
          void navigate("/auth/verify-email/success", { replace: true });
          return;
        }

        const statusCode =
          error instanceof Error && "statusCode" in error
            ? (error as { statusCode?: number }).statusCode
            : undefined;

        if (
          error instanceof TokenExpiredError ||
          error instanceof GoneError ||
          statusCode === 410
        ) {
          void navigate("/auth/verify-email/expired", { replace: true });
          return;
        }

        void navigate("/auth/verify-email/invalid", { replace: true });
      })
      .finally(() => {
        pendingVerificationTokens.delete(token);
      });
  }, [navigate, token, verifyEmail]);

  return (
    <AuthCard title="Verifying your email" description="Please wait a moment...">
      <div className="flex flex-col items-center gap-4 py-4 text-center">
        <div
          className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"
          role="status"
          aria-label="Verifying email"
        />
        <p className="text-muted-foreground text-sm">Verifying your email...</p>
      </div>
    </AuthCard>
  );
}
