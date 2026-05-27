import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import type { PropsWithChildren } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { EmailNotVerifiedError } from "~/modules/auth/domain/errors/auth-errors";
import { useLoginMutation } from "../hooks/use-login-mutation";

const { executeMock, setCurrentUserMock, toastErrorMock, toastSuccessMock } = vi.hoisted(() => ({
  executeMock: vi.fn(),
  setCurrentUserMock: vi.fn(),
  toastErrorMock: vi.fn(),
  toastSuccessMock: vi.fn(),
}));

vi.mock("~/modules/auth/infrastructure/factories/auth-repository.factory", () => ({
  getAuthUseCases: () => ({
    login: {
      execute: executeMock,
    },
  }),
  setCurrentUser: setCurrentUserMock,
}));

vi.mock("sonner", () => ({
  toast: {
    error: toastErrorMock,
    success: toastSuccessMock,
  },
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return function Wrapper({ children }: PropsWithChildren) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

describe("useLoginMutation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows a status-specific toast when login fails because email is not verified", async () => {
    executeMock.mockRejectedValue(new EmailNotVerifiedError());
    const { result } = renderHook(() => useLoginMutation(), {
      wrapper: createWrapper(),
    });

    await expect(
      result.current.mutateAsync({
        email: "pending@example.com",
        password: "secret123",
      }),
    ).rejects.toBeInstanceOf(EmailNotVerifiedError);

    expect(toastErrorMock).toHaveBeenCalledWith(
      "Email address has not been verified. Please check your inbox.",
    );
  });

  it("shows the generic error toast for unexpected login failures", async () => {
    executeMock.mockRejectedValue(new Error("Unexpected failure"));
    const { result } = renderHook(() => useLoginMutation(), {
      wrapper: createWrapper(),
    });

    await expect(
      result.current.mutateAsync({
        email: "alice@example.com",
        password: "secret123",
      }),
    ).rejects.toThrow("Unexpected failure");

    expect(toastErrorMock).toHaveBeenCalledWith("Unexpected failure");
  });
});
