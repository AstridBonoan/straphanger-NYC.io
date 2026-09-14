"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";
import type { z } from "zod";
import { newsletterSchema } from "@/lib/validation/schemas";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type NewsletterInput = z.infer<typeof newsletterSchema>;

export interface NewsletterFormProps {
  /** `compact` is tuned for the dark footer band; `default` for light sections. */
  variant?: "default" | "compact";
  className?: string;
}

export function NewsletterForm({ variant = "default", className }: NewsletterFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<NewsletterInput>({ resolver: zodResolver(newsletterSchema) });

  async function onSubmit() {
    // Demo stub — no email provider wired up yet.
    await new Promise((resolve) => setTimeout(resolve, 400));
    reset();
  }

  const isCompact = variant === "compact";
  const inputId = `newsletter-email-${variant}`;

  if (isSubmitSuccessful) {
    return (
      <p
        role="status"
        className={cn(
          "flex items-center gap-2 text-sm font-medium",
          isCompact ? "text-[#EDE6D6]" : "text-[#FF4D00]",
          className,
        )}
      >
        <Check className="size-4" aria-hidden="true" />
        You&rsquo;re on the list.
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className={cn("flex w-full max-w-sm flex-col gap-2", className)}
    >
      <div className="flex gap-2">
        <label htmlFor={inputId} className="sr-only">
          Email address
        </label>
        <Input
          id={inputId}
          type="email"
          autoComplete="email"
          placeholder="Email address"
          aria-invalid={errors.email ? "true" : undefined}
          aria-describedby={errors.email ? `${inputId}-error` : undefined}
          className={cn(
            isCompact &&
              "border-[#EDE6D6]/25 bg-transparent text-[#EDE6D6] placeholder:text-[#EDE6D6]/45 focus-visible:ring-[#EDE6D6]/40",
          )}
          {...register("email")}
        />
        <Button
          type="submit"
          variant={isCompact ? "secondary" : "default"}
          disabled={isSubmitting}
          className="shrink-0"
        >
          {isSubmitting ? "Joining…" : "Join"}
        </Button>
      </div>
      {errors.email ? (
        <p id={`${inputId}-error`} className="text-xs text-red-500">
          {errors.email.message}
        </p>
      ) : null}
    </form>
  );
}
