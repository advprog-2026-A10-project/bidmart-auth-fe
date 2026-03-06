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
import { SETTINGS_PAGE_MOCK_PAYLOADS } from "./constant";
import { useState } from "react";

const emailVerifySchema = z.object({
  code: z.string().min(1, "Code is required."),
});

type EmailVerifyFormValues = z.infer<typeof emailVerifySchema>;

export default function MfaEmailSetupPage() {
  const navigate = useNavigate();
  const [hasSentCode, setHasSentCode] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const form = useForm<EmailVerifyFormValues>({
    resolver: zodResolver(emailVerifySchema),
    mode: "onBlur",
    reValidateMode: "onSubmit",
    defaultValues: {
      code: "",
    },
  });

  function onSubmit(values: EmailVerifyFormValues) {
    setIsVerifying(true);
    const request = {
      ...SETTINGS_PAGE_MOCK_PAYLOADS.mfaEmail.request.verify,
      code: values.code,
    };
    void request;

    if (values.code !== SETTINGS_PAGE_MOCK_PAYLOADS.mfaEmail.request.verify.code) {
      setFeedback("Invalid code. Please try again.");
      setIsVerifying(false);
      return;
    }

    setFeedback(SETTINGS_PAGE_MOCK_PAYLOADS.mfaEmail.response.verify.message);
    setIsVerifying(false);
    void navigate("/settings/security/mfa");
  }

  function handleSendCode() {
    setIsSending(true);
    setHasSentCode(true);
    setFeedback(SETTINGS_PAGE_MOCK_PAYLOADS.mfaEmail.response.setup.message);
    setIsSending(false);
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
          {feedback ? (
            <p className="text-sm font-medium" role="status" aria-live="polite">
              {feedback}
            </p>
          ) : null}
          {!hasSentCode ? (
            <Button onClick={handleSendCode} disabled={isSending} className="w-full sm:w-auto">
              {isSending ? "Sending..." : "Send Verification Code"}
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
                  <div className="flex gap-2">
                    <Button asChild variant="ghost" className="w-full">
                      <Link to="/settings/security/mfa">Cancel</Link>
                    </Button>
                    <Button type="submit" className="w-full" disabled={isVerifying}>
                      {isVerifying ? "Verifying..." : "Verify"}
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
                  disabled={isSending}
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
