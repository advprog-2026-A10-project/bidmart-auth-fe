import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactElement } from "react";
import { MemoryRouter } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ProfilePage } from "../pages/profile-page";
import { ChangePasswordPage } from "../pages/change-password-page";
import { SessionsPage } from "../pages/sessions-page";
import { NotificationsPage } from "../pages/notifications-page";

const getProfileMock = vi.fn();
const updateProfileMock = vi.fn();
const changePasswordMock = vi.fn();
const getSessionsMock = vi.fn();
const revokeSessionMock = vi.fn();
const revokeAllSessionsMock = vi.fn();
const getNotificationsMock = vi.fn();
const updateNotificationsMock = vi.fn();

vi.mock("../hooks/use-get-profile-query", () => ({
  useGetProfileQuery: () => getProfileMock(),
}));

vi.mock("../hooks/use-update-profile-mutation", () => ({
  useUpdateProfileMutation: () => ({
    mutateAsync: updateProfileMock,
    isPending: false,
  }),
}));

vi.mock("../hooks/use-change-password-mutation", () => ({
  useChangePasswordMutation: () => ({
    mutateAsync: changePasswordMock,
    isPending: false,
  }),
}));

vi.mock("../hooks/use-get-sessions-query", () => ({
  useGetSessionsQuery: () => getSessionsMock(),
}));

vi.mock("../hooks/use-revoke-session-mutation", () => ({
  useRevokeSessionMutation: () => ({
    mutateAsync: revokeSessionMock,
    isPending: false,
  }),
}));

vi.mock("../hooks/use-revoke-all-sessions-mutation", () => ({
  useRevokeAllSessionsMutation: () => ({
    mutateAsync: revokeAllSessionsMock,
    isPending: false,
  }),
}));

vi.mock("../hooks/use-get-notification-preferences-query", () => ({
  useGetNotificationPreferencesQuery: () => getNotificationsMock(),
}));

vi.mock("../hooks/use-update-notification-preferences-mutation", () => ({
  useUpdateNotificationPreferencesMutation: () => ({
    mutateAsync: updateNotificationsMock,
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

describe("settings panel pages", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getProfileMock.mockReturnValue({
      data: {
        id: "user-1",
        name: "Alice Buyer",
        email: "alice@example.com",
        address: "Jl. BidMart 1",
        postalCode: "12345",
      },
      isLoading: false,
      isError: false,
      error: null,
    });
    getSessionsMock.mockReturnValue({
      data: [
        {
          id: "session-1",
          device: "Laptop",
          browser: "Chrome",
          os: "Windows",
          ip: "127.0.0.1",
          location: "Jakarta",
          lastActive: "2026-05-03T00:00:00Z",
          isCurrent: true,
        },
        {
          id: "session-2",
          device: "Phone",
          browser: "Safari",
          os: "iOS",
          ip: "127.0.0.2",
          location: "Bandung",
          lastActive: "2026-05-03T01:00:00Z",
          isCurrent: false,
        },
      ],
      isLoading: false,
      isError: false,
      error: null,
    });
    getNotificationsMock.mockReturnValue({
      data: {
        emailNotifications: true,
        pushNotifications: false,
        marketingEmails: false,
        securityAlerts: true,
      },
      isLoading: false,
      isError: false,
      error: null,
    });
    updateProfileMock.mockResolvedValue({ message: "updated" });
    changePasswordMock.mockResolvedValue({ message: "changed" });
    revokeSessionMock.mockResolvedValue({ message: "revoked" });
    revokeAllSessionsMock.mockResolvedValue({ message: "revoked all" });
    updateNotificationsMock.mockResolvedValue({ message: "saved" });
  });

  it("loads and updates profile through settings hooks", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ProfilePage />);

    await user.clear(screen.getByLabelText(/full name/i));
    await user.type(screen.getByLabelText(/full name/i), "Alice Updated");
    await user.click(screen.getByRole("button", { name: /save changes/i }));

    await waitFor(() =>
      expect(updateProfileMock).toHaveBeenCalledWith({
        name: "Alice Updated",
        address: "Jl. BidMart 1",
        postalCode: "12345",
      }),
    );
  });

  it("changes password through the change password hook", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ChangePasswordPage />);

    await user.type(screen.getByLabelText(/^current password$/i), "old-password");
    await user.type(screen.getByLabelText(/^new password$/i), "new-password");
    await user.type(screen.getByLabelText(/^confirm new password$/i), "new-password");
    await user.click(screen.getByRole("button", { name: /change password/i }));

    await waitFor(() =>
      expect(changePasswordMock).toHaveBeenCalledWith({
        currentPassword: "old-password",
        newPassword: "new-password",
      }),
    );
  });

  it("loads sessions and revokes sessions through settings hooks", async () => {
    const user = userEvent.setup();
    renderWithProviders(<SessionsPage />);

    expect(screen.getByText(/Laptop/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /^revoke$/i }));
    await user.click(screen.getByRole("button", { name: /revoke all other sessions/i }));

    await waitFor(() => {
      expect(revokeSessionMock).toHaveBeenCalledWith({ sessionId: "session-2" });
      expect(revokeAllSessionsMock).toHaveBeenCalled();
    });
  });

  it("loads and saves notification preferences through settings hooks", async () => {
    const user = userEvent.setup();
    renderWithProviders(<NotificationsPage />);

    await user.click(screen.getByLabelText(/push notifications/i));
    await user.click(screen.getByRole("button", { name: /save changes/i }));

    await waitFor(() =>
      expect(updateNotificationsMock).toHaveBeenCalledWith({
        emailNotifications: true,
        pushNotifications: true,
        marketingEmails: false,
        securityAlerts: true,
      }),
    );
  });
});
