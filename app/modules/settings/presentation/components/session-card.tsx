import { Badge } from "~/shared/components/ui/badge";
import { Button } from "~/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "~/shared/components/ui/card";
import type { Session } from "~/modules/settings/domain/entities/session.entity";

interface SessionCardProps {
  session: Session;
  onRevoke: (sessionId: string) => void;
  isRevoking?: boolean;
}

export function SessionCard({ session, onRevoke, isRevoking }: SessionCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-base font-medium">
            {session.device} • {session.browser} • {session.os}
            {session.isCurrent && (
              <Badge variant="secondary" className="ml-2">
                This device
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            {session.ip} • {session.location}
          </CardDescription>
        </div>
        {!session.isCurrent && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onRevoke(session.id)}
            disabled={isRevoking}
          >
            {isRevoking ? "Revoking..." : "Revoke"}
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">Last active: {session.lastActive}</p>
      </CardContent>
    </Card>
  );
}
