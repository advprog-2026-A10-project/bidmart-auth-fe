type LogLevel = "debug" | "info" | "warn" | "error";

const LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

const SENSITIVE_KEY_MATCHERS = [
  "password",
  "token",
  "authorization",
  "cookie",
  "secret",
  "otp",
  "code",
];

const FALLBACK_REDACTION = "[REDACTED]";

type LogContext = Record<string, unknown>;

const isTestMode = import.meta.env.MODE === "test";
const configuredLogLevel = resolveLogLevel();
const consoleLoggingEnabled = resolveConsoleLoggingEnabled();

export const clientLogger = {
  debug(message: string, context?: LogContext): void {
    log("debug", message, context);
  },
  info(message: string, context?: LogContext): void {
    log("info", message, context);
  },
  warn(message: string, context?: LogContext): void {
    log("warn", message, context);
  },
  error(message: string, context?: LogContext, error?: unknown): void {
    const metadata = error !== undefined ? { ...context, error: serializeError(error) } : context;
    log("error", message, metadata);
  },
};

export function createClientRequestId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  const randomPart = Math.random().toString(16).slice(2, 10);
  return `req-${Date.now()}-${randomPart}`;
}

export function serializeError(error: unknown): Record<string, unknown> {
  if (error instanceof Error) {
      return {
        name: error.name,
        message: error.message,
        stack: error.stack,
        ...(hasRecordShape(error)
          ? sanitizeObject(error as unknown as Record<string, unknown>)
          : {}),
      };
    }

  if (hasRecordShape(error)) {
    return sanitizeObject(error as Record<string, unknown>);
  }

  return { value: String(error) };
}

function resolveLogLevel(): LogLevel {
  const requestedLevel = (import.meta.env.VITE_LOG_LEVEL ?? "").trim().toLowerCase();
  if (requestedLevel in LEVEL_PRIORITY) {
    return requestedLevel as LogLevel;
  }
  if (isTestMode) {
    return "warn";
  }
  return import.meta.env.PROD ? "info" : "debug";
}

function resolveConsoleLoggingEnabled(): boolean {
  const raw = import.meta.env.VITE_LOG_CONSOLE;
  if (raw !== undefined) {
    return raw.trim().toLowerCase() !== "false";
  }
  return !isTestMode;
}

function log(level: LogLevel, message: string, context?: LogContext): void {
  if (!consoleLoggingEnabled || !shouldLog(level)) {
    return;
  }

  const payload = {
    timestamp: new Date().toISOString(),
    level,
    message,
    context: context ? sanitizeObject(context) : undefined,
  };

  switch (level) {
    case "debug":
      console.debug(payload);
      return;
    case "info":
      console.info(payload);
      return;
    case "warn":
      console.warn(payload);
      return;
    case "error":
      console.error(payload);
  }
}

function shouldLog(level: LogLevel): boolean {
  return LEVEL_PRIORITY[level] >= LEVEL_PRIORITY[configuredLogLevel];
}

function sanitizeObject(record: Record<string, unknown>): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};
  Object.entries(record).forEach(([key, value]) => {
    if (isSensitiveKey(key)) {
      sanitized[key] = FALLBACK_REDACTION;
      return;
    }
    sanitized[key] = sanitizeValue(value);
  });
  return sanitized;
}

function sanitizeValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }

  if (hasRecordShape(value)) {
    return sanitizeObject(value as Record<string, unknown>);
  }

  return value;
}

function hasRecordShape(value: unknown): value is object {
  return typeof value === "object" && value !== null;
}

function isSensitiveKey(key: string): boolean {
  const normalizedKey = key.toLowerCase();
  return SENSITIVE_KEY_MATCHERS.some((matcher) => normalizedKey.includes(matcher));
}
