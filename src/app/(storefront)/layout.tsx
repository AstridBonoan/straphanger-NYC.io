import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

/**
 * Storefront chrome (header/nav/footer) scoped to customer-facing routes
 * only. Kept out of the root layout so `/admin` and `/login` can render
 * their own distinct chrome instead of the marketing site's header/footer.
 */
export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-[#0A0A0A] focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-[#EDE6D6]"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
