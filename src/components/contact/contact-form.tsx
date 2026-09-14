"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";
import type { z } from "zod";
import { contactSchema } from "@/lib/validation/schemas";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type ContactInput = z.infer<typeof contactSchema>;

export function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<ContactInput>({ resolver: zodResolver(contactSchema) });

  async function onSubmit() {
    // Demo stub — no backend endpoint wired up yet; storefront UI only.
    await new Promise((resolve) => setTimeout(resolve, 500));
    reset();
  }

  if (isSubmitSuccessful) {
    return (
      <div
        role="status"
        className="flex flex-col items-center gap-3 rounded-lg border border-[#FF4D00]/30 bg-[#FF4D00]/5 px-6 py-12 text-center"
      >
        <span className="flex size-11 items-center justify-center rounded-full bg-[#FF4D00] text-white">
          <Check className="size-5" aria-hidden="true" />
        </span>
        <h2 className="text-lg font-semibold text-[#0A0A0A]">Message sent</h2>
        <p className="max-w-sm text-sm text-[#0A0A0A]/60">
          Thanks for reaching out — our team typically replies within one business
          day.
        </p>
        <Button type="button" variant="outline" onClick={() => reset()}>
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="contact-name">Name</Label>
          <Input
            id="contact-name"
            autoComplete="name"
            aria-invalid={errors.name ? "true" : undefined}
            aria-describedby={errors.name ? "contact-name-error" : undefined}
            {...register("name")}
          />
          {errors.name ? (
            <p id="contact-name-error" className="text-xs text-red-500">
              {errors.name.message}
            </p>
          ) : null}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="contact-email">Email</Label>
          <Input
            id="contact-email"
            type="email"
            autoComplete="email"
            aria-invalid={errors.email ? "true" : undefined}
            aria-describedby={errors.email ? "contact-email-error" : undefined}
            {...register("email")}
          />
          {errors.email ? (
            <p id="contact-email-error" className="text-xs text-red-500">
              {errors.email.message}
            </p>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="contact-subject">Subject</Label>
        <Input
          id="contact-subject"
          aria-invalid={errors.subject ? "true" : undefined}
          aria-describedby={errors.subject ? "contact-subject-error" : undefined}
          {...register("subject")}
        />
        {errors.subject ? (
          <p id="contact-subject-error" className="text-xs text-red-500">
            {errors.subject.message}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="contact-message">Message</Label>
        <Textarea
          id="contact-message"
          rows={6}
          aria-invalid={errors.message ? "true" : undefined}
          aria-describedby={errors.message ? "contact-message-error" : undefined}
          {...register("message")}
        />
        {errors.message ? (
          <p id="contact-message-error" className="text-xs text-red-500">
            {errors.message.message}
          </p>
        ) : null}
      </div>

      <Button type="submit" size="lg" disabled={isSubmitting} className="self-start">
        {isSubmitting ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
