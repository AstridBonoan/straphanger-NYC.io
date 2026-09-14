import { test, expect } from "@playwright/test";

test.describe("storefront smoke", () => {
  test("homepage loads with brand", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: /straphanger/i }).first()).toBeVisible();
  });

  test("shop search filters products via query param", async ({ page }) => {
    await page.goto("/shop/?search=hoodie");
    await expect(page.getByRole("heading", { name: /shop/i })).toBeVisible();
    await expect(page.getByText(/hoodie/i).first()).toBeVisible();
  });

  test("product page opens from shop", async ({ page }) => {
    await page.goto("/shop");
    const firstProduct = page.locator('a[href^="/product/"]').first();
    await expect(firstProduct).toBeVisible();
    await firstProduct.click();
    await expect(page).toHaveURL(/\/product\//);
  });

  test("cart page renders empty state", async ({ page }) => {
    await page.goto("/cart");
    await expect(page.getByText(/bag is empty|your cart/i).first()).toBeVisible();
  });
});

test.describe("auth and admin", () => {
  test("admin requires auth", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/login/);
  });

  test("demo admin can open dashboard", async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("button", { name: /admin demo/i }).click();
    await expect(page).toHaveURL(/\/admin/);
    await expect(page.getByRole("heading", { name: /dashboard/i })).toBeVisible();
  });
});
