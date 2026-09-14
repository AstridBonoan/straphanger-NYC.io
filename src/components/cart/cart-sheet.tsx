"use client";

import * as React from "react";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { buttonVariants } from "@/components/ui/button";
import { ProductImage } from "@/components/products/product-image";
import { formatPrice } from "@/lib/products/pricing";
import { useCartStore, useCartSummary } from "@/lib/cart/store";
import { cn } from "@/lib/utils";

export function CartSheet() {
  const isOpen = useCartStore((state) => state.isOpen);
  const setOpen = useCartStore((state) => state.setOpen);
  const lines = useCartStore((state) => state.lines);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const summary = useCartSummary();

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent side="right" className="flex w-full max-w-md flex-col p-0">
        <SheetHeader className="border-b border-[#0A0A0A]/10 px-6 py-5">
          <SheetTitle className="font-display">
            Your bag {summary.itemCount > 0 ? `(${summary.itemCount})` : ""}
          </SheetTitle>
        </SheetHeader>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <ShoppingBag className="size-10 text-[#0A0A0A]/30" aria-hidden="true" />
            <p className="text-sm text-[#0A0A0A]/60">Your bag is empty.</p>
            <Link
              href="/shop"
              onClick={() => setOpen(false)}
              className={buttonVariants({ variant: "outline" })}
            >
              Continue shopping
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 overflow-y-auto px-6 py-5">
              {lines.map((line) => (
                <li
                  key={`${line.productId}-${line.variantId}`}
                  className="flex gap-4 border-b border-[#0A0A0A]/10 py-5 first:pt-0 last:border-none"
                >
                  <div className="relative size-20 shrink-0 overflow-hidden rounded-md bg-[#0A0A0A]/[0.04]">
                    <ProductImage
                      src={line.imageUrl}
                      alt={line.name}
                      fallbackLabel="SH"
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-1">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/product/${line.slug}`}
                        onClick={() => setOpen(false)}
                        className="text-sm font-semibold text-[#0A0A0A] hover:text-[#FF4D00]"
                      >
                        {line.name}
                      </Link>
                      <button
                        type="button"
                        aria-label={`Remove ${line.name} from bag`}
                        onClick={() => removeItem(line.productId, line.variantId)}
                        className="text-[#0A0A0A]/40 transition-colors hover:text-[#0A0A0A]"
                      >
                        <X className="size-4" aria-hidden="true" />
                      </button>
                    </div>
                    <p className="text-xs text-[#0A0A0A]/55">
                      {line.color} · {line.size === "ONE_SIZE" ? "One Size" : line.size}
                    </p>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center rounded-md border border-[#0A0A0A]/20">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          onClick={() =>
                            updateQuantity(line.productId, line.variantId, line.quantity - 1)
                          }
                          className="flex size-7 items-center justify-center hover:bg-[#0A0A0A]/5"
                        >
                          <Minus className="size-3" aria-hidden="true" />
                        </button>
                        <span className="w-6 text-center text-xs font-medium tabular-nums">
                          {line.quantity}
                        </span>
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          disabled={line.quantity >= line.maxQuantity}
                          onClick={() =>
                            updateQuantity(line.productId, line.variantId, line.quantity + 1)
                          }
                          className="flex size-7 items-center justify-center hover:bg-[#0A0A0A]/5 disabled:opacity-30"
                        >
                          <Plus className="size-3" aria-hidden="true" />
                        </button>
                      </div>
                      <span className="text-sm font-medium text-[#0A0A0A]">
                        {formatPrice(line.unitPriceCents * line.quantity)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-4 border-t border-[#0A0A0A]/10 px-6 py-5">
              <div className="flex items-center justify-between text-sm text-[#0A0A0A]/70">
                <span>Subtotal</span>
                <span className="font-medium text-[#0A0A0A]">
                  {formatPrice(summary.subtotalCents)}
                </span>
              </div>
              <p className="text-xs text-[#0A0A0A]/50">
                Shipping and taxes calculated at checkout.
              </p>
              <Link
                href="/checkout/"
                onClick={() => setOpen(false)}
                className={cn(buttonVariants({ size: "lg" }), "w-full")}
              >
                Checkout
              </Link>
              <Link
                href="/shop"
                onClick={() => setOpen(false)}
                className={buttonVariants({ variant: "ghost", size: "sm" })}
              >
                Continue shopping
              </Link>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
