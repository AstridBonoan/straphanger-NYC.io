import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans, Oswald } from "next/font/google";
import { BRAND } from "@/lib/brand";
import { getSiteUrl } from "@/lib/utils";
import "./globals.css";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${BRAND.fullName} — ${BRAND.tagline}`,
    template: `%s | ${BRAND.fullName}`,
  },
  description:
    "Straphanger NYC is New York streetwear merch for the ride between stops — heavyweight tees, delayed-train hoodies, and accessories packed for the platform.",
  keywords: [
    "Straphanger NYC",
    "New York streetwear",
    "NYC merch",
    "hoodies",
    "t-shirts",
    "subway streetwear",
  ],
  authors: [{ name: BRAND.fullName }],
  creator: BRAND.fullName,
  openGraph: {
    type: "website",
    siteName: BRAND.fullName,
    title: `${BRAND.fullName} — ${BRAND.tagline}`,
    description:
      "New York streetwear merch — tees, hoodies, and accessories for the ones who never sit.",
    url: siteUrl,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND.fullName} — ${BRAND.tagline}`,
    description:
      "New York streetwear merch — tees, hoodies, and accessories for the ones who never sit.",
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }, { url: "/favicon.ico" }],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${oswald.variable} ${ibmPlexSans.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-[#EDE6D6] text-[#0A0A0A]">
        {children}
      </body>
    </html>
  );
}
