"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  DEMO_ADMIN_EMAIL,
  buildDemoSession,
  setClientSession,
} from "@/lib/auth/client-session";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextParam = searchParams.get("next");
  const error = searchParams.get("error");
  const nextPath =
    nextParam && nextParam.startsWith("/") ? nextParam : "";

  const signIn = (email: string, name?: string, overrideNext?: string) => {
    const trimmed = email.trim();
    if (!trimmed) {
      router.replace(
        `/login/?error=missing-email${nextPath ? `&next=${encodeURIComponent(nextPath)}` : ""}`,
      );
      return;
    }
    const session = buildDemoSession(trimmed, name);
    setClientSession(session);
    const destination =
      overrideNext ||
      nextPath ||
      (session.role === "admin" ? "/admin/" : "/");
    router.push(destination);
  };

  return (
    <div className="w-full max-w-md rounded-xl border border-[#0A0A0A]/10 bg-white p-8 shadow-sm">
      <div className="mb-6 text-center">
        <Link href="/" className="inline-flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-[#FF4D00] text-sm font-bold text-[#0A0A0A]">
            SH
          </span>
          <span className="text-base font-semibold text-[#0A0A0A]">
            Straphanger NYC
          </span>
        </Link>
        <h1 className="mt-4 text-xl font-semibold text-[#0A0A0A]">Sign in</h1>
        <p className="mt-1 text-sm text-[#0A0A0A]/60">
          Demo mode — no password required. Sign in as{" "}
          <span className="font-medium text-[#0A0A0A]">{DEMO_ADMIN_EMAIL}</span>{" "}
          for admin dashboard access.
        </p>
      </div>

      {error === "missing-email" ? (
        <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          Enter an email address to continue.
        </p>
      ) : null}

      <form
        className="flex flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          signIn(String(data.get("email") ?? ""), String(data.get("name") ?? ""));
        }}
      >
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            required
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="name">Name (optional)</Label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Jamie Rivera"
            autoComplete="name"
          />
        </div>
        <Button type="submit" className="mt-1">
          Continue
        </Button>
      </form>

      <div className="mt-6 flex items-center gap-3 text-[11px] font-medium uppercase tracking-wide text-[#0A0A0A]/40">
        <span className="h-px flex-1 bg-[#0A0A0A]/10" />
        Quick demo access
        <span className="h-px flex-1 bg-[#0A0A0A]/10" />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <Button
          type="button"
          variant="secondary"
          className="w-full"
          onClick={() =>
            signIn(DEMO_ADMIN_EMAIL, "Admin", nextPath || "/admin/")
          }
        >
          Admin demo
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() =>
            signIn(
              "jordan.blake@example.com",
              "Jordan Blake",
              nextPath || "/account/",
            )
          }
        >
          Customer demo
        </Button>
      </div>

      <p className="mt-6 text-center text-sm text-[#0A0A0A]/60">
        Need an account?{" "}
        <Link href="/signup/" className="font-medium text-[#FF4D00] hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
