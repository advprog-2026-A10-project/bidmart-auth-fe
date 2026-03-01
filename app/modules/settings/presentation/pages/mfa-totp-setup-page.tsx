import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { z } from "zod";
import { useSetupMfaTotpMutation } from "../hooks/use-setup-mfa-totp-mutation";
import { useVerifyMfaTotpMutation } from "../hooks/use-verify-mfa-totp-mutation";
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

const totpVerifySchema = z.object({
  code: z.string().length(6, "Code must be 6 digits.").regex(/^\d+$/, "Code must be numeric."),
});

type TotpVerifyFormValues = z.infer<typeof totpVerifySchema>;

export default function MfaTotpSetupPage() {
  const navigate = useNavigate();
  const setupTotp = useSetupMfaTotpMutation();
  const verifyTotp = useVerifyMfaTotpMutation();

  const form = useForm<TotpVerifyFormValues>({
    resolver: zodResolver(totpVerifySchema),
    mode: "onBlur",
    reValidateMode: "onSubmit",
    defaultValues: {
      code: "",
    },
  });

  function onSubmit(values: TotpVerifyFormValues) {
    verifyTotp.mutate(values, {
      onSuccess: () => {
        navigate("/settings/security/mfa");
      },
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Set up Authenticator App</h2>
        <p className="text-muted-foreground">
          Use an app like Google Authenticator or Authy to scan the QR code.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{!setupTotp.data ? "Start Setup" : "Verify Setup"}</CardTitle>
          <CardDescription>
            {!setupTotp.data
              ? "Click below to generate a QR code for your authenticator app."
              : "Scan the QR code and enter the 6-digit verification code."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!setupTotp.data ? (
            <Button onClick={() => setupTotp.mutate()} disabled={setupTotp.isPending}>
              {setupTotp.isPending ? "Generating..." : "Start Setup"}
            </Button>
          ) : (
            <div className="space-y-6">
              <div className="bg-muted/50 flex flex-col items-center gap-4 rounded-lg border p-4">
                {setupTotp.data.qrCodeUrl && (
                  <img
                    src={setupTotp.data.qrCodeUrl}
                    alt="QR Code"
                    className="h-48 w-48 rounded-md bg-white p-2"
                  />
                )}
                <div className="space-y-1 text-center">
                  <p className="text-muted-foreground text-sm">
                    Unable to scan? Enter this code manually:
                  </p>
                  <code className="bg-muted rounded px-2 py-1 font-mono text-sm font-bold">
                    {setupTotp.data.secret}
                  </code>
                </div>
              </div>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="mx-auto max-w-sm space-y-4"
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
                            placeholder="000000"
                            maxLength={6}
                            className="text-center font-mono text-lg tracking-widest"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex gap-2">
                    <Button asChild variant="ghost" className="w-full">
                      <Link to="/settings/security/mfa">Cancel</Link>
                    </Button>
                    <Button type="submit" className="w-full" disabled={verifyTotp.isPending}>
                      {verifyTotp.isPending ? "Verifying..." : "Verify"}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
