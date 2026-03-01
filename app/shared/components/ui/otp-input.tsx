import { useRef, type ClipboardEvent, type KeyboardEvent } from "react";
import { Input } from "~/shared/components/ui/input";
import { cn } from "~/lib/utils";

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

/**
 * OtpInput — a row of individual digit inputs that combine into a single string value.
 *
 * Features:
 * - Auto-advance on digit entry
 * - Backspace moves to previous cell and clears it
 * - Paste support: splits pasted digits across cells
 * - Numeric-only input
 * - Accessible labels
 */
export function OtpInput({ length = 6, value, onChange, disabled, className }: OtpInputProps) {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const digits = value.split("").concat(Array(length).fill("")).slice(0, length);

  function focusAt(index: number) {
    inputRefs.current[index]?.focus();
  }

  function handleChange(index: number, raw: string) {
    // Accept only digits; take the last character typed
    const digit = raw.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = digit;
    onChange(next.join(""));
    if (digit && index < length - 1) {
      focusAt(index + 1);
    }
  }

  function handleKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace") {
      if (digits[index]) {
        // Clear current cell
        const next = [...digits];
        next[index] = "";
        onChange(next.join(""));
      } else if (index > 0) {
        // Move to previous and clear it
        const next = [...digits];
        next[index - 1] = "";
        onChange(next.join(""));
        focusAt(index - 1);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      focusAt(index - 1);
    } else if (e.key === "ArrowRight" && index < length - 1) {
      focusAt(index + 1);
    }
  }

  function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (!pasted) return;
    const next = pasted.split("").concat(Array(length).fill("")).slice(0, length);
    onChange(next.join(""));
    const lastFilled = Math.min(pasted.length, length - 1);
    focusAt(lastFilled);
  }

  return (
    <div className={cn("flex gap-2", className)} role="group" aria-label="One-time code">
      {digits.map((digit, index) => (
        <Input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={digit}
          disabled={disabled}
          aria-label={`Digit ${index + 1}`}
          autoComplete={index === 0 ? "one-time-code" : "off"}
          className="h-12 w-12 text-center text-lg font-semibold tabular-nums"
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
        />
      ))}
    </div>
  );
}
