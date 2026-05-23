import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactElement } from "react";
import { MemoryRouter } from "react-router";
import type * as ReactRouter from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MfaPage } from "../pages/mfa-page";
import MfaEmailSetupPage from "../pages/mfa-email-setup-page";
import MfaTotpSetupPage from "../pages/mfa-totp-setup-page";
import { MfaDisablePage } from "../pages/mfa-disable-page";

const navigateMock = vi.fn();
const getMfaStatusMock = vi.fn();
const setupTotpMock = vi.fn();
const verifyTotpMock = vi.fn();
const setupEmailMock = vi.fn();
const verifyEmailMock = vi.fn();
const disableMfaMock = vi.fn();

vi.mock("react-router", async () => {
  const actual = await vi.importActual<typeof ReactRouter>("react-router");
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

vi.mock("../hooks/use-get-mfa-status-query", () => ({
  useGetMfaStatusQuery: () => getMfaStatusMock(),
}));

vi.mock("../hooks/use-setup-mfa-totp-mutation", () => ({
  useSetupMfaTotpMutation: () => ({
    mutateAsync: setupTotpMock,
    isPending: false,
  }),
}));

vi.mock("../hooks/use-verify-mfa-totp-mutation", () => ({
  useVerifyMfaTotpMutation: () => ({
    mutateAsync: verifyTotpMock,
    isPending: false,
  }),
}));

vi.mock("../hooks/use-setup-mfa-email-mutation", () => ({
  useSetupMfaEmailMutation: () => ({
    mutateAsync: setupEmailMock,
    isPending: false,
  }),
}));

vi.mock("../hooks/use-verify-mfa-email-mutation", () => ({
  useVerifyMfaEmailMutation: () => ({
    mutateAsync: verifyEmailMock,
    isPending: false,
  }),
}));

vi.mock("../hooks/use-disable-mfa-mutation", () => ({
  useDisableMfaMutation: () => ({
    mutateAsync: disableMfaMock,
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

describe("settings MFA pages", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getMfaStatusMock.mockReturnValue({
      data: { mfaEnabled: false, mfaType: null },
      isLoading: false,
      isError: false,
      error: null,
    });
  });

  it("renders MFA status from the status hook", () => {
    getMfaStatusMock.mockReturnValue({
      data: { mfaEnabled: true, mfaType: "totp" },
      isLoading: false,
      isError: false,
      error: null,
    });

    renderWithProviders(<MfaPage />);

    expect(screen.getByText(/mfa enabled/i)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /disable now/i })).not.toBeInTheDocument();
  });

  it("generates TOTP setup through the setup hook and verifies through the verify hook", async () => {
    const user = userEvent.setup();
    setupTotpMock.mockResolvedValue({
      setupTicket: "setup-ticket",
      secret: "SECRET",
      otpauthUrl: "otpauth://totp/BidMart:alice@example.com?secret=SECRET&issuer=BidMart",
      qrCodeUrl:
        "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjwvc3ZnPg==",
    });
    verifyTotpMock.mockResolvedValue({ message: "enabled" });

    renderWithProviders(<MfaTotpSetupPage />);
    await user.type(screen.getByLabelText(/current password/i), "currentPass123");
    await user.click(screen.getByRole("button", { name: /start setup/i }));
    expect(await screen.findByText("SECRET")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /authenticator app qr code/i })).toBeInTheDocument();

    await user.type(screen.getByLabelText(/verification code/i), "123456");
    await user.click(screen.getByRole("button", { name: /^verify$/i }));

    await waitFor(() => {
      expect(setupTotpMock).toHaveBeenCalledWith({ currentPassword: "currentPass123" });
      expect(verifyTotpMock).toHaveBeenCalledWith({
        setupTicket: "setup-ticket",
        code: "123456",
        currentPassword: "currentPass123",
      });
      expect(navigateMock).toHaveBeenCalledWith("/settings/security/mfa");
    });
  });

  it("sends and verifies email MFA through hooks", async () => {
    const user = userEvent.setup();
    setupEmailMock.mockResolvedValue({ message: "sent" });
    verifyEmailMock.mockResolvedValue({ message: "enabled" });

    renderWithProviders(<MfaEmailSetupPage />);
    await user.type(screen.getByLabelText(/current password/i), "currentPass123");
    await user.click(screen.getByRole("button", { name: /send verification code/i }));
    await waitFor(() =>
      expect(setupEmailMock).toHaveBeenCalledWith({ currentPassword: "currentPass123" }),
    );

    await user.type(screen.getByLabelText(/verification code/i), "123456");
    await user.click(screen.getByRole("button", { name: /^verify$/i }));

    await waitFor(() => {
      expect(verifyEmailMock).toHaveBeenCalledWith({
        code: "123456",
        currentPassword: "currentPass123",
      });
      expect(navigateMock).toHaveBeenCalledWith("/settings/security/mfa");
    });
  });

  it("disables MFA through the disable hook", async () => {
    const user = userEvent.setup();
    disableMfaMock.mockResolvedValue({ message: "disabled" });

    renderWithProviders(<MfaDisablePage />);
    await user.type(screen.getByLabelText(/password/i), "currentPass123");
    await user.click(screen.getByRole("button", { name: /disable mfa/i }));

    await waitFor(() => {
      expect(disableMfaMock).toHaveBeenCalledWith({ currentPassword: "currentPass123" });
      expect(navigateMock).toHaveBeenCalledWith("/settings/security/mfa");
    });
  });
});
