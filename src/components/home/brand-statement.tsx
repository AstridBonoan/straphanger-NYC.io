import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";

const STATS = [
  { value: "2019", label: "Founded" },
  { value: "16", label: "Core Styles" },
  { value: "5", label: "Boroughs" },
  { value: "BK", label: "Packed Here" },
];

export function BrandStatement() {
  return (
    <section className="py-16 sm:py-24">
      <Container className="flex flex-col items-center gap-12 text-center">
        <Reveal className="flex max-w-2xl flex-col gap-6">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#FF4D00]">
            The Statement
          </span>
          <p className="font-display text-2xl font-semibold leading-snug tracking-tight text-[#0A0A0A] sm:text-3xl">
            Straphanger isn&rsquo;t a souvenir. It&rsquo;s the uniform for people
            hanging from the bar — between boroughs, between jobs, between last
            call and the first train home.
          </p>
        </Reveal>
        <Reveal
          delay={100}
          className="grid w-full max-w-3xl grid-cols-2 gap-8 border-t border-[#0A0A0A]/10 pt-10 sm:grid-cols-4"
        >
          {STATS.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1.5">
              <span className="font-display text-3xl font-bold text-[#0A0A0A] sm:text-4xl">
                {stat.value}
              </span>
              <span className="text-xs font-medium uppercase tracking-wide text-[#0A0A0A]/50">
                {stat.label}
              </span>
            </div>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
