import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { VerifyEmailContent } from "../components/verify-email-content";

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

describe("VerifyEmailContent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows resend email input without exposing payload previews", () => {
    renderWithProviders(<VerifyEmailContent email="alice@example.com" />);

    expect(screen.queryByText(/request payload preview/i)).not.toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toHaveValue("alice@example.com");
    expect(screen.getByRole("button", { name: /resend verification email/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /back to sign in/i })).toHaveAttribute(
      "href",
      "/login",
    );
  });

  it("calls the resend hook and shows the response message after click", async () => {
    const user = userEvent.setup();
    resendMutateAsyncMock.mockResolvedValue({ message: "Verification email sent." });
    renderWithProviders(<VerifyEmailContent email="foo@bar.com" />);

    await user.click(screen.getByRole("button", { name: /resend verification email/i }));

    expect(resendMutateAsyncMock).toHaveBeenCalledWith({ email: "foo@bar.com" });
    expect(await screen.findByText(/verification email sent\./i)).toBeInTheDocument();
  });

  it("shows validation feedback before calling resend without an email", async () => {
    const user = userEvent.setup();
    renderWithProviders(<VerifyEmailContent />);

    await user.click(screen.getByRole("button", { name: /resend verification email/i }));

    expect(resendMutateAsyncMock).not.toHaveBeenCalled();
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
  });
});
