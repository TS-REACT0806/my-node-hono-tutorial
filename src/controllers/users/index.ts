import {
  deleteUserData,
  getUserData,
  getUsersData,
  updateUserData,
} from "@/data/user";
import { createUserService } from "@/services/user";
import { type Context } from "hono";
import { StatusCodes } from "http-status-codes";

export function getUsersController(c: Context) {
  const users = getUsersData();

  return c.json(users, StatusCodes.OK);
}

export function getUserController(c: Context) {
  const { id } = c.req.param();

  const user = getUserData(Number(id));

  return c.json(user, StatusCodes.OK);
}

export async function createUserController(c: Context) {
  const body = await c.req.json();

  const createdUser = createUserService({
    payload: body,
    session: c.get("session"),
  });

  return c.json(createdUser, StatusCodes.CREATED);
}

export function deleteUserController(c: Context) {
  const { id } = c.req.param();

  const deletedUser = deleteUserData(Number(id));

  return c.json(deletedUser, StatusCodes.OK);
}

export async function updateUserController(c: Context) {
  const { id } = c.req.param();

  const body = await c.req.json();

  const updatedUser = updateUserData(Number(id), body);

  return c.json(updatedUser, StatusCodes.OK);
}
