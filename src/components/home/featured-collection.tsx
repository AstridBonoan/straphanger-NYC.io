import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getProducts } from "@/lib/products/queries";
import { formatPrice } from "@/lib/products/pricing";
import { Container } from "@/components/layout/container";
import { ProductImage } from "@/components/products/product-image";
import { buttonVariants } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";

export async function FeaturedCollection() {
  const [spotlight] = await getProducts({
    category: "hoodies",
    sort: "featured",
    limit: 1,
  });
  if (!spotlight) return null;

  const image = spotlight.images?.find((img) => img.is_primary) ?? spotlight.images?.[0];

  return (
    <section className="bg-[#0A0A0A] py-16 text-[#EDE6D6] sm:py-24">
      <Container className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
        <Reveal className="relative aspect-[4/5] overflow-hidden rounded-xl lg:order-2">
          {image ? (
            <ProductImage
              src={image.url}
              alt={image.alt}
              fallbackLabel="SH"
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
          ) : null}
        </Reveal>
        <Reveal delay={100} className="flex flex-col gap-6 lg:order-1">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#FF4D00]">
            Tunnel Season
          </span>
          <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Delayed hoodies
          </h2>
          <p className="max-w-md text-[#EDE6D6]/70">
            Fleece cut for the platform. Worn from the last stop to last call —
            roomy hood, kangaroo pocket, built to outlast the delay.
          </p>
          <div className="flex items-baseline gap-3">
            <span className="text-lg font-semibold">
              {formatPrice(spotlight.price_cents)}
            </span>
            <span className="text-sm text-[#EDE6D6]/50">{spotlight.name}</span>
          </div>
          <Link
            href="/shop?category=hoodies"
            className={buttonVariants({
              variant: "secondary",
              size: "lg",
              className: "self-start bg-[#FF4D00] text-[#0A0A0A] hover:bg-[#FF4D00]/90",
            })}
          >
            Shop the tunnel
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </Reveal>
      </Container>
    </section>
  );
}
