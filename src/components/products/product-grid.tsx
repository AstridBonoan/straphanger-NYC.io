import type { Product } from "@/types";
import { ProductCard } from "@/components/products/product-card";
import { cn } from "@/lib/utils";

export interface ProductGridProps {
  products: Product[];
  emptyMessage?: string;
  className?: string;
  priorityCount?: number;
}

export function ProductGrid({
  products,
  emptyMessage = "No products match these filters yet.",
  className,
  priorityCount = 0,
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-[#0A0A0A]/15 px-6 py-20 text-center">
        <p className="text-sm text-[#0A0A0A]/60">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6",
        className,
      )}
    >
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          priority={index < priorityCount}
        />
      ))}
    </div>
  );
}
