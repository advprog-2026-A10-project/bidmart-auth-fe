import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "~/shared/components/ui/button";
import { Checkbox } from "~/shared/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel } from "~/shared/components/ui/form";

const notificationsFormSchema = z.object({
  emailNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  marketingEmails: z.boolean(),
  securityAlerts: z.boolean(),
});

export type NotificationsFormValues = z.infer<typeof notificationsFormSchema>;

interface NotificationsFormProps {
  defaultValues: NotificationsFormValues;
  onSubmit: (values: NotificationsFormValues) => void;
  isSubmitting?: boolean;
}

export function NotificationsForm({
  defaultValues,
  onSubmit,
  isSubmitting,
}: NotificationsFormProps) {
  const form = useForm<NotificationsFormValues>({
    resolver: zodResolver(notificationsFormSchema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="emailNotifications"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel htmlFor="email-notifications" className="text-base">
                    Email Notifications
                  </FormLabel>
                  <div className="text-muted-foreground text-sm">
                    Receive emails about your account activity.
                  </div>
                </div>
                <FormControl>
                  <Checkbox
                    id="email-notifications"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="pushNotifications"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel htmlFor="push-notifications" className="text-base">
                    Push Notifications
                  </FormLabel>
                  <div className="text-muted-foreground text-sm">
                    Receive push notifications on your devices.
                  </div>
                </div>
                <FormControl>
                  <Checkbox
                    id="push-notifications"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="marketingEmails"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel htmlFor="marketing-emails" className="text-base">
                    Marketing Emails
                  </FormLabel>
                  <div className="text-muted-foreground text-sm">
                    Receive emails about new products, features, and more.
                  </div>
                </div>
                <FormControl>
                  <Checkbox
                    id="marketing-emails"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="securityAlerts"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel htmlFor="security-alerts" className="text-base">
                    Security Alerts
                  </FormLabel>
                  <div className="text-muted-foreground text-sm">
                    Receive emails about your account security.
                  </div>
                </div>
                <FormControl>
                  <Checkbox
                    id="security-alerts"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save preferences"}
        </Button>
      </form>
    </Form>
  );
}
