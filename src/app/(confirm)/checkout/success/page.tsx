import type { Metadata } from "next";
import Script from "next/script";
import { Container } from "@/components/layout/container";
import { buttonVariants } from "@/components/ui/button";
import { CHECKOUT_SUCCESS_STORAGE_KEY } from "@/lib/checkout/success-storage";
import { getBasePath } from "@/lib/paths";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Order confirmed",
  robots: { index: false, follow: false },
};

/**
 * Static confirmation page for GitHub Pages.
 * No "use client" and no ?query params — both have crashed Next hydration here.
 * afterInteractive script fills values from sessionStorage after hydrate.
 */
export default function CheckoutSuccessPage() {
  const basePath = getBasePath();
  const fillScript = `
(function () {
  try {
    var key = ${JSON.stringify(CHECKOUT_SUCCESS_STORAGE_KEY)};
    var raw = sessionStorage.getItem(key);
    var base = ${JSON.stringify(basePath)};
    var orderEl = document.getElementById("cs-order");
    var refEl = document.getElementById("cs-ref");
    var emailEl = document.getElementById("cs-email");
    var totalEl = document.getElementById("cs-total");
    var msgEl = document.getElementById("cs-msg");
    var viewEl = document.getElementById("cs-view-order");
    if (!raw) return;
    var data = JSON.parse(raw);
    function money(cents) {
      try {
        return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format((Number(cents) || 0) / 100);
      } catch (e) {
        return "$" + ((Number(cents) || 0) / 100).toFixed(2);
      }
    }
    if (orderEl && data.orderId) orderEl.textContent = String(data.orderId);
    if (refEl && data.sessionId) refEl.textContent = String(data.sessionId);
    if (emailEl && data.email) emailEl.textContent = String(data.email);
    if (totalEl && data.totalCents != null) totalEl.textContent = money(data.totalCents);
    if (msgEl) {
      msgEl.textContent = data.isDemo
        ? "Demo payment completed. Your order is saved in this browser — no real charge was made."
        : "Thank you — your order confirmation is ready.";
    }
    if (viewEl && data.orderId) {
      var orderHref = base + "/order/#id=" + encodeURIComponent(String(data.orderId));
      viewEl.setAttribute("href", orderHref);
      viewEl.onclick = function (event) {
        event.preventDefault();
        window.location.assign(orderHref);
      };
    }
  } catch (e) {}
})();`;

  return (
    <Container className="py-16 md:py-24">
      <div className="mx-auto max-w-lg text-center">
        <svg
          className="mx-auto size-14 text-[#FF4D00]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="m9 12 2 2 4-4" />
        </svg>
        <h1 className="mt-6 font-display text-3xl font-bold tracking-tight md:text-4xl">
          Payment successful
        </h1>
        <p id="cs-msg" className="mt-3 text-sm text-[#0A0A0A]/65">
          Demo payment completed. Your order is saved in this browser — no real
          charge was made.
        </p>

        <dl className="mt-8 space-y-3 rounded-2xl border border-[#0A0A0A]/10 bg-white px-6 py-5 text-left text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-[#0A0A0A]/55">Order</dt>
            <dd id="cs-order" className="truncate font-medium" suppressHydrationWarning>
              —
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-[#0A0A0A]/55">Payment ref</dt>
            <dd id="cs-ref" className="truncate font-medium" suppressHydrationWarning>
              —
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-[#0A0A0A]/55">Email</dt>
            <dd id="cs-email" className="font-medium" suppressHydrationWarning>
              —
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-[#0A0A0A]/55">Total paid</dt>
            <dd
              id="cs-total"
              className="font-medium tabular-nums"
              suppressHydrationWarning
            >
              —
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-[#0A0A0A]/55">Status</dt>
            <dd className="font-medium capitalize">paid</dd>
          </div>
        </dl>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <a
            id="cs-view-order"
            href={`${basePath}/order/`}
            className={cn(buttonVariants())}
          >
            View order
          </a>
          <a
            href={`${basePath}/shop/`}
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Continue shopping
          </a>
        </div>
      </div>

      <Script
        id="checkout-success-fill"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: fillScript }}
      />
    </Container>
  );
}
