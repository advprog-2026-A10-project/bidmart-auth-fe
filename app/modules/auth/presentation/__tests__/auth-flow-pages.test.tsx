import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactElement } from "react";
import { MemoryRouter } from "react-router";
import type * as ReactRouter from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  EmailNotVerifiedError,
  MfaExpiredError,
  MfaRequiredError,
} from "~/modules/auth/domain/errors/auth-errors";
import { LoginPage } from "../pages/login-page";
import { MfaEmailPage } from "../pages/mfa-email-page";
import { MfaPage } from "../pages/mfa-page";
import { MfaTotpPage } from "../pages/mfa-totp-page";
import { ForgotPasswordPage } from "../pages/forgot-password-page";
import { ResetPasswordPage } from "../pages/reset-password-page";
import { VerifyEmailTokenPage } from "../pages/verify-email-token-page";

const navigateMock = vi.fn();
const searchParamsMock = vi.fn(() => new URLSearchParams());
const locationStateMock = vi.fn<() => unknown>(() => null);

const loginMutateAsyncMock = vi.fn();
const verifyEmailMutateAsyncMock = vi.fn();
const verifyTotpMutateAsyncMock = vi.fn();
const sendMfaEmailMutateAsyncMock = vi.fn();
const verifyMfaEmailMutateAsyncMock = vi.fn();
const forgotPasswordMutateAsyncMock = vi.fn();
const resetPasswordMutateAsyncMock = vi.fn();
const locationAssignMock = vi.fn();

vi.mock("~/modules/auth/presentation/redirect-target", () => ({
  resolvePostAuthRedirect: (rawRedirect: string | null) => rawRedirect ?? "/",
  appendRedirectParam: (pathname: string, redirectTarget: string) =>
    `${pathname}?redirect=${encodeURIComponent(redirectTarget)}`,
  redirectToTarget: (target: string) => locationAssignMock(target),
}));

vi.mock("react-router", async () => {
  const actual = await vi.importActual<typeof ReactRouter>("react-router");
  return {
    ...actual,
    useNavigate: () => navigateMock,
    useSearchParams: () => [searchParamsMock(), vi.fn()],
    useLocation: () => ({ state: locationStateMock() }),
  };
});

vi.mock("../hooks/use-login-mutation", () => ({
  useLoginMutation: () => ({
    mutateAsync: loginMutateAsyncMock,
    isPending: false,
  }),
}));

vi.mock("../hooks/use-verify-email-mutation", () => ({
  useVerifyEmailMutation: () => ({
    mutateAsync: verifyEmailMutateAsyncMock,
  }),
}));

vi.mock("../hooks/use-verify-mfa-totp-mutation", () => ({
  useVerifyMfaTotpMutation: () => ({
    mutateAsync: verifyTotpMutateAsyncMock,
    isPending: false,
  }),
}));

vi.mock("../hooks/use-send-mfa-email-mutation", () => ({
  useSendMfaEmailMutation: () => ({
    mutateAsync: sendMfaEmailMutateAsyncMock,
    isPending: false,
  }),
}));

vi.mock("../hooks/use-verify-mfa-email-mutation", () => ({
  useVerifyMfaEmailMutation: () => ({
    mutateAsync: verifyMfaEmailMutateAsyncMock,
    isPending: false,
  }),
}));

vi.mock("../hooks/use-forgot-password-mutation", () => ({
  useForgotPasswordMutation: () => ({
    mutateAsync: forgotPasswordMutateAsyncMock,
    isPending: false,
  }),
}));

vi.mock("../hooks/use-reset-password-mutation", () => ({
  useResetPasswordMutation: () => ({
    mutateAsync: resetPasswordMutateAsyncMock,
    isPending: false,
  }),
}));

function renderWithProviders(ui: ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{ui}</MemoryRouter>
    </QueryClientProvider>,
  );
}

async function typeOtp(user: ReturnType<typeof userEvent.setup>, code: string) {
  void user;
  for (let index = 0; index < code.length; index += 1) {
    fireEvent.change(screen.getByLabelText(`Digit ${index + 1}`), {
      target: { value: code[index] },
    });
  }
}

function fillField(label: RegExp | string, value: string) {
  fireEvent.change(screen.getByLabelText(label), { target: { value } });
}

