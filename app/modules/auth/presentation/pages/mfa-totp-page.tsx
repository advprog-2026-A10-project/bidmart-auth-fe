import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { AuthCard } from "../components/auth-card";
import { MfaTotpContent } from "../components/mfa-totp-content";

export function MfaTotpPage() {
  const [searchParams] = useSearchParams();
  const ticket = searchParams.get("ticket");
  const navigate = useNavigate();

  useEffect(() => {
    if (!ticket) {
      navigate("/login", { replace: true });
    }
  }, [ticket, navigate]);

  if (!ticket) return null;

  function handleSuccess() {
    navigate("/posts");
  }

  function handleExpired() {
    navigate("/mfa/expired");
  }

  return (
    <AuthCard
      title="Authenticator app"
      description="Enter the 6-digit code from your authenticator app."
    >
      <MfaTotpContent ticket={ticket} onSuccess={handleSuccess} onExpired={handleExpired} />
    </AuthCard>
  );
}
