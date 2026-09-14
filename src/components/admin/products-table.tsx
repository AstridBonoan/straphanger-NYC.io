"use client";

import * as React from "react";
import Link from "next/link";
import { Pencil, Search, Trash2 } from "lucide-react";
import type { Product } from "@/types";
import { formatPrice } from "@/lib/products/pricing";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThumbnailImage } from "@/components/admin/thumbnail-image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function totalStock(product: Product): number {
  return (product.variants ?? []).reduce((sum, v) => sum + v.inventory_quantity, 0);
}

export interface ProductsTableProps {
  products: Product[];
}

export function ProductsTable({ products: initialProducts }: ProductsTableProps) {
  const [products, setProducts] = React.useState(initialProducts);
  const [search, setSearch] = React.useState("");
  const [pendingDelete, setPendingDelete] = React.useState<Product | null>(null);
  const [notice, setNotice] = React.useState<string | null>(null);

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        (p.category?.name ?? "").toLowerCase().includes(q),
    );
  }, [products, search]);

  function confirmDelete() {
    if (!pendingDelete) return;
    setProducts((prev) => prev.filter((p) => p.id !== pendingDelete.id));
    setNotice(`"${pendingDelete.name}" removed from this session. Demo mode doesn't persist deletions.`);
    setPendingDelete(null);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#0A0A0A]/40" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products…"
            className="pl-9"
            aria-label="Search products"
          />
        </div>
        <p className="text-sm text-[#0A0A0A]/50">
          {filtered.length} of {products.length} products
        </p>
      </div>

      {notice ? (
        <div className="rounded-md border border-[#FF4D00]/25 bg-[#FF4D00]/8 px-3 py-2 text-sm text-[#FF4D00]">
          {notice}
        </div>
      ) : null}

      <div className="overflow-x-auto rounded-lg border border-[#0A0A0A]/10 bg-white">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead>
            <tr className="border-b border-[#0A0A0A]/10 text-xs uppercase tracking-wide text-[#0A0A0A]/50">
              <th scope="col" className="px-4 py-3 font-medium">Product</th>
              <th scope="col" className="px-4 py-3 font-medium">Price</th>
              <th scope="col" className="px-4 py-3 font-medium">Stock</th>
              <th scope="col" className="px-4 py-3 font-medium">Featured</th>
              <th scope="col" className="px-4 py-3 font-medium">Status</th>
              <th scope="col" className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#0A0A0A]/8">
            {filtered.map((product) => {
              const stock = totalStock(product);
              const image = product.images?.find((img) => img.is_primary) ?? product.images?.[0];
              return (
                <tr key={product.id} className="align-middle">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <ThumbnailImage src={image?.url} alt="" />
                      <div className="min-w-0">
                        <p className="truncate font-medium text-[#0A0A0A]">{product.name}</p>
                        <p className="truncate text-xs text-[#0A0A0A]/50">
                          {product.category?.name ?? "Uncategorized"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-[#0A0A0A]">
                    {formatPrice(product.price_cents)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <span
                      className={cn(
                        "font-medium",
                        stock < 5 ? "text-amber-700" : "text-[#0A0A0A]",
                      )}
                    >
                      {stock}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    {product.is_featured ? (
                      <Badge variant="secondary">Featured</Badge>
                    ) : (
                      <span className="text-[#0A0A0A]/30">—</span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <Badge variant={product.is_active ? "default" : "muted"}>
                      {product.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        aria-label={`Edit ${product.name}`}
                        className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label={`Delete ${product.name}`}
                        className="hover:bg-red-50 hover:text-red-700"
                        onClick={() => setPendingDelete(product)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-sm text-[#0A0A0A]/50">
                  No products match your search.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <Dialog open={pendingDelete != null} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete product?</DialogTitle>
            <DialogDescription>
              {pendingDelete
                ? `This removes "${pendingDelete.name}" from this session's view only — demo mode doesn't persist changes to a database.`
                : null}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setPendingDelete(null)}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
