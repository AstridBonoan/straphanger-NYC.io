import Link from "next/link";
import { BrandLogo } from "@/components/brand/brand-logo";

/**
 * Minimal chrome for post-checkout confirmation.
 * Avoids SiteHeader/CartSheet client trees that were crashing hydration on
 * GitHub Pages and replacing the page with Next's global error UI.
 */
export default function ConfirmLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-col bg-[#EDE6D6] text-[#0A0A0A]">
      <header className="border-b border-[#0A0A0A]/10 bg-[#EDE6D6]">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center px-5 sm:h-20 sm:px-8 lg:px-10">
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
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
