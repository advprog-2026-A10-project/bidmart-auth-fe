import { useSearchParams } from "react-router";
import { AuthCard } from "../components/auth-card";
import { CheckEmailContent } from "../components/check-email-content";

export function CheckEmailPage() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") ?? undefined;

  return (
    <AuthCard title="Check your email" description="A verification link is on its way.">
      <CheckEmailContent email={email} />
    </AuthCard>
  );
}
