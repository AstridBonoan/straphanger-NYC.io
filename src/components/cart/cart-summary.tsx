"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { FREE_SHIPPING_THRESHOLD_CENTS, formatPrice } from "@/lib/products/pricing";
import type { CartSummary } from "@/types";
import { cn } from "@/lib/utils";

export function CartSummaryPanel({ summary }: { summary: CartSummary }) {
  const remainingForFreeShipping = Math.max(
    0,
    FREE_SHIPPING_THRESHOLD_CENTS - summary.subtotalCents,
  );

  return (
    <aside className="sticky top-24 rounded-2xl border border-[#0A0A0A]/10 bg-white p-6 shadow-sm">
      <h2 className="font-display text-lg font-semibold">Order summary</h2>

      <dl className="mt-6 space-y-3 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-[#0A0A0A]/60">Subtotal</dt>
          <dd className="font-medium tabular-nums">
            {formatPrice(summary.subtotalCents)}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-[#0A0A0A]/60">Estimated shipping</dt>
          <dd className="font-medium tabular-nums">
            {summary.shippingCents === 0
              ? "Free"
              : formatPrice(summary.shippingCents)}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-[#0A0A0A]/60">Estimated tax</dt>
          <dd className="font-medium tabular-nums">{formatPrice(summary.taxCents)}</dd>
        </div>
        <div className="flex justify-between gap-4 border-t border-[#0A0A0A]/10 pt-3 text-base">
          <dt className="font-semibold">Total</dt>
          <dd className="font-semibold tabular-nums">
            {formatPrice(summary.totalCents)}
          </dd>
        </div>
      </dl>

      {remainingForFreeShipping > 0 ? (
        <p className="mt-4 text-xs text-[#FF4D00]">
          Add {formatPrice(remainingForFreeShipping)} more for free shipping.
        </p>
      ) : (
        <p className="mt-4 text-xs text-[#FF4D00]">You qualify for free shipping.</p>
      )}

      <Link
        href="/checkout"
        className={cn(buttonVariants({ size: "lg" }), "mt-6 w-full")}
      >
        Checkout
      </Link>
      <Link
        href="/shop"
        className={cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "mt-2 w-full",
        )}
      >
        Continue shopping
      </Link>
    </aside>
  );
}
