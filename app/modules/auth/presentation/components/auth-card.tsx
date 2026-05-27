import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/shared/components/ui/card";
import type { ReactNode } from "react";

interface AuthCardProps {
  title: string;
  description?: string;
  children: ReactNode;
}

/**
 * AuthCard — shared card wrapper for all auth pages (login, register, verify-email).
 */
export function AuthCard({ title, description, children }: AuthCardProps) {
  return (
    <div className="flex min-h-screen items-center justify-center gap-12 px-6 py-12 max-lg:flex-col lg:gap-24">
      <div className="flex flex-col items-center">
        <img src="/bidmart.png" alt="logo" className="w-48 lg:w-96" />
        <h1 className="text-brand-500 text-center text-4xl font-bold lg:text-6xl">BidMart</h1>
      </div>
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-center text-2xl font-bold">{title}</CardTitle>
          {description && <CardDescription className="text-center">{description}</CardDescription>}
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  );
}
