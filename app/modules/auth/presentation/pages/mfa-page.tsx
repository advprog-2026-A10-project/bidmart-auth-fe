import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { AuthCard } from "../components/auth-card";

export function MfaPage() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const state = location.state as {
      ticket?: string;
      mfaType?: "totp" | "email";
    } | null;

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
    <AuthCard title="Verifying..." description="Please wait while we redirect you.">
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
