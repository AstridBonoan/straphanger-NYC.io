import { describe, expect, it } from "vitest";
import {
  summarizeCart,
  upsertCartLine,
  updateCartLineQuantity,
  removeCartLine,
} from "@/lib/cart/calculations";
import type { CartLine } from "@/types";

const baseLine: CartLine = {
  productId: "p1",
  variantId: "v1",
  quantity: 1,
  name: "Canal Street Tee",
  slug: "canal-street-tee",
  imageUrl: "/images/products/classic-tee-front.png",
  size: "M",
  color: "Black",
  unitPriceCents: 3200,
  maxQuantity: 10,
};

describe("cart calculations", () => {
  it("upserts matching variants by adding quantity", () => {
    const lines = upsertCartLine([], baseLine);
    const merged = upsertCartLine(lines, { ...baseLine, quantity: 2 });
    expect(merged).toHaveLength(1);
    expect(merged[0]?.quantity).toBe(3);
  });

  it("caps quantity at maxQuantity", () => {
    const lines = upsertCartLine([], { ...baseLine, quantity: 8, maxQuantity: 10 });
    const merged = upsertCartLine(lines, { ...baseLine, quantity: 5, maxQuantity: 10 });
    expect(merged[0]?.quantity).toBe(10);
  });

  it("updates and removes lines", () => {
    let lines = upsertCartLine([], baseLine);
    lines = updateCartLineQuantity(lines, "p1", "v1", 4);
    expect(lines[0]?.quantity).toBe(4);
    lines = removeCartLine(lines, "p1", "v1");
    expect(lines).toHaveLength(0);
  });

  it("summarizes cart totals", () => {
    const summary = summarizeCart([{ ...baseLine, quantity: 2 }]);
    expect(summary.itemCount).toBe(2);
    expect(summary.subtotalCents).toBe(6400);
    expect(summary.totalCents).toBeGreaterThan(summary.subtotalCents);
  });
});
