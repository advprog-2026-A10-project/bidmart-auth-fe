import { ProfileForm } from "~/modules/settings/presentation/components/profile-form";
import { useGetProfileQuery } from "../hooks/use-get-profile-query";
import { useUpdateProfileMutation } from "../hooks/use-update-profile-mutation";

export function ProfilePage() {
  const { data: profile, isLoading, isError, error } = useGetProfileQuery();
  const updateProfile = useUpdateProfileMutation();

  async function handleSubmit(values: { name: string; address: string; postalCode: string }) {
    await updateProfile.mutateAsync(values);
  }

  if (isLoading) {
    return <p className="text-muted-foreground text-sm">Loading profile...</p>;
  }

  if (isError || !profile) {
    return (
      <p className="text-destructive text-sm">
        {error instanceof Error ? error.message : "Unable to load profile."}
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Profile</h2>
        <p className="text-muted-foreground text-sm">Update your personal information.</p>
      </div>
      <ProfileForm
        key={profile.id}
        defaultValues={{
          name: profile.name,
          address: profile.address,
          postalCode: profile.postalCode,
        }}
        onSubmit={handleSubmit}
        isSubmitting={updateProfile.isPending}
      />
    </div>
  );
}
