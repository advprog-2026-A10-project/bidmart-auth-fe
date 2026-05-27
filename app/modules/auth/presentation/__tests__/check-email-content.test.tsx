import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router";
import { CheckEmailContent } from "../components/check-email-content";

const resendMutateAsyncMock = vi.fn();

vi.mock("../hooks/use-resend-verification-mutation", () => ({
  useResendVerificationMutation: () => ({
    mutateAsync: resendMutateAsyncMock,
    isPending: false,
  }),
}));

function renderWithProviders(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe("CheckEmailContent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("prefills email and starts with cooldown state", () => {
    renderWithProviders(<CheckEmailContent email="alice@example.com" />);

    expect(screen.getByLabelText(/email address/i)).toHaveValue("alice@example.com");
    expect(screen.getByRole("button", { name: /resend email \(30s\)/i })).toBeDisabled();
  });

  it("allows resend after cooldown even when email was not passed in query params", async () => {
    const user = userEvent.setup();
    resendMutateAsyncMock.mockResolvedValue({ message: "Verification email sent." });
    renderWithProviders(<CheckEmailContent initialCooldownSeconds={0} />);

    await user.type(screen.getByLabelText(/email address/i), "foo@bar.com");
    await user.click(screen.getByRole("button", { name: /resend verification email/i }));

    expect(resendMutateAsyncMock).toHaveBeenCalledWith({ email: "foo@bar.com" });
    expect(await screen.findByText(/verification email sent\./i)).toBeInTheDocument();
  });

  it("shows inline validation for invalid email before calling resend", async () => {
    const user = userEvent.setup();
    renderWithProviders(<CheckEmailContent initialCooldownSeconds={0} />);

    await user.type(screen.getByLabelText(/email address/i), "not-an-email");
    await user.click(screen.getByRole("button", { name: /resend verification email/i }));

    expect(resendMutateAsyncMock).not.toHaveBeenCalled();
    expect(screen.getByText(/enter a valid email address\./i)).toBeInTheDocument();
  });
});
