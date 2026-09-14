"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import type { Category, ProductSize, ProductSortOption } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export interface ProductFiltersProps {
  categories: Category[];
  availableSizes: ProductSize[];
  availableColors: Array<{ name: string; hex: string }>;
}

const SORT_OPTIONS: Array<{ value: ProductSortOption; label: string }> = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A to Z" },
];

function toggleListParam(current: string[], value: string): string[] {
  return current.includes(value)
    ? current.filter((v) => v !== value)
    : [...current, value];
}

export function ProductFilters({
  categories,
  availableSizes,
  availableColors,
}: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const urlSearch = searchParams.get("search") ?? "";
  const [searchValue, setSearchValue] = React.useState(urlSearch);
  const [prevUrlSearch, setPrevUrlSearch] = React.useState(urlSearch);
  const searchDebounce = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // Align the sidebar field with URL updates from nav search (render-time sync).
  if (urlSearch !== prevUrlSearch) {
    setPrevUrlSearch(urlSearch);
    setSearchValue(urlSearch);
  }

  // Cancel pending debounced URL writes when the query changes from outside.
  React.useEffect(() => {
    if (searchDebounce.current) {
      clearTimeout(searchDebounce.current);
      searchDebounce.current = null;
    }
  }, [urlSearch]);

  React.useEffect(() => {
    return () => {
      if (searchDebounce.current) clearTimeout(searchDebounce.current);
    };
  }, []);

  const category = searchParams.get("category") ?? "";
  const sort = (searchParams.get("sort") as ProductSortOption | null) ?? "featured";
  const inStock = searchParams.get("inStock") === "true";
  const minPrice = searchParams.get("minPrice") ?? "";
  const maxPrice = searchParams.get("maxPrice") ?? "";
  const sizes = React.useMemo(
    () => searchParams.getAll("sizes").flatMap((s) => s.split(",")).filter(Boolean),
    [searchParams],
  );
  const colors = React.useMemo(
    () => searchParams.getAll("colors").flatMap((c) => c.split(",")).filter(Boolean),
    [searchParams],
  );

  const activeFilterCount =
    (category ? 1 : 0) +
    (minPrice ? 1 : 0) +
    (maxPrice ? 1 : 0) +
    (inStock ? 1 : 0) +
    sizes.length +
    colors.length;

  function updateParams(mutate: (params: URLSearchParams) => void) {
    const params = new URLSearchParams(searchParams.toString());
    mutate(params);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  function handleSearchChange(value: string) {
    setSearchValue(value);
    if (searchDebounce.current) clearTimeout(searchDebounce.current);
    searchDebounce.current = setTimeout(() => {
      updateParams((params) => {
        if (value.trim()) params.set("search", value.trim());
        else params.delete("search");
      });
    }, 350);
  }

  function handleCategoryChange(value: string) {
    updateParams((params) => {
      if (value) params.set("category", value);
      else params.delete("category");
    });
  }

  function handleSortChange(value: string) {
    updateParams((params) => {
      if (value && value !== "featured") params.set("sort", value);
      else params.delete("sort");
    });
  }

  function handlePriceChange(kind: "minPrice" | "maxPrice", value: string) {
    updateParams((params) => {
      if (value) params.set(kind, value);
      else params.delete(kind);
    });
  }

  function handleSizeToggle(size: ProductSize) {
    updateParams((params) => {
      const next = toggleListParam(sizes, size);
      params.delete("sizes");
      next.forEach((s) => params.append("sizes", s));
    });
  }

  function handleColorToggle(color: string) {
    updateParams((params) => {
      const next = toggleListParam(colors, color);
      params.delete("colors");
      next.forEach((c) => params.append("colors", c));
    });
  }

  function handleInStockToggle() {
    updateParams((params) => {
      if (inStock) params.delete("inStock");
      else params.set("inStock", "true");
    });
  }

  function handleReset() {
    setSearchValue("");
    router.push(pathname, { scroll: false });
  }

  const panelContent = (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col gap-2">
        <Label htmlFor="filter-search">Search</Label>
        <Input
          id="filter-search"
          type="search"
          placeholder="Search products…"
          value={searchValue}
          onChange={(e) => handleSearchChange(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="filter-category">Category</Label>
        <Select
          id="filter-category"
          value={category}
          onChange={(e) => handleCategoryChange(e.target.value)}
        >
          <option value="">All categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-[#0A0A0A]">Price</span>
        <div className="flex items-center gap-3">
          <Input
            type="number"
            inputMode="numeric"
            min={0}
            placeholder="Min"
            aria-label="Minimum price in dollars"
            value={minPrice ? String(Number(minPrice) / 100) : ""}
            onChange={(e) =>
              handlePriceChange(
                "minPrice",
                e.target.value ? String(Math.round(Number(e.target.value) * 100)) : "",
              )
            }
          />
          <span className="text-[#0A0A0A]/40">–</span>
          <Input
            type="number"
            inputMode="numeric"
            min={0}
            placeholder="Max"
            aria-label="Maximum price in dollars"
            value={maxPrice ? String(Number(maxPrice) / 100) : ""}
            onChange={(e) =>
              handlePriceChange(
                "maxPrice",
                e.target.value ? String(Math.round(Number(e.target.value) * 100)) : "",
              )
            }
          />
        </div>
      </div>

      {availableSizes.length > 0 ? (
        <fieldset className="flex flex-col gap-2">
          <legend className="text-sm font-medium text-[#0A0A0A]">Size</legend>
          <div className="flex flex-wrap gap-2">
            {availableSizes.map((size) => (
              <button
                key={size}
                type="button"
                aria-pressed={sizes.includes(size)}
                onClick={() => handleSizeToggle(size)}
                className={cn(
                  "min-w-10 rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4D00]/50",
                  sizes.includes(size)
                    ? "border-[#0A0A0A] bg-[#0A0A0A] text-[#EDE6D6]"
                    : "border-[#0A0A0A]/20 text-[#0A0A0A] hover:border-[#0A0A0A]/50",
                )}
              >
                {size === "ONE_SIZE" ? "OS" : size}
              </button>
            ))}
          </div>
        </fieldset>
      ) : null}

      {availableColors.length > 0 ? (
        <fieldset className="flex flex-col gap-2">
          <legend className="text-sm font-medium text-[#0A0A0A]">Color</legend>
          <div className="flex flex-wrap gap-2.5">
            {availableColors.map(({ name, hex }) => (
              <button
                key={name}
                type="button"
                title={name}
                aria-label={name}
                aria-pressed={colors.includes(name.toLowerCase())}
                onClick={() => handleColorToggle(name.toLowerCase())}
                className={cn(
                  "flex size-8 items-center justify-center rounded-full ring-1 ring-[#0A0A0A]/15 transition-all",
                  colors.includes(name.toLowerCase()) &&
                    "ring-2 ring-offset-2 ring-[#FF4D00]",
                )}
              >
                <span
                  className="size-5 rounded-full ring-1 ring-inset ring-[#0A0A0A]/10"
                  style={{ backgroundColor: hex }}
                />
              </button>
            ))}
          </div>
        </fieldset>
      ) : null}

      <label className="flex items-center gap-2.5 text-sm text-[#0A0A0A]">
        <input
          type="checkbox"
          checked={inStock}
          onChange={handleInStockToggle}
          className="size-4 rounded border-[#0A0A0A]/30 text-[#FF4D00] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4D00]/50"
        />
        In stock only
      </label>

      {activeFilterCount > 0 ? (
        <Button type="button" variant="ghost" size="sm" onClick={handleReset} className="self-start">
          <X className="size-3.5" aria-hidden="true" />
          Clear filters
        </Button>
      ) : null}
    </div>
  );

  return (
    <>
      <div className="hidden lg:flex lg:flex-col lg:gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#0A0A0A]">
            Filters
          </h2>
          <div className="w-40">
            <Label htmlFor="filter-sort-desktop" className="sr-only">
              Sort by
            </Label>
            <Select
              id="filter-sort-desktop"
              value={sort}
              onChange={(e) => handleSortChange(e.target.value)}
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>
          </div>
        </div>
        <Separator />
        {panelContent}
      </div>

      <div className="flex items-center gap-3 lg:hidden">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setMobileOpen(true)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-filters-panel"
        >
          <SlidersHorizontal className="size-4" aria-hidden="true" />
          Filters
          {activeFilterCount > 0 ? (
            <span className="ml-1 flex size-4 items-center justify-center rounded-full bg-[#FF4D00] text-[10px] font-semibold text-white">
              {activeFilterCount}
            </span>
          ) : null}
        </Button>
        <div className="flex-1">
          <Label htmlFor="filter-sort-mobile" className="sr-only">
            Sort by
          </Label>
          <Select
            id="filter-sort-mobile"
            value={sort}
            onChange={(e) => handleSortChange(e.target.value)}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close filters"
            className="absolute inset-0 bg-[#0A0A0A]/50"
            onClick={() => setMobileOpen(false)}
          />
          <div
            id="mobile-filters-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Filters"
            className="absolute inset-y-0 left-0 flex w-full max-w-xs flex-col gap-6 overflow-y-auto bg-[#EDE6D6] p-6 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#0A0A0A]">
                Filters
              </h2>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Close filters"
                onClick={() => setMobileOpen(false)}
              >
                <X className="size-4" aria-hidden="true" />
              </Button>
            </div>
            {panelContent}
            <Button type="button" className="mt-auto" onClick={() => setMobileOpen(false)}>
              Show results
            </Button>
          </div>
        </div>
      ) : null}
    </>
  );
}
