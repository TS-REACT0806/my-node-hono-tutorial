import { Hono } from "hono";
import {
  createProductController,
  deleteProductController,
  getProductController,
  getProductsController,
  updateProductController,
} from "./index.js";

const routes = new Hono()
  .get("/products", getProductsController)
  .get("/products/:id", getProductController)
  .post("/products", createProductController)
  .delete("/products/:id", deleteProductController)
  .put("/products/:id", updateProductController);

export default routes;
