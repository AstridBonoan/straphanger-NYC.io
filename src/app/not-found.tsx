import Link from "next/link";
import { Container } from "@/components/layout/container";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <Container className="flex flex-col items-center gap-6 py-32 text-center">
      <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#FF4D00]">
        404
      </span>
      <h1 className="font-display text-4xl font-bold tracking-tight text-[#0A0A0A] sm:text-5xl">
        Page not found
      </h1>
      <p className="max-w-md text-sm text-[#0A0A0A]/60">
        The page you&rsquo;re looking for doesn&rsquo;t exist or has moved. Last
        stop — let&rsquo;s get you back on the train.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/" className={buttonVariants({ size: "lg" })}>
          Back home
        </Link>
        <Link href="/shop" className={buttonVariants({ variant: "outline", size: "lg" })}>
          Shop all
        </Link>
      </div>
    </Container>
  );
}
