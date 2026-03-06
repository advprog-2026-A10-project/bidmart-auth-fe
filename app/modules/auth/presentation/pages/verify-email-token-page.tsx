import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { AuthCard } from "../components/auth-card";
import { AUTH_PAGE_MOCK_PAYLOADS } from "./constant";

/**
 * VerifyEmailTokenPage — handles 1.1.3.
 *
 * Receives ?token=... from the email link. Auto-verifies on mount and
 * redirects to the appropriate result page (success / expired / invalid).
 */
export function VerifyEmailTokenPage() {
  const verifyEmailMock = AUTH_PAGE_MOCK_PAYLOADS.verifyEmail;
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? verifyEmailMock.request.token;
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      // No token — shouldn't land here; redirect to check-email
      void navigate("/check-email", { replace: true });
      return;
    }

    if (token.includes("expired")) {
      void navigate("/verify-email/expired", { replace: true });
      return;
    }

    if (token.includes("invalid")) {
      void navigate("/verify-email/invalid", { replace: true });
      return;
    }

    void navigate("/verify-email/success", { replace: true });
    // Intentionally only runs on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthCard title="Verifying your email" description="Please wait a moment…">
      <div className="flex flex-col items-center gap-4 py-4 text-center">
        <div
          className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"
          role="status"
          aria-label="Verifying email"
        />
        <p className="text-muted-foreground text-sm">Verifying your email…</p>
      </div>
    </AuthCard>
  );
}
