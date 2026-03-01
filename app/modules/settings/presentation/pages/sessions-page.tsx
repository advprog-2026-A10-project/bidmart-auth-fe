import { Skeleton } from "~/shared/components/ui/skeleton";
import { Button } from "~/shared/components/ui/button";
import { SessionCard } from "../components/session-card";
import { useGetSessionsQuery } from "../hooks/use-get-sessions-query";
import { useRevokeSessionMutation } from "../hooks/use-revoke-session-mutation";
import { useRevokeAllSessionsMutation } from "../hooks/use-revoke-all-sessions-mutation";

export function SessionsPage() {
  const { data: sessions, isLoading, isError } = useGetSessionsQuery();
  const revokeSession = useRevokeSessionMutation();
  const revokeAll = useRevokeAllSessionsMutation();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="mt-2 h-4 w-64" />
          </div>
        </div>
        <div className="space-y-3">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (isError) {
    return <div className="p-4 text-center text-red-500">Failed to load sessions.</div>;
  }

  const hasOtherSessions = sessions?.some((s) => !s.isCurrent);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Active Sessions</h2>
          <p className="text-muted-foreground">Manage your active login sessions.</p>
        </div>
        {hasOtherSessions && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => revokeAll.mutate()}
            disabled={revokeAll.isPending}
          >
            {revokeAll.isPending ? "Revoking..." : "Revoke all other sessions"}
          </Button>
        )}
      </div>
      <div className="space-y-3">
        {sessions?.map((session) => (
          <SessionCard
            key={session.id}
            session={session}
            onRevoke={(id) => revokeSession.mutate({ sessionId: id })}
            isRevoking={
              revokeSession.isPending && revokeSession.variables?.sessionId === session.id
            }
          />
        ))}
      </div>
    </div>
  );
}
