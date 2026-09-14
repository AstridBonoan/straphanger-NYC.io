"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { withBasePath } from "@/lib/paths";
import { cn } from "@/lib/utils";

type NavSearchProps = {
  className?: string;
  inputClassName?: string;
  autoFocus?: boolean;
  onNavigate?: () => void;
};

function buildShopSearchHref(query: string, currentSearch: string, onShop: boolean) {
  const params = onShop
    ? new URLSearchParams(currentSearch)
    : new URLSearchParams();

  const q = query.trim();
  if (q) params.set("search", q);
  else params.delete("search");

  const qs = params.toString();
  return qs ? `/shop/?${qs}` : "/shop/";
}

/**
 * Header search without useSearchParams — avoids Suspense CSR bailouts that
 * can crash Next's global error UI on static GitHub Pages navigations.
 */
export function NavSearch({
  className,
  inputClassName,
  autoFocus,
  onNavigate,
}: NavSearchProps) {
  const pathname = usePathname();
  const inputId = React.useId();
  const onShop =
    pathname === "/shop" ||
    pathname === "/shop/" ||
    pathname.startsWith("/shop/");

  const [value, setValue] = React.useState("");

  function goToResults(rawQuery: string) {
    const currentSearch =
      typeof window !== "undefined" ? window.location.search : "";
    const href = buildShopSearchHref(rawQuery, currentSearch, onShop);
    window.location.assign(withBasePath(href));
    onNavigate?.();
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    goToResults(value);
  }

  return (
    <form
      role="search"
      onSubmit={submit}
      className={cn("relative flex min-w-0 items-center", className)}
    >
      <label htmlFor={inputId} className="sr-only">
        Search products
      </label>
      <input
        id={inputId}
        type="search"
        name="search"
        value={value}
        autoFocus={autoFocus}
        autoComplete="off"
        placeholder="Search merch…"
        onChange={(event) => setValue(event.target.value)}
        className={cn(
          "h-10 w-full rounded-md border border-[#0A0A0A]/15 bg-white py-2 pl-3 pr-10 text-sm text-[#0A0A0A] outline-none transition-colors placeholder:text-[#0A0A0A]/40 focus-visible:border-[#FF4D00]/50 focus-visible:ring-2 focus-visible:ring-[#FF4D00]/30",
          inputClassName,
        )}
      />
      <button
        type="submit"
        aria-label="Search"
        className="absolute right-1 inline-flex size-8 items-center justify-center rounded-md text-[#0A0A0A]/55 transition-colors hover:bg-[#0A0A0A]/5 hover:text-[#0A0A0A]"
      >
        <Search className="size-4" aria-hidden="true" />
      </button>
    </form>
  );
}
