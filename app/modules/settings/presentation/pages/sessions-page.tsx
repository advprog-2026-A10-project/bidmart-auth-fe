import { toast } from "sonner";
import { Button } from "~/shared/components/ui/button";
import { SessionCard } from "../components/session-card";
import { SETTINGS_PAGE_MOCK_PAYLOADS } from "./constant";
import { useState } from "react";

export function SessionsPage() {
  const [sessions, setSessions] = useState(SETTINGS_PAGE_MOCK_PAYLOADS.sessions.response.get);
  const [isRevokingAll, setIsRevokingAll] = useState(false);
  const [revokingSessionId, setRevokingSessionId] = useState<string | null>(null);

  const hasOtherSessions = sessions?.some((s) => !s.isCurrent);

  function handleRevokeSession(sessionId: string) {
    setRevokingSessionId(sessionId);
    const request = { ...SETTINGS_PAGE_MOCK_PAYLOADS.sessions.request.revoke, sessionId };
    void request;
    setSessions((current) => current.filter((session) => session.id !== sessionId));
    toast.success(SETTINGS_PAGE_MOCK_PAYLOADS.sessions.response.revoke.message);
    setRevokingSessionId(null);
  }

  function handleRevokeAll() {
    setIsRevokingAll(true);
    setSessions((current) => current.filter((session) => session.isCurrent));
    toast.success(SETTINGS_PAGE_MOCK_PAYLOADS.sessions.response.revokeAll.message);
    setIsRevokingAll(false);
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
            disabled={isRevokingAll}
          >
            {isRevokingAll ? "Revoking..." : "Revoke all other sessions"}
          </Button>
        )}
      </div>
      <div className="space-y-3">
        {sessions?.map((session) => (
          <SessionCard
            key={session.id}
            session={session}
            onRevoke={handleRevokeSession}
            isRevoking={revokingSessionId === session.id}
          />
        ))}
      </div>
    </div>
  );
}
