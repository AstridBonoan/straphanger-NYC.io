import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BrandLogo } from "@/components/brand/brand-logo";
import { Container } from "@/components/layout/container";
import { buttonVariants } from "@/components/ui/button";
import { BRAND } from "@/lib/brand";

export function Hero() {
  return (
    <section className="relative flex min-h-[calc(100svh-4rem)] items-end overflow-hidden bg-[#0A0A0A] text-[#EDE6D6] sm:min-h-[calc(100svh-5rem)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,77,0,0.4),_transparent_55%),radial-gradient(ellipse_at_bottom_left,_rgba(255,77,0,0.18),_transparent_50%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(#EDE6D6_1px,transparent_1px),linear-gradient(90deg,#EDE6D6_1px,transparent_1px)] [background-size:48px_48px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 top-10 hidden h-64 w-64 rotate-12 border-[10px] border-[#FF4D00] opacity-30 sm:block"
      />

      <Container className="relative flex w-full flex-col gap-8 pb-16 pt-32 sm:pb-20 sm:pt-40">
        <span className="animate-fade-up text-xs font-semibold uppercase tracking-[0.32em] text-[#FF4D00]">
          Drop 07 — Canal / Delancey
        </span>
        <h1 className="animate-fade-up animate-delay-100 sr-only">{BRAND.fullName}</h1>
        <div className="animate-fade-up animate-delay-100 w-full max-w-3xl">
          <BrandLogo width={960} height={320} priority className="h-auto w-full" />
        </div>
        <div className="animate-fade-up animate-delay-200 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <p className="max-w-md text-lg text-[#EDE6D6]/75 sm:text-xl">
            {BRAND.tagline} Streetwear merch for the ones hanging from the bar
            at 8am and 2am.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/shop"
              className={buttonVariants({
                variant: "secondary",
                size: "lg",
                className: "bg-[#FF4D00] text-[#0A0A0A] hover:bg-[#FF4D00]/90",
              })}
            >
              Shop the drop
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link
              href="/about"
              className={buttonVariants({
                variant: "outline",
                size: "lg",
                className:
                  "border-[#EDE6D6]/30 bg-transparent text-[#EDE6D6] hover:bg-[#EDE6D6]/10",
              })}
            >
              The origin stop
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
