import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-[#0A0A0A]/15 bg-white px-3 py-2 text-sm text-[#0A0A0A] shadow-none transition-colors placeholder:text-[#0A0A0A]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4D00]/40 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
);
Input.displayName = "Input";

export { Input };
