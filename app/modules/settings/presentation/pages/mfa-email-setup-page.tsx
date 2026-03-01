import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { z } from "zod";
import { useSetupMfaEmailMutation } from "../hooks/use-setup-mfa-email-mutation";
import { useVerifyMfaEmailMutation } from "../hooks/use-verify-mfa-email-mutation";
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

const emailVerifySchema = z.object({
  code: z.string().min(1, "Code is required."),
});

type EmailVerifyFormValues = z.infer<typeof emailVerifySchema>;

export default function MfaEmailSetupPage() {
  const navigate = useNavigate();
  const setupEmail = useSetupMfaEmailMutation();
  const verifyEmail = useVerifyMfaEmailMutation();

  const form = useForm<EmailVerifyFormValues>({
    resolver: zodResolver(emailVerifySchema),
    mode: "onBlur",
    reValidateMode: "onSubmit",
    defaultValues: {
      code: "",
    },
  });

  function onSubmit(values: EmailVerifyFormValues) {
    verifyEmail.mutate(values, {
      onSuccess: () => {
        navigate("/settings/security/mfa");
      },
    });
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
          <CardTitle>{!setupEmail.isSuccess ? "Send Code" : "Verify Code"}</CardTitle>
          <CardDescription>
            {!setupEmail.isSuccess
              ? "Click below to send a verification code to your email address."
              : "Enter the code sent to your email address."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!setupEmail.isSuccess ? (
            <Button onClick={() => setupEmail.mutate()} disabled={setupEmail.isPending}>
              {setupEmail.isPending ? "Sending..." : "Send Verification Code"}
            </Button>
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
                          <Input placeholder="Enter code" autoComplete="off" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex gap-2">
                    <Button asChild variant="ghost" className="w-full">
                      <Link to="/settings/security/mfa">Cancel</Link>
                    </Button>
                    <Button type="submit" className="w-full" disabled={verifyEmail.isPending}>
                      {verifyEmail.isPending ? "Verifying..." : "Verify"}
                    </Button>
                  </div>
                </form>
              </Form>
              <div className="text-muted-foreground mt-4 text-sm">
                Didn&apos;t receive the code?{" "}
                <button
                  type="button"
                  onClick={() => setupEmail.mutate()}
                  className="hover:text-foreground underline"
                  disabled={setupEmail.isPending}
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
