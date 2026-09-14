import type { Metadata } from "next";
import { ShopPageClient } from "@/components/products/shop-page-client";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Browse the full Straphanger NYC drop — tees, hoodies, hats, and accessories built for the platform.",
};

export default function ShopPage() {
  return <ShopPageClient />;
}
