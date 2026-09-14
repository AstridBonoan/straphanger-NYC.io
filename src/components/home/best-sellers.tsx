import { getBestsellers } from "@/lib/products/queries";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/layout/section-heading";
import { ProductGrid } from "@/components/products/product-grid";
import { Reveal } from "@/components/motion/reveal";

export async function BestSellers() {
  const products = await getBestsellers(4);
  if (products.length === 0) return null;

  return (
    <section className="py-16 sm:py-24">
      <Container className="flex flex-col gap-10">
        <Reveal>
          <SectionHeading
            eyebrow="Always packed"
            title="Bestsellers"
            description="The pieces that keep selling out on the platform. Worn on repeat."
            cta={{ label: "Shop bestsellers", href: "/shop" }}
          />
        </Reveal>
        <ProductGrid products={products} />
      </Container>
    </section>
  );
}
