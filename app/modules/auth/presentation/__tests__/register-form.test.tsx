import { describe, it, expect, vi, beforeEach } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { RegisterForm } from "../components/register-form";

describe("RegisterForm", () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    mockOnSubmit.mockReset();
  });

  it("renders all fields", () => {
    render(
      <MemoryRouter>
        <RegisterForm onSubmit={mockOnSubmit} />
      </MemoryRouter>,
    );
    expect(screen.getByLabelText(/^first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
  });

  it("shows validation errors when submitting empty form", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <RegisterForm onSubmit={mockOnSubmit} />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole("button", { name: /create account/i }));

    expect(await screen.findByText(/first name is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/password must be at least/i)).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("shows error when passwords do not match", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <RegisterForm onSubmit={mockOnSubmit} />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByLabelText(/^first name/i), { target: { value: "Alice" } });
    fireEvent.change(screen.getByLabelText(/^email/i), { target: { value: "alice@example.com" } });
    fireEvent.change(screen.getByLabelText(/^password/i), { target: { value: "secret123" } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: "different" } });
    await user.click(screen.getByRole("button", { name: /create account/i }));

    expect(await screen.findByText(/passwords do not match/i)).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("calls onSubmit with correct values when form is valid", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <RegisterForm onSubmit={mockOnSubmit} />
      </MemoryRouter>,
    );

    await user.type(screen.getByLabelText(/^first name/i), "Alice");
    await user.type(screen.getByLabelText(/^last name/i), "Johnson");
    await user.type(screen.getByLabelText(/^email/i), "alice@example.com");
    await user.type(screen.getByLabelText(/^password/i), "secret123");
    await user.type(screen.getByLabelText(/confirm password/i), "secret123");
    await user.click(screen.getByRole("button", { name: /create account/i }));

    expect(mockOnSubmit).toHaveBeenCalledOnce();
    expect(mockOnSubmit.mock.calls[0][0]).toEqual({
      firstName: "Alice",
      lastName: "Johnson",
      email: "alice@example.com",
      password: "secret123",
      confirmPassword: "secret123",
    });
  });

  it("disables submit button when isSubmitting is true", () => {
    render(
      <MemoryRouter>
        <RegisterForm onSubmit={mockOnSubmit} isSubmitting={true} />
      </MemoryRouter>,
    );
    expect(screen.getByRole("button", { name: /creating account/i })).toBeDisabled();
  });
});
