import Link from "next/link";
import { Container } from "@/components/layout/container";
import { buttonVariants } from "@/components/ui/button";

export default function ProductNotFound() {
  return (
    <Container className="flex flex-col items-center gap-6 py-32 text-center">
      <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#FF4D00]">
        404
      </span>
      <h1 className="font-display text-3xl font-bold tracking-tight text-[#0A0A0A] sm:text-4xl">
        We couldn&rsquo;t find that piece
      </h1>
      <p className="max-w-md text-sm text-[#0A0A0A]/60">
        It may have sold out or left the platform. Hit the shop for the next drop.
      </p>
      <Link href="/shop" className={buttonVariants({ size: "lg" })}>
        Back to shop
      </Link>
    </Container>
  );
}
