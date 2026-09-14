import { cn } from "@/lib/utils";
import { BRAND } from "@/lib/brand";

type BrandLogoProps = {
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  /** Dark mark on light backgrounds (nav). Light mark on dark sections. */
  variant?: "dark" | "light";
};

/** Straphanger wordmark — hanging strap + condensed type + NYC badge. */
export function BrandLogo({
  className,
  width = 220,
  height = 40,
  variant = "dark",
}: BrandLogoProps) {
  const onLight = variant === "light";
  const fill = onLight ? "#0A0A0A" : "#EDE6D6";
  const accent = "#FF4D00";

  return (
    <svg
      role="img"
      aria-label={BRAND.fullName}
      viewBox="0 0 430 72"
      width={width}
      height={height}
      className={cn("h-auto w-auto", className)}
    >
      <title>{BRAND.fullName}</title>
      <g fill="none">
        <rect x="6" y="10" width="40" height="5" rx="1" fill={fill} />
        <path d="M19 15v18" stroke={fill} strokeWidth="3.5" strokeLinecap="square" />
        <path d="M33 15v18" stroke={fill} strokeWidth="3.5" strokeLinecap="square" />
        <rect
          x="14"
          y="31"
          width="24"
          height="20"
          rx="10"
          stroke={fill}
          strokeWidth="3.5"
        />
      </g>
      <text
        x="58"
        y="48"
        fill={fill}
        fontFamily="Oswald, 'Arial Narrow', Impact, sans-serif"
        fontSize="34"
        fontWeight="700"
        letterSpacing="2.4"
      >
        STRAPHANGER
      </text>
      <rect x="352" y="24" width="68" height="26" fill={accent} />
      <text
        x="386"
        y="43"
        textAnchor="middle"
        fill="#0A0A0A"
        fontFamily="Oswald, 'Arial Narrow', Impact, sans-serif"
        fontSize="14"
        fontWeight="700"
        letterSpacing="2.5"
      >
        NYC
      </text>
    </svg>
  );
}
