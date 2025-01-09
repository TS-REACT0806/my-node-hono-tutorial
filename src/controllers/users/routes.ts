import { authenticationMiddleware } from "@/middlewares/authentication.js";
import { Hono } from "hono";
import {
  createUserController,
  deleteUserController,
  getUserController,
  getUsersController,
  updateUserController,
} from "./index.js";

const router = new Hono()
  .get("/users", authenticationMiddleware, getUsersController)
  .post("/users", authenticationMiddleware, createUserController)
  .get("/users/public", (c) => c.text("Public User"))
  .get("/users/:id", authenticationMiddleware, getUserController)
  .delete("/users/:id", authenticationMiddleware, deleteUserController)
  .put("/users/:id", authenticationMiddleware, updateUserController);

export default router;
