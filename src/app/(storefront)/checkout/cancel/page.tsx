import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Checkout cancelled",
  robots: { index: false, follow: false },
};

export default function CheckoutCancelPage() {
  return (
    <Container className="py-16 md:py-24">
      <div className="mx-auto max-w-lg text-center">
        <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
          Checkout cancelled
        </h1>
        <p className="mt-3 text-sm text-[#0A0A0A]/65">
          Your payment was not completed. Your bag is still available if you want
          to try again.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/checkout" className={cn(buttonVariants())}>
            Return to checkout
          </Link>
          <Link href="/cart" className={cn(buttonVariants({ variant: "outline" }))}>
            View cart
          </Link>
        </div>
      </div>
    </Container>
  );
}
