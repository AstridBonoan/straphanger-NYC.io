import type { Metadata } from "next";
import { CheckoutFormWithSession } from "@/components/checkout/checkout-form-with-session";
import { Container } from "@/components/layout/container";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Secure checkout for Straphanger NYC.",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <Container className="py-10 md:py-16">
      <div className="mb-8 md:mb-12">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#FF4D00]">
          Checkout
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight md:text-4xl">
          Complete your order
        </h1>
        <p className="mt-2 max-w-xl text-sm text-[#0A0A0A]/60">
          Enter shipping details and pay with a Stripe test card. On GitHub Pages
          this runs a secure demo payment in your browser — no real charges.
        </p>
      </div>
      <CheckoutFormWithSession />
    </Container>
  );
}
