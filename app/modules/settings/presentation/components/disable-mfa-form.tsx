import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/shared/components/ui/form";
import { Input } from "~/shared/components/ui/input";
import { Button } from "~/shared/components/ui/button";

const disableMfaFormSchema = z.object({
  password: z.string().min(1, "Password is required."),
});

export type DisableMfaFormValues = z.infer<typeof disableMfaFormSchema>;

interface DisableMfaFormProps {
  onSubmit: (values: DisableMfaFormValues) => void;
  isSubmitting?: boolean;
}

export function DisableMfaForm({ onSubmit, isSubmitting = false }: DisableMfaFormProps) {
  const form = useForm<DisableMfaFormValues>({
    resolver: zodResolver(disableMfaFormSchema),
    defaultValues: { password: "" },
    mode: "onBlur",
    reValidateMode: "onSubmit",
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" variant="destructive" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Disabling..." : "Disable MFA"}
        </Button>
      </form>
    </Form>
  );
}
