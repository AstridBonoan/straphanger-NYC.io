import type {
  Category,
  Product,
  ProductImage,
  ProductSize,
  ProductVariant,
} from "@/types";

const now = "2026-01-15T12:00:00.000Z";

export const categories: Category[] = [
  {
    id: "cat-tshirts",
    name: "T-Shirts",
    slug: "t-shirts",
    description: "Tees cut for the crush — Canal graphics, midweight jersey, no souvenir energy.",
    image_url: "/images/categories/t-shirts.jpg",
    sort_order: 1,
    created_at: now,
    updated_at: now,
  },
  {
    id: "cat-hoodies",
    name: "Hoodies",
    slug: "hoodies",
    description: "Fleece for delayed trains and last-call walk-ups.",
    image_url: "/images/categories/hoodies.jpg",
    sort_order: 2,
    created_at: now,
    updated_at: now,
  },
  {
    id: "cat-hats",
    name: "Hats",
    slug: "hats",
    description: "Caps and beanies with platform embroidery and stoop energy.",
    image_url: "/images/categories/hats.jpg",
    sort_order: 3,
    created_at: now,
    updated_at: now,
  },
  {
    id: "cat-accessories",
    name: "Accessories",
    slug: "accessories",
    description: "Bodega totes, metro lanyards, and the small goods that finish the uniform.",
    image_url: "/images/categories/accessories.jpg",
    sort_order: 4,
    created_at: now,
    updated_at: now,
  },
  {
    id: "cat-shorts",
    name: "Shorts",
    slug: "shorts",
    description: "Boardwalk shorts for the days the subway feels like a sauna.",
    image_url: "/images/categories/accessories.jpg",
    sort_order: 5,
    created_at: now,
    updated_at: now,
  },
];

type VariantSeed = {
  size: ProductSize;
  color: string;
  colorHex: string;
  sku: string;
  inventory: number;
  priceCents?: number | null;
};

type ProductSeed = {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string;
  priceCents: number;
  compareAtCents?: number | null;
  isFeatured?: boolean;
  isBestseller?: boolean;
  isNew?: boolean;
  isActive?: boolean;
  tags?: string[];
  images: Array<{ url: string; alt: string; primary?: boolean }>;
  variants: VariantSeed[];
  createdAt?: string;
};

function buildProduct(seed: ProductSeed): Product {
  const created = seed.createdAt ?? now;
  const images: ProductImage[] = seed.images.map((img, index) => ({
    id: `${seed.id}-img-${index + 1}`,
    product_id: seed.id,
    url: img.url,
    alt: img.alt,
    sort_order: index,
    is_primary: img.primary ?? index === 0,
    created_at: created,
  }));

  const variants: ProductVariant[] = seed.variants.map((v, index) => ({
    id: `${seed.id}-var-${index + 1}`,
    product_id: seed.id,
    sku: v.sku,
    size: v.size,
    color: v.color,
    color_hex: v.colorHex,
    price_cents: v.priceCents ?? null,
    compare_at_cents: null,
    inventory_quantity: v.inventory,
    is_active: true,
    created_at: created,
    updated_at: created,
  }));

  const category = categories.find((c) => c.id === seed.categoryId) ?? null;

  return {
    id: seed.id,
    category_id: seed.categoryId,
    name: seed.name,
    slug: seed.slug,
    description: seed.description,
    price_cents: seed.priceCents,
    compare_at_cents: seed.compareAtCents ?? null,
    is_featured: seed.isFeatured ?? false,
    is_bestseller: seed.isBestseller ?? false,
    is_new: seed.isNew ?? false,
    is_active: seed.isActive ?? true,
    tags: seed.tags ?? [],
    created_at: created,
    updated_at: created,
    category,
    images,
    variants,
  };
}

const apparelSizes: ProductSize[] = ["S", "M", "L", "XL", "XXL"];

