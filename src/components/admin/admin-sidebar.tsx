"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Menu,
  LogOut,
  Home,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import {
  clearClientSession,
  type DemoSession,
} from "@/lib/auth/client-session";
import { useRouter } from "next/navigation";

const NAV_ITEMS = [
  { href: "/admin/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/products/", label: "Products", icon: Package },
  { href: "/admin/orders/", label: "Orders", icon: ShoppingBag },
  { href: "/admin/customers/", label: "Customers", icon: Users },
] as const;

function isActive(pathname: string, href: string, exact?: boolean) {
  const normalizedPath = pathname.endsWith("/") ? pathname : `${pathname}/`;
  const normalizedHref = href.endsWith("/") ? href : `${href}/`;
  if (exact) return normalizedPath === normalizedHref || pathname === href.replace(/\/$/, "");
  return normalizedPath === normalizedHref || normalizedPath.startsWith(normalizedHref);
}

function NavLinks({
  pathname,
  onNavigate,
  variant = "dark",
}: {
  pathname: string;
  onNavigate?: () => void;
  variant?: "dark" | "light";
}) {
  return (
    <nav className="flex flex-col gap-1" aria-label="Admin">
      {NAV_ITEMS.map((item) => {
        const active = isActive(pathname, item.href, "exact" in item && item.exact);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              active && "bg-[#FF4D00] text-white",
              !active &&
                variant === "dark" &&
                "text-[#EDE6D6]/70 hover:bg-white/10 hover:text-[#EDE6D6]",
              !active &&
                variant === "light" &&
                "text-[#0A0A0A]/70 hover:bg-[#0A0A0A]/5 hover:text-[#0A0A0A]",
            )}
          >
            <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarFooter({
  session,
  variant = "dark",
}: {
  session: DemoSession;
  variant?: "dark" | "light";
}) {
  const router = useRouter();
  return (
    <div className="space-y-3 border-t border-white/10 pt-4">
      <div className={cn("px-3 text-xs", variant === "dark" ? "text-[#EDE6D6]/60" : "text-[#0A0A0A]/60")}>
        <p className="font-medium text-inherit opacity-100">{session.name}</p>
        <p className="truncate">{session.email}</p>
      </div>
      <Button
        type="button"
        variant="ghost"
        className={cn(
          "w-full justify-start gap-2",
          variant === "dark" && "text-[#EDE6D6]/80 hover:bg-white/10 hover:text-white",
        )}
        onClick={() => {
          clearClientSession();
          router.push("/login/");
        }}
      >
        <LogOut className="h-4 w-4" aria-hidden="true" />
        Sign out
      </Button>
      <Link
        href="/"
        className={cn(
          "flex items-center gap-2 px-3 text-sm",
          variant === "dark" ? "text-[#EDE6D6]/60 hover:text-white" : "text-[#0A0A0A]/60",
        )}
      >
        <Home className="h-4 w-4" aria-hidden="true" />
        Back to store
      </Link>
    </div>
  );
}

export function AdminSidebar({ session }: { session: DemoSession }) {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <aside className="hidden w-64 shrink-0 flex-col bg-[#0A0A0A] text-[#EDE6D6] lg:flex">
        <div className="flex h-full flex-col gap-6 px-4 py-6">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#EDE6D6]/40">Admin</p>
            <p className="mt-1 font-display text-lg font-semibold">Straphanger</p>
          </div>
          <NavLinks pathname={pathname} />
          <div className="mt-auto">
            <SidebarFooter session={session} />
          </div>
        </div>
      </aside>

      <div className="flex items-center justify-between border-b border-[#0A0A0A]/10 bg-white px-4 py-3 lg:hidden">
        <p className="font-display text-base font-semibold">Admin</p>
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Open admin menu"
          onClick={() => setOpen(true)}
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-[280px] bg-[#0A0A0A] p-0 text-[#EDE6D6]">
          <SheetTitle className="sr-only">Admin navigation</SheetTitle>
          <div className="flex h-full flex-col gap-6 px-4 py-6">
            <p className="font-display text-lg font-semibold">Straphanger</p>
            <NavLinks pathname={pathname} onNavigate={() => setOpen(false)} />
            <div className="mt-auto">
              <SidebarFooter session={session} />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
