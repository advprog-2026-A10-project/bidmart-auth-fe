import { NotificationsForm } from "~/modules/settings/presentation/components/notifications-form";
import { useGetNotificationPreferencesQuery } from "../hooks/use-get-notification-preferences-query";
import { useUpdateNotificationPreferencesMutation } from "../hooks/use-update-notification-preferences-mutation";

export function NotificationsPage() {
  const { data: preferences, isLoading, isError, error } = useGetNotificationPreferencesQuery();
  const updatePreferences = useUpdateNotificationPreferencesMutation();

  async function handleSubmit(values: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    marketingEmails: boolean;
    securityAlerts: boolean;
  }) {
    await updatePreferences.mutateAsync(values);
  }

  if (isLoading) {
    return <p className="text-muted-foreground text-sm">Loading notification preferences...</p>;
  }

  if (isError || !preferences) {
    return (
      <p className="text-destructive text-sm">
        {error instanceof Error ? error.message : "Unable to load notification preferences."}
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Notifications</h2>
        <p className="text-muted-foreground text-sm">Configure how you receive notifications.</p>
      </div>
      <NotificationsForm
        key={JSON.stringify(preferences)}
        defaultValues={{
          emailNotifications: preferences.emailNotifications ?? false,
          pushNotifications: preferences.pushNotifications ?? false,
          marketingEmails: preferences.marketingEmails ?? false,
          securityAlerts: preferences.securityAlerts ?? false,
        }}
        onSubmit={handleSubmit}
        isSubmitting={updatePreferences.isPending}
      />
    </div>
  );
}
