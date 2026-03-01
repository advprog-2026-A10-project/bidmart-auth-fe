import { NotificationsForm } from "~/modules/settings/presentation/components/notifications-form";
import { useGetNotificationPreferencesQuery } from "~/modules/settings/presentation/hooks/use-get-notification-preferences-query";
import { useUpdateNotificationPreferencesMutation } from "~/modules/settings/presentation/hooks/use-update-notification-preferences-mutation";
import { Skeleton } from "~/shared/components/ui/skeleton";

export function NotificationsPage() {
  const { data: preferences, isLoading, isError } = useGetNotificationPreferencesQuery();
  const { mutate, isPending } = useUpdateNotificationPreferencesMutation();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (isError || !preferences) {
    return (
      <div className="text-destructive">
        Failed to load notification preferences. Please try again later.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Notifications</h3>
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
        onSubmit={mutate}
        isSubmitting={isPending}
      />
    </div>
  );
}
