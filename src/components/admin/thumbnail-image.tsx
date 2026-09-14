"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { withBasePath } from "@/lib/paths";

const FALLBACK_SRC = "/images/placeholder.svg";

export interface ThumbnailImageProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
  size?: number;
}

/** Product/order thumbnail that quietly falls back to a placeholder if the seed asset 404s. */
export function ThumbnailImage({ src, alt, className, size = 40 }: ThumbnailImageProps) {
  const [errored, setErrored] = React.useState(false);
  const resolvedSrc = withBasePath(!src || errored ? FALLBACK_SRC : src);

  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-md bg-[#0A0A0A]/5",
        className,
      )}
      style={{ width: size, height: size }}
    >
      <Image
        src={resolvedSrc}
        alt={alt}
        fill
        sizes={`${size}px`}
        unoptimized
        className={cn(
          "object-cover",
          resolvedSrc.endsWith("placeholder.svg") && "object-contain p-1.5 opacity-40",
        )}
        onError={() => setErrored(true)}
      />
    </div>
  );
}
