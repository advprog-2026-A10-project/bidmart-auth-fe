import { Button } from "~/shared/components/ui/button";
import { SessionCard } from "../components/session-card";
import { useGetSessionsQuery } from "../hooks/use-get-sessions-query";
import { useRevokeAllSessionsMutation } from "../hooks/use-revoke-all-sessions-mutation";
import { useRevokeSessionMutation } from "../hooks/use-revoke-session-mutation";

export function SessionsPage() {
  const { data: sessions = [], isLoading, isError, error } = useGetSessionsQuery();
  const revokeSession = useRevokeSessionMutation();
  const revokeAllSessions = useRevokeAllSessionsMutation();

  const hasOtherSessions = sessions?.some((s) => !s.isCurrent);

  async function handleRevokeSession(sessionId: string) {
    await revokeSession.mutateAsync({ sessionId });
  }

  async function handleRevokeAll() {
    await revokeAllSessions.mutateAsync();
  }

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
            onClick={handleRevokeAll}
            disabled={revokeAllSessions.isPending}
          >
            {revokeAllSessions.isPending ? "Revoking..." : "Revoke all other sessions"}
          </Button>
        )}
      </div>
      {isLoading ? <p className="text-muted-foreground text-sm">Loading sessions...</p> : null}
      {isError ? (
        <p className="text-destructive text-sm">
          {error instanceof Error ? error.message : "Unable to load sessions."}
        </p>
      ) : null}
      <div className="space-y-3">
        {sessions?.map((session) => (
          <SessionCard
            key={session.id}
            session={session}
            onRevoke={handleRevokeSession}
            isRevoking={revokeSession.isPending}
          />
        ))}
        {!isLoading && !isError && sessions.length === 0 ? (
          <p className="text-muted-foreground text-sm">No active sessions found.</p>
        ) : null}
      </div>
    </div>
  );
}
