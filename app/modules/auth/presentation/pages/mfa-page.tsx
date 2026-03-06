import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { AuthCard } from "../components/auth-card";
import { AUTH_PAGE_MOCK_PAYLOADS } from "./constant";

export function MfaPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const mfaMock = AUTH_PAGE_MOCK_PAYLOADS.mfa;

  useEffect(() => {
    const state =
      (location.state as {
        ticket?: string;
        mfaType?: "totp" | "email";
      } | null) ?? mfaMock.routeInput;

    if (!state || !state.ticket || !state.mfaType) {
      navigate("/login", { replace: true });
      return;
    }

    if (state.mfaType === "totp") {
      navigate(`/mfa/totp?ticket=${state.ticket}`, { replace: true });
    } else if (state.mfaType === "email") {
      navigate(`/mfa/email?ticket=${state.ticket}`, { replace: true });
    } else {
      navigate("/login", { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthCard
      title="Verifying..."
      description="Placeholder MFA route switch with mock payload input."
    >
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
