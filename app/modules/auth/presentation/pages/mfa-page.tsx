import { useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import { AuthCard } from "../components/auth-card";
import { readMfaTicket } from "~/modules/auth/infrastructure/storage/mfa-ticket-storage";
import { appendRedirectParam } from "~/modules/auth/infrastructure/navigation/redirect-target";

export function MfaPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectParam = searchParams.get("redirect");

  useEffect(() => {
    const state = readMfaTicket(location.state);

    if (!state) {
      navigate("/auth/login", { replace: true });
      return;
    }

    const withRedirect = (path: string) =>
      redirectParam ? appendRedirectParam(path, redirectParam) : path;

    if (state.mfaType === "totp") {
      navigate(withRedirect("/auth/mfa/totp"), { replace: true });
      return;
    }

    navigate(withRedirect("/auth/mfa/email"), { replace: true });
  }, [location.state, navigate, redirectParam]);

  return (
    <AuthCard title="Verifying..." description="Selecting your multi-factor authentication method.">
      <div className="flex flex-col items-center gap-4 py-4 text-center">
        <div
          className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"
          role="status"
          aria-label="Loading"
        />
        <p className="text-muted-foreground text-sm">Loading...</p>
      </div>
    </AuthCard>
  );
}
