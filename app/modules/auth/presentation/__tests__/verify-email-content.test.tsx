import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { VerifyEmailContent } from "../components/verify-email-content";

function renderWithProviders(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe("VerifyEmailContent mock payload contract", () => {
  it("shows resend request payload preview with email input", () => {
    renderWithProviders(<VerifyEmailContent email="alice@example.com" />);

    expect(screen.getByText(/request payload preview/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toHaveValue("alice@example.com");
    expect(screen.getByRole("button", { name: /resend verification email/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /back to sign in/i })).toHaveAttribute(
      "href",
      "/login",
    );
  });

  it("shows verify response success placeholder when token is provided", () => {
    renderWithProviders(
      <VerifyEmailContent token="mock-token" mockVerifySuccessMessage="Email verified." />,
    );

    expect(screen.getByText(/email verified\./i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /continue to sign in/i })).toHaveAttribute(
      "href",
      "/login",
    );
  });

  it("shows resend response success message after click", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <VerifyEmailContent
        email="foo@bar.com"
        mockResendSuccessMessage="Verification email sent."
      />,
    );

    await user.click(screen.getByRole("button", { name: /resend verification email/i }));

    expect(screen.getByText(/verification email sent\./i)).toBeInTheDocument();
  });

  it("shows validation message when resend payload email is empty", async () => {
    const user = userEvent.setup();
    renderWithProviders(<VerifyEmailContent email="" />);

    await user.click(screen.getByRole("button", { name: /resend verification email/i }));

    expect(screen.getByText(/email is required\./i)).toBeInTheDocument();
  });
});
