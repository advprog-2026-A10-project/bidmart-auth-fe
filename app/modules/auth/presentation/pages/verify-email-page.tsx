import { useSearchParams } from "react-router";
import { AuthCard } from "../components/auth-card";
import { VerifyEmailContent } from "../components/verify-email-content";
import { AUTH_PAGE_MOCK_PAYLOADS } from "./constant";

export function VerifyEmailPage() {
  const verifyEmailMock = AUTH_PAGE_MOCK_PAYLOADS.verifyEmail;
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? verifyEmailMock.request.token;
  const email = searchParams.get("email") ?? verifyEmailMock.resendRequest.email;

  return (
    <AuthCard
      title="Verify your email"
      description={token ? undefined : "Check your inbox for the verification link."}
    >
      <VerifyEmailContent
        token={token}
        email={email}
        mockVerifySuccessMessage={verifyEmailMock.response.success.message}
        mockResendSuccessMessage={verifyEmailMock.response.resendSuccess.message}
      />
    </AuthCard>
  );
}