describe("auth page flows", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
    searchParamsMock.mockReturnValue(new URLSearchParams());
    locationStateMock.mockReturnValue(null);
  });

  it("redirects normal login success to the MFA offer route", async () => {
    const user = userEvent.setup();
    loginMutateAsyncMock.mockResolvedValue({
      id: "user-1",
      name: "Alice",
      email: "alice@example.com",
      emailVerified: true,
    });

    renderWithProviders(<LoginPage />);
    fillField(/email/i, "alice@example.com");
    fillField("Password", "secret123");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(loginMutateAsyncMock).toHaveBeenCalledWith({
        email: "alice@example.com",
        password: "secret123",
      });
      expect(navigateMock).toHaveBeenCalledWith("/auth/mfa/offer?redirect=%2F");
    });
  });

  it("stores an MFA ticket out of the URL and redirects MFA-required login to /auth/mfa", async () => {
    const user = userEvent.setup();
    loginMutateAsyncMock.mockRejectedValue(new MfaRequiredError("ticket-123", "totp"));

    renderWithProviders(<LoginPage />);
    fillField(/email/i, "alice@example.com");
    fillField("Password", "secret123");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith("/auth/mfa", {
        state: { ticket: "ticket-123", mfaType: "totp", redirectTarget: "/" },
      });
    });
    expect(sessionStorage.getItem("bidmart:mfa-ticket")).toContain("ticket-123");
  });

  it("redirects unverified-email login attempts to the check-email flow", async () => {
    const user = userEvent.setup();
    loginMutateAsyncMock.mockRejectedValue(new EmailNotVerifiedError());

    renderWithProviders(<LoginPage />);
    fillField(/email/i, "pending@example.com");
    fillField("Password", "secret123");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith(
        "/auth/check-email?email=pending%40example.com",
      );
    });
  });

  it("verifies email token and redirects to the /auth success route", async () => {
    searchParamsMock.mockReturnValue(new URLSearchParams("token=valid-token"));
    verifyEmailMutateAsyncMock.mockResolvedValue({ message: "Email verified." });

    renderWithProviders(<VerifyEmailTokenPage />);

    await waitFor(() => {
      expect(verifyEmailMutateAsyncMock).toHaveBeenCalledWith({ token: "valid-token" });
      expect(navigateMock).toHaveBeenCalledWith("/auth/verify-email/success", { replace: true });
    });
  });

  it("submits a verify-email token only once across rerenders", async () => {
    searchParamsMock.mockReturnValue(new URLSearchParams("token=single-use-token"));
    verifyEmailMutateAsyncMock.mockResolvedValue({ message: "Email verified." });
    const queryClient = new QueryClient();

    const view = render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <VerifyEmailTokenPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    view.rerender(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <VerifyEmailTokenPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith("/auth/verify-email/success", { replace: true });
    });
    expect(verifyEmailMutateAsyncMock).toHaveBeenCalledTimes(1);
  });

  it("routes expired and invalid verify-email errors to /auth result routes", async () => {
    searchParamsMock.mockReturnValue(new URLSearchParams("token=expired-token"));
    verifyEmailMutateAsyncMock.mockRejectedValueOnce(new MfaExpiredError());

    renderWithProviders(<VerifyEmailTokenPage />);
    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith("/auth/verify-email/expired", { replace: true });
    });

    vi.clearAllMocks();
    searchParamsMock.mockReturnValue(new URLSearchParams("token=invalid-token"));
    verifyEmailMutateAsyncMock.mockRejectedValueOnce(new Error("invalid"));

    renderWithProviders(<VerifyEmailTokenPage />);
    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith("/auth/verify-email/invalid", { replace: true });
    });
  });

  it("submits forgot password through the backend mutation and routes to sent page", async () => {
    const user = userEvent.setup();
    forgotPasswordMutateAsyncMock.mockResolvedValue({ message: "sent" });

    renderWithProviders(<ForgotPasswordPage />);
    fillField(/email/i, "reset@example.com");
    await user.click(screen.getByRole("button", { name: /send reset link/i }));

    await waitFor(() => {
      expect(forgotPasswordMutateAsyncMock).toHaveBeenCalledWith({
        email: "reset@example.com",
      });
      expect(navigateMock).toHaveBeenCalledWith("/auth/forgot-password/sent");
    });
  });

  it("submits reset password token and routes expired or invalid tokens to result pages", async () => {
    const user = userEvent.setup();
    searchParamsMock.mockReturnValue(new URLSearchParams("token=valid-reset-token"));
    resetPasswordMutateAsyncMock.mockResolvedValue({ message: "reset" });

    renderWithProviders(<ResetPasswordPage />);
    fillField(/new password/i, "NewPassword123!");
    fillField(/confirm password/i, "NewPassword123!");
    await user.click(screen.getByRole("button", { name: /reset password/i }));

    await waitFor(() => {
      expect(resetPasswordMutateAsyncMock).toHaveBeenCalledWith({
        token: "valid-reset-token",
        password: "NewPassword123!",
      });
      expect(navigateMock).toHaveBeenCalledWith("/auth/reset-password/success");
    });

    cleanup();
    vi.clearAllMocks();
    searchParamsMock.mockReturnValue(new URLSearchParams("token=expired-reset-token"));
    resetPasswordMutateAsyncMock.mockRejectedValueOnce(new MfaExpiredError());
    renderWithProviders(<ResetPasswordPage />);
    fillField(/new password/i, "NewPassword123!");
    fillField(/confirm password/i, "NewPassword123!");
    await user.click(screen.getByRole("button", { name: /reset password/i }));
    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith("/auth/reset-password/expired");
    });

    cleanup();
    vi.clearAllMocks();
    searchParamsMock.mockReturnValue(new URLSearchParams("token=invalid-reset-token"));
    resetPasswordMutateAsyncMock.mockRejectedValueOnce(new Error("invalid"));
    renderWithProviders(<ResetPasswordPage />);
    fillField(/new password/i, "NewPassword123!");
    fillField(/confirm password/i, "NewPassword123!");
    await user.click(screen.getByRole("button", { name: /reset password/i }));
    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith("/auth/reset-password/invalid");
    });
  });

  it("routes MFA gate using state without adding the ticket to the URL", async () => {
    locationStateMock.mockReturnValue({ ticket: "ticket-123", mfaType: "email" });

    renderWithProviders(<MfaPage />);

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith("/auth/mfa/email", { replace: true });
    });
    expect(navigateMock.mock.calls.flat().join(" ")).not.toContain("ticket-123");
  });

  it("verifies TOTP MFA with a ticket from safe storage", async () => {
    const user = userEvent.setup();
    sessionStorage.setItem(
      "bidmart:mfa-ticket",
      JSON.stringify({ ticket: "ticket-123", mfaType: "totp", expiresAt: Date.now() + 30_000 }),
    );
    verifyTotpMutateAsyncMock.mockResolvedValue({ id: "user-1" });

    renderWithProviders(<MfaTotpPage />);
    await typeOtp(user, "123456");

    await waitFor(() => {
      expect(verifyTotpMutateAsyncMock).toHaveBeenCalledWith({
        ticket: "ticket-123",
        code: "123456",
      });
      expect(locationAssignMock).toHaveBeenCalledWith("/");
    });
  });

  it("sends and verifies email MFA with a ticket from safe storage", async () => {
    const user = userEvent.setup();
    sessionStorage.setItem(
      "bidmart:mfa-ticket",
      JSON.stringify({ ticket: "ticket-123", mfaType: "email", expiresAt: Date.now() + 30_000 }),
    );
    sendMfaEmailMutateAsyncMock.mockResolvedValue({ message: "sent" });
    verifyMfaEmailMutateAsyncMock.mockResolvedValue({ id: "user-1" });

    renderWithProviders(<MfaEmailPage />);
    await waitFor(() => {
      expect(sendMfaEmailMutateAsyncMock).toHaveBeenCalledWith({ ticket: "ticket-123" });
    });
    await typeOtp(user, "654321");

    await waitFor(() => {
      expect(verifyMfaEmailMutateAsyncMock).toHaveBeenCalledWith({
        ticket: "ticket-123",
        code: "654321",
      });
      expect(locationAssignMock).toHaveBeenCalledWith("/");
    });
  });

  it("sends the initial email MFA code once across mutation state rerenders", async () => {
    sessionStorage.setItem(
      "bidmart:mfa-ticket",
      JSON.stringify({ ticket: "ticket-123", mfaType: "email", expiresAt: Date.now() + 30_000 }),
    );
    sendMfaEmailMutateAsyncMock.mockResolvedValue({ message: "sent" });

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    function EmailGateTree() {
      return (
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <MfaEmailPage />
          </MemoryRouter>
        </QueryClientProvider>
      );
    }

    const { rerender } = render(<EmailGateTree />);
    await waitFor(() => {
      expect(sendMfaEmailMutateAsyncMock).toHaveBeenCalledTimes(1);
    });

    rerender(<EmailGateTree />);
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(sendMfaEmailMutateAsyncMock).toHaveBeenCalledTimes(1);
  });
});