function apparelVariants(
  skuPrefix: string,
  colors: Array<{ name: string; hex: string }>,
  inventory = 40,
): VariantSeed[] {
  const variants: VariantSeed[] = [];
  for (const color of colors) {
    for (const size of apparelSizes) {
      const colorCode = color.name.replace(/\s+/g, "").toUpperCase().slice(0, 3);
      variants.push({
        size,
        color: color.name,
        colorHex: color.hex,
        sku: `${skuPrefix}-${colorCode}-${size}`,
        inventory: size === "XXL" ? Math.max(8, Math.floor(inventory / 2)) : inventory,
      });
    }
  }
  return variants;
}

const productSeeds: ProductSeed[] = [
  {
    id: "prod-classic-tee",
    categoryId: "cat-tshirts",
    name: "Canal Street Tee",
    slug: "canal-street-tee",
    description:
      "Flagship midweight jersey with a wheat-paste Canal mark. Reinforced shoulders, slightly relaxed, built to survive the 6 train crush.",
    priceCents: 3200,
    isFeatured: true,
    isBestseller: true,
    tags: ["essentials", "cotton"],
    images: [
      {
        url: "/images/products/classic-tee-front.png",
        alt: "Canal Street Tee front view in black",
        primary: true,
      },
      {
        url: "/images/products/classic-tee-back.png",
        alt: "Canal Street Tee back view",
      },
    ],
    variants: apparelVariants("SH-CT", [
      { name: "Black", hex: "#0A0A0A" },
      { name: "Concrete", hex: "#EDE6D6" },
      { name: "Signal", hex: "#FF4D00" },
    ]),
  },
  {
    id: "prod-essential-tee",
    categoryId: "cat-tshirts",
    name: "Walk-Up Tee",
    slug: "walk-up-tee",
    description:
      "Lighter everyday tee for five-floor walk-ups. Soft hand, tidy rib collar, the quiet workhorse under a fire-escape jacket.",
    priceCents: 2800,
    isBestseller: true,
    tags: ["essentials", "lightweight"],
    images: [
      {
        url: "/images/products/essential-tee-front.png",
        alt: "Walk-Up Tee in concrete",
        primary: true,
      },
    ],
    variants: apparelVariants(
      "SH-ET",
      [
        { name: "Concrete", hex: "#EDE6D6" },
        { name: "Stone", hex: "#8a857c" },
        { name: "Black", hex: "#0A0A0A" },
      ],
      55,
    ),
  },
  {
    id: "prod-signature-tee",
    categoryId: "cat-tshirts",
    name: "After Hours Tee",
    slug: "after-hours-tee",
    description:
      "Heavier jersey with a tonal embroidered mark. Longer sleeve, structured drape — the shirt you throw on after last call.",
    priceCents: 3800,
    compareAtCents: 4200,
    isFeatured: true,
    isNew: true,
    tags: ["signature", "embroidery"],
    createdAt: "2026-03-01T12:00:00.000Z",
    images: [
      {
        url: "/images/products/signature-tee-front.png",
        alt: "After Hours Tee with embroidered mark",
        primary: true,
      },
    ],
    variants: apparelVariants(
      "SH-ST",
      [
        { name: "Black", hex: "#0A0A0A" },
        { name: "Navy", hex: "#1a2332" },
      ],
      28,
    ),
  },
  {
    id: "prod-core-hoodie",
    categoryId: "cat-hoodies",
    name: "Delayed Hoodie",
    slug: "delayed-hoodie",
    description:
      "Fleece-lined pullover with a roomy hood and kangaroo pocket. Built for the delay, the platform wind, and the walk home after midnight.",
    priceCents: 6800,
    isFeatured: true,
    isBestseller: true,
    tags: ["fleece", "layering"],
    images: [
      {
        url: "/images/products/core-hoodie-front.png",
        alt: "Delayed Hoodie in black",
        primary: true,
      },
      {
        url: "/images/products/core-hoodie-detail.png",
        alt: "Delayed Hoodie pocket detail",
      },
    ],
    variants: apparelVariants(
      "SH-CH",
      [
        { name: "Black", hex: "#0A0A0A" },
        { name: "Heather Gray", hex: "#9b9b9b" },
        { name: "Signal", hex: "#FF4D00" },
      ],
      35,
    ),
  },
  {
    id: "prod-premium-pullover",
    categoryId: "cat-hoodies",
    name: "Express Pullover",
    slug: "express-pullover",
    description:
      "Brushed French terry with a refined rib hem. Soft enough for the express, sharp enough for a walk down Orchard after dark.",
    priceCents: 7800,
    isFeatured: true,
    tags: ["premium", "french-terry"],
    images: [
      {
        url: "/images/products/premium-pullover-front.png",
        alt: "Express Pullover in concrete",
        primary: true,
      },
    ],
    variants: apparelVariants(
      "SH-PP",
      [
        { name: "Concrete", hex: "#EDE6D6" },
        { name: "Black", hex: "#0A0A0A" },
      ],
      22,
    ),
  },
  {
    id: "prod-tech-hoodie",
    categoryId: "cat-hoodies",
    name: "Night Owl Hoodie",
    slug: "night-owl-hoodie",
    description:
      "Performance midlayer with stretch under the arms and a media pocket. Moves like the city without looking like gym merch.",
    priceCents: 8800,
    isNew: true,
    tags: ["tech", "performance"],
    createdAt: "2026-04-12T12:00:00.000Z",
    images: [
      {
        url: "/images/products/tech-hoodie-front.png",
        alt: "Night Owl Hoodie in charcoal",
        primary: true,
      },
    ],
    variants: apparelVariants(
      "SH-TH",
      [
        { name: "Charcoal", hex: "#2f2f2f" },
        { name: "Signal", hex: "#FF4D00" },
      ],
      18,
    ),
  },
  {
    id: "prod-classic-cap",
    categoryId: "cat-hats",
    name: "Six Train Cap",
    slug: "six-train-cap",
    description:
      "Structured six-panel with a curved brim and tonal platform embroidery. Adjustable strap for an easy everyday fit.",
    priceCents: 2800,
    isBestseller: true,
    tags: ["cap", "embroidery"],
    images: [
      {
        url: "/images/products/classic-cap.png",
        alt: "Six Train Cap in black",
        primary: true,
      },
    ],
    variants: [
      {
        size: "ONE_SIZE",
        color: "Black",
        colorHex: "#0A0A0A",
        sku: "SH-CC-BLK-OS",
        inventory: 60,
      },
      {
        size: "ONE_SIZE",
        color: "Concrete",
        colorHex: "#EDE6D6",
        sku: "SH-CC-BNE-OS",
        inventory: 45,
      },
      {
        size: "ONE_SIZE",
        color: "Signal",
        colorHex: "#FF4D00",
        sku: "SH-CC-TEL-OS",
        inventory: 30,
      },
    ],
  },
  {
    id: "prod-snapback",
    categoryId: "cat-hats",
    name: "Platform Snapback",
    slug: "platform-snapback",
    description:
      "Flat-brim snapback with contrast underbill and a raised Straphanger mark. Keeps its shape between boroughs.",
    priceCents: 3200,
    isFeatured: true,
    tags: ["snapback"],
    images: [
      {
        url: "/images/products/snapback.png",
        alt: "Platform Snapback in black and signal",
        primary: true,
      },
    ],
    variants: [
      {
        size: "ONE_SIZE",
        color: "Black",
        colorHex: "#0A0A0A",
        sku: "SH-SB-BLK-OS",
        inventory: 40,
      },
      {
        size: "ONE_SIZE",
        color: "Signal",
        colorHex: "#FF4D00",
        sku: "SH-SB-TEL-OS",
        inventory: 25,
      },
    ],
  },
  {
    id: "prod-beanie",
    categoryId: "cat-hats",
    name: "Tunnel Beanie",
    slug: "tunnel-beanie",
    description:
      "Rib-knit cuff beanie with fine embroidered branding. Warmth without bulk for the tunnel wind.",
    priceCents: 2400,
    isNew: true,
    tags: ["beanie", "winter"],
    createdAt: "2026-02-20T12:00:00.000Z",
    images: [
      {
        url: "/images/products/beanie.png",
        alt: "Tunnel Beanie in charcoal",
        primary: true,
      },
    ],
    variants: [
      {
        size: "ONE_SIZE",
        color: "Charcoal",
        colorHex: "#2f2f2f",
        sku: "SH-EB-CHR-OS",
        inventory: 50,
      },
      {
        size: "ONE_SIZE",
        color: "Black",
        colorHex: "#0A0A0A",
        sku: "SH-EB-BLK-OS",
        inventory: 50,
      },
      {
        size: "ONE_SIZE",
        color: "Concrete",
        colorHex: "#EDE6D6",
        sku: "SH-EB-BNE-OS",
        inventory: 35,
      },
    ],
  },
  {
    id: "prod-tote",
    categoryId: "cat-accessories",
    name: "Bodega Tote",
    slug: "bodega-tote",
    description:
      "Heavyweight canvas tote with reinforced handles. Wide enough for a laptop, a chopped cheese, and a weekend run.",
    priceCents: 3600,
    isFeatured: true,
    tags: ["tote", "canvas"],
    images: [
      {
        url: "/images/products/tote-bag.png",
        alt: "Bodega Tote in concrete canvas",
        primary: true,
      },
    ],
    variants: [
      {
        size: "ONE_SIZE",
        color: "Concrete",
        colorHex: "#EDE6D6",
        sku: "SH-TB-BNE-OS",
        inventory: 70,
      },
      {
        size: "ONE_SIZE",
        color: "Black",
        colorHex: "#0A0A0A",
        sku: "SH-TB-BLK-OS",
        inventory: 55,
      },
    ],
  },
  {
    id: "prod-socks",
    categoryId: "cat-accessories",
    name: "Straphanger Socks",
    slug: "straphanger-socks",
    description:
      "Crew socks with a cushioned sole and ankle mark. Three-pair pack for the week that never ends.",
    priceCents: 1800,
    isBestseller: true,
    tags: ["socks", "pack"],
    images: [
      {
        url: "/images/products/logo-socks.png",
        alt: "Straphanger Socks three-pack",
        primary: true,
      },
    ],
    variants: [
      {
        size: "S",
        color: "Mixed",
        colorHex: "#8a857c",
        sku: "SH-LS-MIX-S",
        inventory: 40,
      },
      {
        size: "M",
        color: "Mixed",
        colorHex: "#8a857c",
        sku: "SH-LS-MIX-M",
        inventory: 80,
      },
      {
        size: "L",
        color: "Mixed",
        colorHex: "#8a857c",
        sku: "SH-LS-MIX-L",
        inventory: 60,
      },
    ],
  },
  {
    id: "prod-mug",
    categoryId: "cat-accessories",
    name: "Coffee Cart Mug",
    slug: "coffee-cart-mug",
    description:
      "Matte ceramic mug with a signal-orange interior and embossed exterior mark. 12 oz — the first pour before the turnstile.",
    priceCents: 2200,
    tags: ["mug", "home"],
    images: [
      {
        url: "/images/products/mug.png",
        alt: "Coffee Cart Mug with signal interior",
        primary: true,
      },
    ],
    variants: [
      {
        size: "ONE_SIZE",
        color: "Concrete",
        colorHex: "#EDE6D6",
        sku: "SH-MG-BNE-OS",
        inventory: 90,
      },
      {
        size: "ONE_SIZE",
        color: "Black",
        colorHex: "#0A0A0A",
        sku: "SH-MG-BLK-OS",
        inventory: 75,
      },
    ],
  },
  {
    id: "prod-coach-jacket",
    categoryId: "cat-accessories",
    name: "Fire Escape Jacket",
    slug: "fire-escape-jacket",
    description:
      "Lightweight water-resistant shell with snap front and elastic cuffs. Packs small, looks like you meant to be on that fire escape.",
    priceCents: 9800,
    compareAtCents: 11000,
    isFeatured: true,
    isNew: true,
    tags: ["outerwear", "jacket"],
    createdAt: "2026-05-01T12:00:00.000Z",
    images: [
      {
        url: "/images/products/coach-jacket.png",
        alt: "Fire Escape Jacket in black",
        primary: true,
      },
    ],
    variants: apparelVariants(
      "SH-CJ",
      [
        { name: "Black", hex: "#0A0A0A" },
        { name: "Stone", hex: "#8a857c" },
      ],
      16,
    ),
  },
  {
    id: "prod-weekend-short",
    categoryId: "cat-shorts",
    name: "Boardwalk Short",
    slug: "boardwalk-short",
    description:
      "Mid-length cotton twill with an elastic waist. Easy throw-on for Coney heat and the walk back to the Q.",
    priceCents: 4200,
    isNew: true,
    tags: ["shorts", "summer"],
    createdAt: "2026-05-18T12:00:00.000Z",
    images: [
      {
        url: "/images/products/weekend-short.png",
        alt: "Boardwalk Short in stone",
        primary: true,
      },
    ],
    variants: apparelVariants(
      "SH-WS",
      [
        { name: "Stone", hex: "#8a857c" },
        { name: "Black", hex: "#0A0A0A" },
        { name: "Signal", hex: "#FF4D00" },
      ],
      30,
    ),
  },
  {
    id: "prod-camp-hat",
    categoryId: "cat-hats",
    name: "Stoop Camp Hat",
    slug: "stoop-camp-hat",
    description:
      "Unstructured five-panel with a soft brim and metal clasp. Low profile for stoop hours when a snapback feels like too much.",
    priceCents: 3000,
    tags: ["camp-hat"],
    images: [
      {
        url: "/images/products/camp-hat.png",
        alt: "Stoop Camp Hat in concrete",
        primary: true,
      },
    ],
    variants: [
      {
        size: "ONE_SIZE",
        color: "Concrete",
        colorHex: "#EDE6D6",
        sku: "SH-CP-BNE-OS",
        inventory: 38,
      },
      {
        size: "ONE_SIZE",
        color: "Olive",
        colorHex: "#556b2f",
        sku: "SH-CP-OLV-OS",
        inventory: 28,
      },
    ],
  },
  {
    id: "prod-key-lanyard",
    categoryId: "cat-accessories",
    name: "Metro Lanyard",
    slug: "metro-lanyard",
    description:
      "Woven lanyard with a metal clasp and detachable key ring. For walk-up keys, badges, and the bag that never leaves your shoulder.",
    priceCents: 1400,
    tags: ["lanyard", "small-goods"],
    images: [
      {
        url: "/images/products/key-lanyard.png",
        alt: "Metro Lanyard in signal",
        primary: true,
      },
    ],
    variants: [
      {
        size: "ONE_SIZE",
        color: "Signal",
        colorHex: "#FF4D00",
        sku: "SH-KL-TEL-OS",
        inventory: 120,
      },
      {
        size: "ONE_SIZE",
        color: "Black",
        colorHex: "#0A0A0A",
        sku: "SH-KL-BLK-OS",
        inventory: 120,
      },
    ],
  },
];

export const products: Product[] = productSeeds.map(buildProduct);

export function getSeedCategories(): Category[] {
  return categories;
}

export function getSeedProducts(): Product[] {
  return products;
}

export function getSeedProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug && p.is_active);
}

/** Admin lookup — unlike {@link getSeedProductBySlug}, includes inactive products. */
export function getSeedProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}
