import { toast } from "sonner";
import { NotificationsForm } from "~/modules/settings/presentation/components/notifications-form";
import { SETTINGS_PAGE_MOCK_PAYLOADS } from "./constant";
import { useState } from "react";

export function NotificationsPage() {
  const preferences = SETTINGS_PAGE_MOCK_PAYLOADS.notifications.response.get;
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit(values: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    marketingEmails: boolean;
    securityAlerts: boolean;
  }) {
    setIsSubmitting(true);
    const request = { ...SETTINGS_PAGE_MOCK_PAYLOADS.notifications.request.update, ...values };
    void request;
    toast.success(SETTINGS_PAGE_MOCK_PAYLOADS.notifications.response.update.message);
    setIsSubmitting(false);
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
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
