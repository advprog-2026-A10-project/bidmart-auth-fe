import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { AuthCard } from "../components/auth-card";
import { readMfaTicket } from "../mfa-ticket-storage";

export function MfaPage() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const state = readMfaTicket(location.state);

    if (!state) {
      navigate("/login", { replace: true });
      return;
    }

    if (state.mfaType === "totp") {
      navigate("/auth/mfa/totp", { replace: true });
      return;
    }

    navigate("/auth/mfa/email", { replace: true });
  }, [location.state, navigate]);

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
