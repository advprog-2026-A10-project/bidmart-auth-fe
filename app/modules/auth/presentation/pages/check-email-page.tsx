import { useSearchParams } from "react-router";
import { AuthCard } from "../components/auth-card";
import { CheckEmailContent } from "../components/check-email-content";
import { AUTH_PAGE_MOCK_PAYLOADS } from "./constant";

export function CheckEmailPage() {
  const checkEmailMock = AUTH_PAGE_MOCK_PAYLOADS.checkEmail;
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") ?? checkEmailMock.resendRequest.email;

  return (
    <AuthCard title="Check your email" description="A verification link is on its way.">
      <CheckEmailContent email={email} />
    </AuthCard>
  );
}
