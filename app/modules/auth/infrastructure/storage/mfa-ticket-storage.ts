const MFA_TICKET_STORAGE_KEY = "bidmart:mfa-ticket";
const MFA_TICKET_TTL_MS = 5 * 60 * 1000;

export type MfaTicketState = {
  ticket: string;
  mfaType: "totp" | "email";
  redirectTarget?: string;
};

type StoredMfaTicket = MfaTicketState & {
  expiresAt: number;
};

function isMfaTicketState(value: unknown): value is MfaTicketState {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<MfaTicketState>;
  return (
    typeof candidate.ticket === "string" &&
    candidate.ticket.length > 0 &&
    (candidate.mfaType === "totp" || candidate.mfaType === "email") &&
    (candidate.redirectTarget === undefined || typeof candidate.redirectTarget === "string")
  );
}

export function storeMfaTicket(state: MfaTicketState): void {
  if (typeof window === "undefined") return;
  const stored: StoredMfaTicket = {
    ...state,
    expiresAt: Date.now() + MFA_TICKET_TTL_MS,
  };
  window.sessionStorage.setItem(MFA_TICKET_STORAGE_KEY, JSON.stringify(stored));
}

export function readMfaTicket(state?: unknown): MfaTicketState | null {
  if (isMfaTicketState(state)) {
    storeMfaTicket(state);
    return state;
  }

  if (typeof window === "undefined") return null;
  const raw = window.sessionStorage.getItem(MFA_TICKET_STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as StoredMfaTicket;
    if (!isMfaTicketState(parsed) || parsed.expiresAt < Date.now()) {
      clearMfaTicket();
      return null;
    }
    return {
      ticket: parsed.ticket,
      mfaType: parsed.mfaType,
      redirectTarget: parsed.redirectTarget,
    };
  } catch {
    clearMfaTicket();
    return null;
  }
}

export function clearMfaTicket(): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(MFA_TICKET_STORAGE_KEY);
}

export { MFA_TICKET_STORAGE_KEY };
