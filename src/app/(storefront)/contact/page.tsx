import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { Container } from "@/components/layout/container";
import { ContactForm } from "@/components/contact/contact-form";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Straphanger NYC — order questions, wholesale, and general support from Canal Street.",
};

const CONTACT_DETAILS = [
  { Icon: Mail, label: BRAND.email, href: `mailto:${BRAND.email}` },
  { Icon: Phone, label: BRAND.phone, href: "tel:+12125550187" },
  { Icon: MapPin, label: BRAND.address, href: undefined },
];

export default function ContactPage() {
  return (
    <div className="py-16 sm:py-24">
      <Container className="grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
        <div className="flex flex-col gap-6">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#FF4D00]">
            Hit us up
          </span>
          <h1 className="font-display text-3xl font-bold tracking-tight text-[#0A0A0A] sm:text-4xl">
            The line is open
          </h1>
          <p className="text-[#0A0A0A]/65">
            Order questions, wholesale, or you just saw the mark on the J train —
            write in. A real person on a small team will get back to you.
          </p>
          <ul className="flex flex-col gap-4">
            {CONTACT_DETAILS.map(({ Icon, label, href }) => (
              <li key={label} className="flex items-center gap-3 text-sm text-[#0A0A0A]/75">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#0A0A0A]/[0.06] text-[#FF4D00]">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                {href ? (
                  <a href={href} className="transition-colors hover:text-[#0A0A0A]">
                    {label}
                  </a>
                ) : (
                  <span>{label}</span>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-[#0A0A0A]/10 p-6 sm:p-10">
          <ContactForm />
        </div>
      </Container>
    </div>
  );
}
