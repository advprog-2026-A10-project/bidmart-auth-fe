import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { useEffect } from "react";

import type { Route } from "./+types/root";
import "./app.css";
import { QueryProvider } from "~/providers/query-client";
import { ToasterProvider } from "~/providers/toaster";
import { clientLogger, serializeError } from "~/shared/infrastructure/logger/client-logger";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div className="border-accent mx-auto w-full max-w-480 border">{children}</div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  useEffect(() => {
    function handleWindowError(event: ErrorEvent): void {
      clientLogger.error("window_runtime_error", {
        source: event.filename,
        line: event.lineno,
        column: event.colno,
      }, event.error ?? event.message);
    }

    function handleUnhandledRejection(event: PromiseRejectionEvent): void {
      clientLogger.error("window_unhandled_rejection", undefined, event.reason);
    }

    window.addEventListener("error", handleWindowError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);
    return () => {
      window.removeEventListener("error", handleWindowError);
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
    };
  }, []);

  return (
    <QueryProvider>
      <Outlet />
      <ToasterProvider />
    </QueryProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    clientLogger.error("route_error_boundary_triggered", {
      status: error.status,
      statusText: error.statusText,
      data: error.data,
    });
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404 ? "The requested page could not be found." : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    clientLogger.error("runtime_error_boundary_triggered", undefined, error);
    details = error.message;
    stack = error.stack;
  } else {
    clientLogger.error("unknown_error_boundary_triggered", {
      error: serializeError(error),
    });
  }

  return (
    <main className="container mx-auto p-4 pt-16">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full overflow-x-auto p-4">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
