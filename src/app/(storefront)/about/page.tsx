import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/layout/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: "About",
  description:
    "The story behind Straphanger NYC — New York streetwear merch born between subway stops.",
};

const VALUES = [
  {
    title: "Built for the ride",
    body: "Cut for standing room only. Midweight jersey, brushed fleece, and hardware that survives the crush of a delayed 6 train.",
  },
  {
    title: "Neighborhood graphics",
    body: "Marks pulled from walk-up doors, bodega awnings, and platform signage — printed like they were wheat-pasted overnight.",
  },
  {
    title: "Small-batch, five boroughs",
    body: "Limited runs packed in Brooklyn. If it can't take a season of sidewalks, it doesn't ship.",
  },
];

const TIMELINE = [
  {
    year: "2019",
    title: "Walk-up press",
    body: "Two friends, a Ridgewood walk-up, and a first run of Canal Street tees sold off a folding table after last call.",
  },
  {
    year: "2021",
    title: "Platform uniform",
    body: "The lineup tightened: tees, delayed-train hoodies, six-panel caps. Worn from the turnstile to the stoop.",
  },
  {
    year: "2023",
    title: "City shorthand",
    body: "Straphanger became the word for a certain kind of New Yorker — hanging on, moving anyway.",
  },
  {
    year: "2026",
    title: "Still standing",
    body: "Still small on purpose. Sixteen core styles, packed in BK, made for the people who never sit.",
  },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      <section className="border-b border-[#0A0A0A]/10 bg-[#0A0A0A] py-20 text-[#EDE6D6] sm:py-28">
        <Container className="flex max-w-3xl flex-col gap-6">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#FF4D00]">
            Origin stop
          </span>
          <h1 className="font-display text-4xl font-bold tracking-tight sm:text-6xl">
            {BRAND.tagline}
          </h1>
          <p className="text-lg text-[#EDE6D6]/70">
            {BRAND.fullName} makes New York streetwear merch for people who treat
            the city like a contact sport — then get back on the train.
          </p>
        </Container>
      </section>

      <section className="py-16 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal className="flex flex-col gap-5">
            <h2 className="font-display text-2xl font-bold tracking-tight text-[#0A0A0A] sm:text-3xl">
              Designed between stops
            </h2>
            <p className="text-[#0A0A0A]/70">
              We started Straphanger because most merch felt like a souvenir, not
              a uniform. Fast fashion fell apart on the first wash. Limited drops
              never left the closet. We wanted clothes that could take the
              platform, the stoop, and a 2am bodega run — and still look like they
              belonged on Canal.
            </p>
            <p className="text-[#0A0A0A]/70">
              That same rule still runs the shop: sixteen core styles, small
              batches, graphics that read like the city, and fabric that holds
              after fifty rides.
            </p>
          </Reveal>
          <Reveal delay={100} className="flex flex-col gap-6">
            {VALUES.map((value) => (
              <div key={value.title} className="border-l-2 border-[#FF4D00] pl-5">
                <h3 className="text-base font-semibold text-[#0A0A0A]">{value.title}</h3>
                <p className="mt-1.5 text-sm text-[#0A0A0A]/65">{value.body}</p>
              </div>
            ))}
          </Reveal>
        </Container>
      </section>

      <section className="border-t border-[#0A0A0A]/10 bg-[#0A0A0A]/[0.03] py-16 sm:py-24">
        <Container className="flex flex-col gap-10">
          <Reveal>
            <SectionHeading eyebrow="Since 2019" title="How we got here" align="left" />
          </Reveal>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {TIMELINE.map((item, index) => (
              <Reveal
                key={item.year}
                delay={index * 100}
                className="flex flex-col gap-2 border-t-2 border-[#0A0A0A] pt-4"
              >
                <span className="font-display text-2xl font-bold text-[#0A0A0A]">
                  {item.year}
                </span>
                <h3 className="text-sm font-semibold text-[#0A0A0A]">{item.title}</h3>
                <p className="text-sm text-[#0A0A0A]/60">{item.body}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
