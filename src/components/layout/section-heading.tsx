import * as React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  cta?: { label: string; href: string };
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  cta,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center"
          ? "items-center text-center"
          : "items-start justify-between gap-6 sm:flex-row sm:items-end",
        className,
      )}
    >
      <div className={cn("flex flex-col gap-3", align === "center" && "items-center")}>
        {eyebrow ? (
          <span className="text-xs font-semibold uppercase tracking-[0.28em] text-[#FF4D00]">
            {eyebrow}
          </span>
        ) : null}
        <h2 className="font-display text-3xl font-bold tracking-tight text-[#0A0A0A] sm:text-4xl">
          {title}
        </h2>
        {description ? (
          <p className="max-w-xl text-balance text-base text-[#0A0A0A]/65">
            {description}
          </p>
        ) : null}
      </div>
      {cta ? (
        <Link
          href={cta.href}
          className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-[#0A0A0A] transition-colors hover:text-[#FF4D00] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4D00]/50 focus-visible:ring-offset-2 rounded-sm"
        >
          {cta.label}
          <ArrowUpRight
            className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden="true"
          />
        </Link>
      ) : null}
    </div>
  );
}
