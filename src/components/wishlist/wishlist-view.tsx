"use client";

import * as React from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { ProductCard } from "@/components/products/product-card";
import { Button, buttonVariants } from "@/components/ui/button";
import { getSeedProductById } from "@/lib/products/seed-data";
import { useCartStore } from "@/lib/cart/store";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "bc-merch-wishlist";

let cache: string[] | null = null;
const listeners = new Set<() => void>();

function readWishlist(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function writeWishlist(ids: string[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // ignore storage failures
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): string[] {
  if (cache === null) cache = readWishlist();
  return cache;
}

function getServerSnapshot(): string[] {
  return [];
}

function setWishlist(ids: string[]) {
  cache = ids;
  writeWishlist(ids);
  listeners.forEach((listener) => listener());
}

export function WishlistView() {
  const ids = React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const addItem = useCartStore((state) => state.addItem);
  const hydrated = React.useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );

  const products = ids
    .map((id) => getSeedProductById(id))
    .filter((product): product is NonNullable<typeof product> => Boolean(product));

  const remove = (productId: string) => {
    setWishlist(ids.filter((id) => id !== productId));
  };

  const moveToCart = (productId: string) => {
    const product = getSeedProductById(productId);
    const variant = product?.variants?.find(
      (v) => v.is_active && v.inventory_quantity > 0,
    );
    if (!product || !variant) return;

    const image =
      product.images?.find((img) => img.is_primary)?.url ??
      product.images?.[0]?.url ??
      "";

    addItem({
      productId: product.id,
      variantId: variant.id,
      quantity: 1,
      name: product.name,
      slug: product.slug,
      imageUrl: image,
      size: variant.size,
      color: variant.color,
      unitPriceCents: variant.price_cents ?? product.price_cents,
      maxQuantity: variant.inventory_quantity,
    });
    remove(productId);
  };

  if (!hydrated) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="aspect-[3/4] animate-pulse rounded-xl bg-[#0A0A0A]/5"
          />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-[#0A0A0A]/15 bg-white/50 px-6 py-20 text-center">
        <Heart className="size-12 text-[#0A0A0A]/25" aria-hidden="true" />
        <div>
          <h2 className="font-display text-xl font-semibold">Wishlist is empty</h2>
          <p className="mt-2 text-sm text-[#0A0A0A]/60">
            Save products from the shop to revisit them later.
          </p>
        </div>
        <Link href="/shop" className={cn(buttonVariants({ size: "lg" }))}>
          Browse shop
        </Link>
      </div>
    );
  }

  return (
    <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <li key={product.id} className="space-y-3">
          <ProductCard product={product} />
          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              className="flex-1"
              onClick={() => moveToCart(product.id)}
            >
              Move to cart
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => remove(product.id)}
            >
              Remove
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
}
