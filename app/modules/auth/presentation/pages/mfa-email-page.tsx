import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { AuthCard } from "../components/auth-card";
import { MfaEmailContent } from "../components/mfa-email-content";

export function MfaEmailPage() {
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
    <AuthCard title="Email verification" description="Enter the 6-digit code sent to your email.">
      <MfaEmailContent ticket={ticket} onSuccess={handleSuccess} onExpired={handleExpired} />
    </AuthCard>
  );
}
