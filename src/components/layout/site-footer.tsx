import Link from "next/link";
import { BrandLogo } from "@/components/brand/brand-logo";
import { Container } from "@/components/layout/container";
import { NewsletterForm } from "@/components/forms/newsletter-form";

const SHOP_LINKS = [
  { href: "/shop?category=t-shirts", label: "T-Shirts" },
  { href: "/shop?category=hoodies", label: "Hoodies" },
  { href: "/shop?category=shorts", label: "Shorts" },
  { href: "/shop?category=hats", label: "Hats" },
  { href: "/shop?category=accessories", label: "Accessories" },
];

const COMPANY_LINKS = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/shop", label: "Shop All" },
];

const SOCIAL_LINKS = [
  { href: "https://instagram.com", label: "Instagram", mark: "IG" },
  { href: "https://twitter.com", label: "Twitter / X", mark: "X" },
  { href: "https://youtube.com", label: "YouTube", mark: "YT" },
];

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#0A0A0A] text-[#EDE6D6]">
      <Container className="grid gap-12 py-16 sm:py-20 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div className="flex flex-col gap-4">
          <Link href="/" className="inline-flex w-fit" aria-label="Straphanger NYC home">
            <BrandLogo width={200} height={40} className="h-8 w-auto" />
          </Link>
          <p className="max-w-xs text-sm text-[#EDE6D6]/60">
            Hold on. We&rsquo;re moving. New York streetwear merch for the ride
            between stops.
          </p>
          <div className="flex items-center gap-3 pt-2">
            {SOCIAL_LINKS.map(({ href, label, mark }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex size-9 items-center justify-center rounded-full border border-[#EDE6D6]/15 text-[11px] font-semibold tracking-wide text-[#EDE6D6]/70 transition-colors hover:border-[#EDE6D6]/40 hover:text-[#EDE6D6]"
              >
                {mark}
              </a>
            ))}
          </div>
        </div>

        <nav aria-label="Shop">
          <h3 className="text-xs font-semibold uppercase tracking-[0.24em] text-[#EDE6D6]/50">
            Shop
          </h3>
          <ul className="mt-4 flex flex-col gap-3">
            {SHOP_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-sm text-[#EDE6D6]/75 transition-colors hover:text-[#EDE6D6]"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Company">
          <h3 className="text-xs font-semibold uppercase tracking-[0.24em] text-[#EDE6D6]/50">
            Company
          </h3>
          <ul className="mt-4 flex flex-col gap-3">
            {COMPANY_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-sm text-[#EDE6D6]/75 transition-colors hover:text-[#EDE6D6]"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-col gap-4">
          <h3 className="text-xs font-semibold uppercase tracking-[0.24em] text-[#EDE6D6]/50">
            Stay in the loop
          </h3>
          <p className="text-sm text-[#EDE6D6]/60">
            Night drops, restocks, and platform notes — no spam, unsubscribe anytime.
          </p>
          <NewsletterForm variant="compact" />
        </div>
      </Container>

      <div className="border-t border-[#EDE6D6]/10">
        <Container className="flex flex-col items-center justify-between gap-3 py-6 text-xs text-[#EDE6D6]/50 sm:flex-row">
          <p>&copy; {year} Straphanger NYC. Packed in Brooklyn.</p>
          <p>Stand clear of the closing doors.</p>
        </Container>
      </div>
    </footer>
  );
}
