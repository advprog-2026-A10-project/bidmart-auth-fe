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
import { useEffect, useState } from "react";
import QRCode from "qrcode";
import type { SetupMfaTotpResultDTO } from "~/modules/settings/application/dtos/settings.dto";
import { useSetupMfaTotpMutation } from "../hooks/use-setup-mfa-totp-mutation";
import { useVerifyMfaTotpMutation } from "../hooks/use-verify-mfa-totp-mutation";

const totpVerifySchema = z.object({
  code: z.string().length(6, "Code must be 6 digits.").regex(/^\d+$/, "Code must be numeric."),
});

type TotpVerifyFormValues = z.infer<typeof totpVerifySchema>;

function isRenderableQrImageSource(value: string | undefined): value is string {
  if (!value) return false;
  return (
    value.startsWith("data:image/") ||
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("/")
  );
}

export default function MfaTotpSetupPage() {
  const navigate = useNavigate();
  const setupMfaTotp = useSetupMfaTotpMutation();
  const verifyMfaTotp = useVerifyMfaTotpMutation();
  const [setupData, setSetupData] = useState<SetupMfaTotpResultDTO | null>(null);
  const [qrImageSrc, setQrImageSrc] = useState<string | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");

  useEffect(() => {
    let active = true;

    async function prepareQrImage() {
      if (!setupData) {
        setQrImageSrc(null);
        return;
      }

      if (isRenderableQrImageSource(setupData.qrCodeUrl)) {
        setQrImageSrc(setupData.qrCodeUrl);
        return;
      }

      try {
        const generatedQrImageSrc = await QRCode.toDataURL(setupData.otpauthUrl, {
          width: 224,
          margin: 1,
          errorCorrectionLevel: "M",
        });
        if (!active) return;
        setQrImageSrc(generatedQrImageSrc);
      } catch {
        if (!active) return;
        setQrImageSrc(null);
      }
    }

    void prepareQrImage();
    return () => {
      active = false;
    };
  }, [setupData]);

  const form = useForm<TotpVerifyFormValues>({
    resolver: zodResolver(totpVerifySchema),
    mode: "onBlur",
    reValidateMode: "onSubmit",
    defaultValues: {
      code: "",
    },
  });

  async function onSubmit(values: TotpVerifyFormValues) {
    if (!setupData) return;
    await verifyMfaTotp.mutateAsync({
      setupTicket: setupData.setupTicket,
      code: values.code,
      currentPassword,
    });
    void navigate("/settings/security/mfa");
  }

  async function handleStartSetup() {
    const result = await setupMfaTotp.mutateAsync({ currentPassword });
    setSetupData(result);
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
          <CardTitle>{!setupData ? "Start Setup" : "Verify Setup"}</CardTitle>
          <CardDescription>
            {!setupData
              ? "Click below to generate a QR code for your authenticator app."
              : "Scan the QR code and enter the 6-digit verification code."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!setupData ? (
            <div className="max-w-sm space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="totp-current-password">
                  Current Password
                </label>
                <Input
                  id="totp-current-password"
                  type="password"
                  autoComplete="current-password"
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                />
              </div>
              <Button
                onClick={handleStartSetup}
                disabled={setupMfaTotp.isPending || currentPassword.trim() === ""}
                className="w-full sm:w-auto"
              >
                {setupMfaTotp.isPending ? "Generating..." : "Start Setup"}
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-muted/50 flex flex-col items-center gap-4 rounded-lg border p-4">
                {qrImageSrc ? (
                  <img
                    src={qrImageSrc}
                    alt="Authenticator app QR code"
                    className="h-56 w-56 rounded-md border bg-white p-2"
                  />
                ) : (
                  <p className="text-muted-foreground text-sm">
                    QR preview unavailable. Use the setup URL below.
                  </p>
                )}
                <div className="space-y-1 text-center">
                  <p className="text-muted-foreground text-sm">
                    Unable to scan? Enter this code manually:
                  </p>
                  <code className="bg-muted rounded px-2 py-1 font-mono text-sm font-bold">
                    {setupData.secret}
                  </code>
                </div>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-4">
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
                            autoComplete="one-time-code"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            className="text-center font-mono text-lg tracking-widest"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Button asChild variant="ghost" className="w-full">
                      <Link to="/settings/security/mfa">Cancel</Link>
                    </Button>
                    <Button type="submit" className="w-full" disabled={verifyMfaTotp.isPending}>
                      {verifyMfaTotp.isPending ? "Verifying..." : "Verify"}
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
