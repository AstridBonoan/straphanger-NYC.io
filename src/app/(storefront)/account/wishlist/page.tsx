"use client";

import Link from "next/link";
import { RequireAuth } from "@/components/auth/require-auth";
import { Container } from "@/components/layout/container";
import { WishlistView } from "@/components/wishlist/wishlist-view";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AccountWishlistPage() {
  return (
    <RequireAuth nextPath="/account/wishlist/">
      <Container className="py-10 md:py-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#FF4D00]">
              Account
            </p>
            <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">
              Wishlist
            </h1>
          </div>
          <Link
            href="/account/"
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
          >
            Back
          </Link>
        </div>
        <WishlistView />
      </Container>
    </RequireAuth>
  );
}
