"use client";

import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import type {
  Product,
  ProductFilters as ProductFiltersType,
  ProductSize,
  ProductSortOption,
} from "@/types";
import { getSeedCategories, getSeedProducts } from "@/lib/products/seed-data";
import { productMatchesSearch } from "@/lib/products/search";
import { Container } from "@/components/layout/container";
import { ProductGrid } from "@/components/products/product-grid";
import { ProductFilters } from "@/components/products/product-filters";

const SIZE_ORDER: ProductSize[] = ["XS", "S", "M", "L", "XL", "XXL", "ONE_SIZE"];

function parseList(value: string | null): string[] {
  if (!value) return [];
  return value.split(",").filter(Boolean);
}

function parseNumber(value: string | null): number | undefined {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function filterFromSeed(filters: ProductFiltersType): {
  products: Product[];
  total: number;
} {
  let list = getSeedProducts().filter((p) => p.is_active);

  if (filters.search) {
    list = list.filter((product) =>
      productMatchesSearch(product, filters.search!),
    );
  }

  if (filters.category) {
    const cat = filters.category.toLowerCase();
    list = list.filter(
      (p) => p.category?.slug === cat || p.category_id === filters.category,
    );
  }

  if (filters.minPrice != null) {
    list = list.filter((p) => p.price_cents >= filters.minPrice!);
  }
  if (filters.maxPrice != null) {
    list = list.filter((p) => p.price_cents <= filters.maxPrice!);
  }

  if (filters.sizes?.length) {
    list = list.filter((p) =>
      (p.variants ?? []).some((v) => filters.sizes!.includes(v.size)),
    );
  }

  if (filters.colors?.length) {
    list = list.filter((p) =>
      (p.variants ?? []).some((v) =>
        filters.colors!.some((c) => c.toLowerCase() === v.color.toLowerCase()),
      ),
    );
  }

  if (filters.inStockOnly) {
    list = list.filter((p) =>
      (p.variants ?? []).some((v) => v.is_active && v.inventory_quantity > 0),
    );
  }

  const sort = filters.sort ?? "featured";
  list = [...list].sort((a, b) => {
    switch (sort) {
      case "newest":
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case "price-asc":
        return a.price_cents - b.price_cents;
      case "price-desc":
        return b.price_cents - a.price_cents;
      case "name-asc":
        return a.name.localeCompare(b.name);
      default:
        if (a.is_featured !== b.is_featured) return a.is_featured ? -1 : 1;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  return { products: list, total: list.length };
}

function ShopCatalog() {
  const searchParams = useSearchParams();

  const query = searchParams.toString();
  const filters: ProductFiltersType = useMemo(
    () => ({
      search: searchParams.get("search") ?? undefined,
      category: searchParams.get("category") ?? undefined,
      minPrice: parseNumber(searchParams.get("minPrice")),
      maxPrice: parseNumber(searchParams.get("maxPrice")),
      sizes: parseList(searchParams.get("sizes")) as ProductSize[],
      colors: parseList(searchParams.get("colors")),
      inStockOnly: searchParams.get("inStock") === "true",
      sort: (searchParams.get("sort") as ProductSortOption | null) ?? "featured",
      limit: 48,
    }),
    // searchParams identity changes; depend on the serialized query instead.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [query],
  );

  const catalog = useMemo(() => getSeedProducts(), []);
  const categories = useMemo(() => getSeedCategories(), []);
  const { products, total } = useMemo(() => filterFromSeed(filters), [filters]);

  const sizesInCatalog = new Set(
    catalog.flatMap((p) => (p.variants ?? []).map((v) => v.size)),
  );
  const availableSizes = SIZE_ORDER.filter((size) => sizesInCatalog.has(size));

  const colorMap = new Map<string, string>();
  for (const product of catalog) {
    for (const variant of product.variants ?? []) {
      if (!colorMap.has(variant.color)) {
        colorMap.set(variant.color, variant.color_hex);
      }
    }
  }
  const availableColors = Array.from(colorMap.entries()).map(([name, hex]) => ({
    name,
    hex,
  }));

  return (
    <>
      <Container className="flex flex-col gap-2 pb-8">
        <h1 className="font-display text-3xl font-bold tracking-tight text-[#0A0A0A] sm:text-4xl">
          Shop All
        </h1>
        <p className="text-sm text-[#0A0A0A]/60">
          {total} {total === 1 ? "piece" : "pieces"} on the platform
        </p>
      </Container>
      <Container className="grid gap-10 lg:grid-cols-[240px_1fr] lg:items-start lg:gap-14">
        <ProductFilters
          categories={categories}
          availableSizes={availableSizes}
          availableColors={availableColors}
        />
        <ProductGrid
          products={products}
          priorityCount={4}
          emptyMessage="No products match these filters. Try clearing a few."
        />
      </Container>
    </>
  );
}

export function ShopPageClient() {
  return (
    <div className="py-10 sm:py-14">
      <Suspense
        fallback={
          <Container>
            <div className="h-40 animate-pulse rounded-xl bg-[#0A0A0A]/5" />
          </Container>
        }
      >
        <ShopCatalog />
      </Suspense>
    </div>
  );
}
