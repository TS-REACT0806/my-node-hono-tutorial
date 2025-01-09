import type { Context } from "hono";

export function getProductsController(c: Context) {
  return c.text("Hello Products");
}

export function getProductController(c: Context) {
  return c.text("Hello Product");
}

export function createProductController(c: Context) {
  return c.text("Create Product");
}

export function deleteProductController(c: Context) {
  return c.text("Delete Product");
}

export function updateProductController(c: Context) {
  return c.text("Update Product");
}
