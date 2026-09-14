import { formatPrice, FREE_SHIPPING_THRESHOLD_CENTS } from "@/lib/products/pricing";

export function PromoBanner() {
  return (
    <div className="border-b border-[#EDE6D6]/10 bg-[#FF4D00] py-2.5 text-center text-xs font-medium tracking-wide text-[#EDE6D6] sm:text-sm">
      Free shipping over {formatPrice(FREE_SHIPPING_THRESHOLD_CENTS)} · Packed in Brooklyn · 30-day returns
    </div>
  );
}
