import { getFeaturedProducts } from "@/lib/products/queries";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/layout/section-heading";
import { ProductGrid } from "@/components/products/product-grid";
import { Reveal } from "@/components/motion/reveal";

export async function FeaturedProducts() {
  const products = await getFeaturedProducts(8);
  if (products.length === 0) return null;

  return (
    <section className="py-16 sm:py-24">
      <Container className="flex flex-col gap-10">
        <Reveal>
          <SectionHeading
            eyebrow="Platform staples"
            title="Featured pieces"
            description="The core lineup — tees, hoodies, and caps cut for the city, not the lookbook."
            cta={{ label: "Shop all", href: "/shop" }}
          />
        </Reveal>
        <ProductGrid products={products} priorityCount={4} />
      </Container>
    </section>
  );
}
