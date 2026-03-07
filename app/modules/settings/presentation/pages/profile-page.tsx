import { ProfileForm } from "~/modules/settings/presentation/components/profile-form";
import { SETTINGS_PAGE_MOCK_PAYLOADS } from "./constant";
import { useState } from "react";

export function ProfilePage() {
  const profile = SETTINGS_PAGE_MOCK_PAYLOADS.profile.response.get;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  function handleSubmit(values: { name: string; address: string; postalCode: string }) {
    setIsSubmitting(true);
    const request = { ...SETTINGS_PAGE_MOCK_PAYLOADS.profile.request.update, ...values };
    void request;
    setFeedback(SETTINGS_PAGE_MOCK_PAYLOADS.profile.response.update.message);
    setIsSubmitting(false);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Profile</h2>
        <p className="text-muted-foreground text-sm">Update your personal information.</p>
      </div>
      {feedback ? (
        <p className="text-sm font-medium" role="status" aria-live="polite">
          {feedback}
        </p>
      ) : null}
      <ProfileForm
        key={profile.id}
        defaultValues={{
          name: profile.name,
          address: profile.address,
          postalCode: profile.postalCode,
        }}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
