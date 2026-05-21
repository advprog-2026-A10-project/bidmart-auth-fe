import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { z } from "zod";
import { Button } from "~/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/shared/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/shared/components/ui/form";
import { Input } from "~/shared/components/ui/input";
import { useState } from "react";
import { useSetupMfaEmailMutation } from "../hooks/use-setup-mfa-email-mutation";
import { useVerifyMfaEmailMutation } from "../hooks/use-verify-mfa-email-mutation";

const emailVerifySchema = z.object({
  code: z.string().min(1, "Code is required."),
});

type EmailVerifyFormValues = z.infer<typeof emailVerifySchema>;

export default function MfaEmailSetupPage() {
  const navigate = useNavigate();
  const [hasSentCode, setHasSentCode] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const setupMfaEmail = useSetupMfaEmailMutation();
  const verifyMfaEmail = useVerifyMfaEmailMutation();

  const form = useForm<EmailVerifyFormValues>({
    resolver: zodResolver(emailVerifySchema),
    mode: "onBlur",
    reValidateMode: "onSubmit",
    defaultValues: {
      code: "",
    },
  });

  async function onSubmit(values: EmailVerifyFormValues) {
    await verifyMfaEmail.mutateAsync({ code: values.code, currentPassword });
    void navigate("/settings/security/mfa");
  }

  async function handleSendCode() {
    await setupMfaEmail.mutateAsync({ currentPassword });
    setHasSentCode(true);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Set up Email MFA</h2>
        <p className="text-muted-foreground">
          Receive a verification code via email to secure your account.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{!hasSentCode ? "Send Code" : "Verify Code"}</CardTitle>
          <CardDescription>
            {!hasSentCode
              ? "Click below to send a verification code to your email address."
              : "Enter the code sent to your email address."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!hasSentCode ? (
            <div className="max-w-sm space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="email-current-password">
                  Current Password
                </label>
                <Input
                  id="email-current-password"
                  type="password"
                  autoComplete="current-password"
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                />
              </div>
              <Button
                onClick={handleSendCode}
                disabled={setupMfaEmail.isPending || currentPassword.trim() === ""}
                className="w-full sm:w-auto"
              >
                {setupMfaEmail.isPending ? "Sending..." : "Send Verification Code"}
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="max-w-sm space-y-4"
                  noValidate
                >
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Verification Code</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter code"
                            autoComplete="one-time-code"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={6}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex w-full gap-2">
                    <Button asChild variant="ghost" className="w-full">
                      <Link to="/settings/security/mfa">Cancel</Link>
                    </Button>
                    <Button type="submit" className="w-full" disabled={verifyMfaEmail.isPending}>
                      {verifyMfaEmail.isPending ? "Verifying..." : "Verify"}
                    </Button>
                  </div>
                </form>
              </Form>
              <div className="text-muted-foreground mt-4 text-sm">
                Didn&apos;t receive the code?{" "}
                <button
                  type="button"
                  onClick={handleSendCode}
                  className="hover:text-foreground underline"
                  disabled={setupMfaEmail.isPending}
                >
                  Resend
                </button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
