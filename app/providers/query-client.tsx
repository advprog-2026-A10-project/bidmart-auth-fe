import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { type ReactNode, useState } from "react";
import { clientLogger, serializeError } from "~/shared/infrastructure/logger/client-logger";

function makeQueryClient() {
  return new QueryClient({
    queryCache: new QueryCache({
      onError: (error, query) => {
        clientLogger.error("query_execution_failed", {
          queryKey: query.queryKey,
          meta: query.meta,
          error: serializeError(error),
        });
      },
    }),
    mutationCache: new MutationCache({
      onError: (error, _variables, _context, mutation) => {
        clientLogger.error("mutation_execution_failed", {
          mutationKey: mutation.options.mutationKey,
          meta: mutation.meta,
          error: serializeError(error),
        });
      },
    }),
    defaultOptions: {
      queries: {
        // Don't refetch on window focus in development
        refetchOnWindowFocus: import.meta.env.PROD,
        // Stale time: 60 seconds
        staleTime: 60 * 1000,
        // Retry once on failure
        retry: 1,
      },
      mutations: {
        retry: 0,
      },
    },
  });
}

// Browser singleton: reuse across re-renders
let browserQueryClient: QueryClient | undefined;

function getQueryClient() {
  if (typeof window === "undefined") {
    // Server: always create a new client to avoid shared state
    return makeQueryClient();
  }
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }
  return browserQueryClient;
}

interface QueryProviderProps {
  children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  // Use useState to avoid recreating the client on every render
  const [queryClient] = useState(() => getQueryClient());

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
