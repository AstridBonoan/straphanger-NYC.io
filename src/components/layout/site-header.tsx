"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ShoppingBag, User, X } from "lucide-react";
import { BrandLogo } from "@/components/brand/brand-logo";
import { NavSearch } from "@/components/layout/nav-search";
import { Container } from "@/components/layout/container";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { CartSheet } from "@/components/cart/cart-sheet";
import { useCartStore } from "@/lib/cart/store";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

function useIsClient() {
  return React.useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );
}

export function SiteHeader() {
  const pathname = usePathname() ?? "";
  const isClient = useIsClient();
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const itemCount = useCartStore((state) =>
    state.lines.reduce((sum, line) => sum + line.quantity, 0),
  );
  const toggleCart = useCartStore((state) => state.toggleOpen);
  // Avoid hydration mismatch from zustand persist rehydrating after paint.
  const badgeCount = isClient ? itemCount : 0;

  React.useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 w-full border-b transition-all duration-300",
          scrolled
            ? "border-[#0A0A0A]/10 bg-[#EDE6D6]/85 backdrop-blur-md"
            : "border-transparent bg-[#EDE6D6]",
        )}
      >
        <Container className="flex h-16 items-center justify-between gap-4 sm:h-20">
          <Link
            href="/"
            className="inline-flex shrink-0 items-center"
            aria-label="Straphanger NYC home"
          >
            <BrandLogo
              variant="light"
              width={120}
              height={40}
              priority
              className="h-7 w-auto sm:h-8"
            />
          </Link>

          <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
            {NAV_LINKS.map((link) => {
              const active =
                pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-[#FF4D00]",
                    active ? "text-[#0A0A0A]" : "text-[#0A0A0A]/70",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <NavSearch className="hidden w-44 sm:flex md:w-52 lg:w-64" />
            <Link
              href="/account"
              aria-label="Account"
              className="hidden size-10 items-center justify-center rounded-md text-[#0A0A0A]/80 transition-colors hover:bg-[#0A0A0A]/5 hover:text-[#0A0A0A] sm:inline-flex"
            >
              <User className="size-[18px]" aria-hidden="true" />
            </Link>
            <button
              type="button"
              onClick={toggleCart}
              aria-label={`Open bag${badgeCount > 0 ? `, ${badgeCount} items` : ""}`}
              className="relative inline-flex size-10 items-center justify-center rounded-md text-[#0A0A0A]/80 transition-colors hover:bg-[#0A0A0A]/5 hover:text-[#0A0A0A]"
            >
              <ShoppingBag className="size-[18px]" aria-hidden="true" />
              {badgeCount > 0 ? (
                <span className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-[#FF4D00] text-[10px] font-semibold text-white">
                  {badgeCount > 9 ? "9+" : badgeCount}
                </span>
              ) : null}
            </button>
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              className="inline-flex size-10 items-center justify-center rounded-md text-[#0A0A0A]/80 transition-colors hover:bg-[#0A0A0A]/5 hover:text-[#0A0A0A] md:hidden"
            >
              <Menu className="size-[18px]" aria-hidden="true" />
            </button>
          </div>
        </Container>
      </header>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="flex w-full max-w-xs flex-col gap-6">
          <SheetHeader className="flex-row items-center justify-between space-y-0">
            <SheetTitle className="sr-only">Straphanger menu</SheetTitle>
            <BrandLogo variant="light" width={100} height={34} className="h-7 w-auto" />
          </SheetHeader>

          <NavSearch
            className="w-full"
            onNavigate={() => setMobileOpen(false)}
          />

          <nav className="flex flex-col gap-1" aria-label="Mobile">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-md px-3 py-3 text-base font-medium text-[#0A0A0A] transition-colors hover:bg-[#0A0A0A]/5"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/account"
              onClick={() => setMobileOpen(false)}
              className="rounded-md px-3 py-3 text-base font-medium text-[#0A0A0A] transition-colors hover:bg-[#0A0A0A]/5"
            >
              Account
            </Link>
          </nav>
          <Button
            variant="outline"
            className="mt-auto"
            onClick={() => setMobileOpen(false)}
          >
            <X className="size-4" aria-hidden="true" />
            Close menu
          </Button>
        </SheetContent>
      </Sheet>

      <CartSheet />
    </>
  );
}
