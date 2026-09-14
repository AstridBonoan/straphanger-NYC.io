"use client";

import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { ProductImage } from "@/components/products/product-image";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/products/pricing";
import { useCartStore } from "@/lib/cart/store";
import type { CartLine } from "@/types";

export function CartLineItem({ line }: { line: CartLine }) {
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  return (
    <li className="flex gap-4 py-6 md:gap-6">
      <Link
        href={`/product/${line.slug}`}
        className="relative size-24 shrink-0 overflow-hidden rounded-md bg-[#0A0A0A]/[0.04] md:size-28"
      >
        <ProductImage
          src={line.imageUrl}
          alt={line.name}
          fallbackLabel="SH"
          fill
          sizes="112px"
          className="object-cover"
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <Link
              href={`/product/${line.slug}`}
              className="font-display text-base font-semibold hover:underline"
            >
              {line.name}
            </Link>
            <p className="mt-1 text-sm text-[#0A0A0A]/55">
              {line.color} / {line.size}
            </p>
            <p className="mt-1 text-sm font-medium">
              {formatPrice(line.unitPriceCents)}
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={`Remove ${line.name} from cart`}
            onClick={() => removeItem(line.productId, line.variantId)}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="inline-flex items-center rounded-md border border-[#0A0A0A]/15">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              aria-label="Decrease quantity"
              disabled={line.quantity <= 1}
              onClick={() =>
                updateQuantity(line.productId, line.variantId, line.quantity - 1)
              }
            >
              <Minus className="size-3.5" />
            </Button>
            <span className="w-8 text-center text-sm tabular-nums" aria-live="polite">
              {line.quantity}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              aria-label="Increase quantity"
              disabled={line.quantity >= line.maxQuantity}
              onClick={() =>
                updateQuantity(line.productId, line.variantId, line.quantity + 1)
              }
            >
              <Plus className="size-3.5" />
            </Button>
          </div>
          <p className="text-sm font-semibold tabular-nums">
            {formatPrice(line.unitPriceCents * line.quantity)}
          </p>
        </div>
      </div>
    </li>
  );
}
