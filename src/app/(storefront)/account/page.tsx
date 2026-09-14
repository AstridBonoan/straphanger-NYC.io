"use client";

import Link from "next/link";
import { RequireAuth, SignOutButton } from "@/components/auth/require-auth";
import { Container } from "@/components/layout/container";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const accountLinks = [
  {
    href: "/account/orders/",
    label: "Order history",
    description: "Track past and current orders.",
  },
  {
    href: "/account/wishlist/",
    label: "Wishlist",
    description: "Pieces you saved for later.",
  },
  {
    href: "/shop/",
    label: "Continue shopping",
    description: "Browse the latest drops.",
  },
];

export default function AccountPage() {
  return (
    <RequireAuth nextPath="/account/">
      {(session) => (
        <Container className="py-10 md:py-16">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#FF4D00]">
                Account
              </p>
              <h1 className="mt-2 font-display text-3xl font-bold tracking-tight md:text-4xl">
                Welcome back, {session.name.split(" ")[0]}
              </h1>
              <p className="mt-2 text-sm text-[#0A0A0A]/60">{session.email}</p>
            </div>
            <SignOutButton />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {accountLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-2xl border border-[#0A0A0A]/10 bg-white p-6 transition hover:border-[#FF4D00]/40"
              >
                <h2 className="font-display text-lg font-semibold">{link.label}</h2>
                <p className="mt-2 text-sm text-[#0A0A0A]/60">{link.description}</p>
              </Link>
            ))}
          </div>

          {session.role === "admin" ? (
            <div className="mt-8 rounded-2xl border border-[#FF4D00]/25 bg-[#FF4D00]/5 p-6">
              <h2 className="font-display text-lg font-semibold">Admin access</h2>
              <p className="mt-1 text-sm text-[#0A0A0A]/65">
                Your account has dashboard privileges.
              </p>
              <Link
                href="/admin/"
                className={cn(
                  buttonVariants({ variant: "secondary" }),
                  "mt-4 inline-flex",
                )}
              >
                Open admin dashboard
              </Link>
            </div>
          ) : null}
        </Container>
      )}
    </RequireAuth>
  );
}
