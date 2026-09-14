"use client";

import * as React from "react";
import Link from "next/link";
import {
  clearClientSession,
  useDemoSession,
  type DemoSession,
} from "@/lib/auth/client-session";
import { Button } from "@/components/ui/button";
import { withBasePath } from "@/lib/paths";

export function RequireAuth({
  children,
  role,
  nextPath,
}: {
  children: React.ReactNode | ((session: DemoSession) => React.ReactNode);
  role?: "admin" | "customer";
  nextPath: string;
}) {
  const session = useDemoSession();
  const hydrated = React.useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );

  React.useEffect(() => {
    if (!hydrated) return;
    // Hard navigations — Next soft routing crashes on GitHub Pages static export.
    if (!session) {
      window.location.replace(
        withBasePath(`/login/?next=${encodeURIComponent(nextPath)}`),
      );
      return;
    }
    if (role === "admin" && session.role !== "admin") {
      window.location.replace(withBasePath("/login/?next=/admin/"));
    }
  }, [hydrated, session, role, nextPath]);

  if (!hydrated) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-[#0A0A0A]/55">
        Loading…
      </div>
    );
  }

  if (!session) return null;
  if (role === "admin" && session.role !== "admin") return null;

  return <>{typeof children === "function" ? children(session) : children}</>;
}

export function SignOutButton({ className }: { className?: string }) {
  return (
    <Button
      type="button"
      variant="outline"
      className={className}
      onClick={() => {
        clearClientSession();
        window.location.assign(withBasePath("/login/"));
      }}
    >
      Sign out
    </Button>
  );
}

export function AuthLinks() {
  const session = useDemoSession();
  if (!session) {
    return (
      <Link href="/login/" className="text-sm font-medium hover:underline">
        Sign in
      </Link>
    );
  }
  return (
    <Link href="/account/" className="text-sm font-medium hover:underline">
      Account
    </Link>
  );
}
