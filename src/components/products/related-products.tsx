import type { Product } from "@/types";
import { getProducts } from "@/lib/products/queries";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/layout/section-heading";
import { ProductGrid } from "@/components/products/product-grid";

export interface RelatedProductsProps {
  product: Product;
  limit?: number;
}

export async function RelatedProducts({ product, limit = 4 }: RelatedProductsProps) {
  const categorySlug = product.category?.slug;
  const candidates = await getProducts({
    category: categorySlug,
    limit: limit + 1,
  });
  const related = candidates.filter((p) => p.id !== product.id).slice(0, limit);

  if (related.length === 0) return null;

  return (
    <section className="border-t border-[#0A0A0A]/10 py-16 sm:py-20">
      <Container className="flex flex-col gap-10">
        <SectionHeading eyebrow="Keep exploring" title="You may also like" />
        <ProductGrid products={related} />
      </Container>
    </section>
  );
}
