import { ProfileForm } from "~/modules/settings/presentation/components/profile-form";
import { useGetProfileQuery } from "~/modules/settings/presentation/hooks/use-get-profile-query";
import { useUpdateProfileMutation } from "~/modules/settings/presentation/hooks/use-update-profile-mutation";
import { Skeleton } from "~/shared/components/ui/skeleton";

export function ProfilePage() {
  const { data: profile, isLoading, isError } = useGetProfileQuery();
  const { mutate, isPending } = useUpdateProfileMutation();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-[200px]" />
          <Skeleton className="h-4 w-[300px]" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  if (isError || !profile) {
    return <div className="text-destructive">Failed to load profile. Please try again later.</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-muted-foreground text-sm">Update your personal information.</p>
      </div>
      <ProfileForm
        key={profile.id}
        defaultValues={{
          name: profile.name,
          address: profile.address,
          postalCode: profile.postalCode,
        }}
        onSubmit={mutate}
        isSubmitting={isPending}
      />
    </div>
  );
}
