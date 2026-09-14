"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { CartLineItem } from "@/components/cart/cart-line-item";
import { CartSummaryPanel } from "@/components/cart/cart-summary";
import { Button, buttonVariants } from "@/components/ui/button";
import { useCartStore, useCartSummary } from "@/lib/cart/store";
import { cn } from "@/lib/utils";

export function CartView() {
  const lines = useCartStore((state) => state.lines);
  const clearCart = useCartStore((state) => state.clearCart);
  const summary = useCartSummary();

  if (lines.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-[#0A0A0A]/15 bg-white/50 px-6 py-20 text-center">
        <ShoppingBag className="size-12 text-[#0A0A0A]/25" aria-hidden="true" />
        <div>
          <h2 className="font-display text-xl font-semibold">Your bag is empty</h2>
          <p className="mt-2 text-sm text-[#0A0A0A]/60">
            Explore the shop and add pieces that fit your rotation.
          </p>
        </div>
        <Link href="/shop" className={cn(buttonVariants({ size: "lg" }))}>
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_360px] lg:items-start">
      <div>
        <ul className="divide-y divide-[#0A0A0A]/10 border-y border-[#0A0A0A]/10">
          {lines.map((line) => (
            <CartLineItem key={`${line.productId}-${line.variantId}`} line={line} />
          ))}
        </ul>
        <div className="mt-4 flex justify-end">
          <Button type="button" variant="ghost" size="sm" onClick={clearCart}>
            Clear bag
          </Button>
        </div>
      </div>
      <CartSummaryPanel summary={summary} />
    </div>
  );
}
