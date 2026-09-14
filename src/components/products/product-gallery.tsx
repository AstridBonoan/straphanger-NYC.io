"use client";

import * as React from "react";
import type { ProductImage as ProductImageType } from "@/types";
import { ProductImage } from "@/components/products/product-image";
import { cn } from "@/lib/utils";

export interface ProductGalleryProps {
  images: ProductImageType[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const sorted = React.useMemo(
    () => [...images].sort((a, b) => a.sort_order - b.sort_order),
    [images],
  );
  const [activeIndex, setActiveIndex] = React.useState(0);
  const active = sorted[activeIndex] ?? sorted[0];
  const initials = productName
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  if (!active) {
    return (
      <div className="flex aspect-[4/5] w-full items-center justify-center rounded-xl bg-[linear-gradient(135deg,#0A0A0A_0%,#FF4D00_55%,#0A0A0A_100%)]">
        <span className="font-display text-2xl font-bold text-[#EDE6D6]/85">
          {initials}
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-[#0A0A0A]/[0.04]">
        <ProductImage
          key={active.id}
          src={active.url}
          alt={active.alt}
          fallbackLabel={initials}
          fill
          priority
          sizes="(min-width: 1024px) 45vw, 100vw"
          className="animate-fade-in object-cover"
        />
      </div>
      {sorted.length > 1 ? (
        <div className="flex gap-3" role="tablist" aria-label={`${productName} images`}>
          {sorted.map((img, index) => (
            <button
              key={img.id}
              type="button"
              role="tab"
              aria-selected={index === activeIndex}
              aria-label={`View image ${index + 1} of ${sorted.length}`}
              onClick={() => setActiveIndex(index)}
              className={cn(
                "relative size-20 shrink-0 overflow-hidden rounded-lg transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4D00]/50 focus-visible:ring-offset-2",
                index === activeIndex
                  ? "ring-2 ring-[#FF4D00]"
                  : "opacity-60 ring-1 ring-[#0A0A0A]/10 hover:opacity-100",
              )}
            >
              <ProductImage
                src={img.url}
                alt=""
                fallbackLabel={initials}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
