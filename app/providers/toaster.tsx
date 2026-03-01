import { Toaster } from "~/shared/components/ui/sonner";

export function ToasterProvider() {
  return (
    <Toaster
      position="bottom-right"
      richColors
      closeButton
      toastOptions={{
        duration: 4000,
      }}
    />
  );
}
