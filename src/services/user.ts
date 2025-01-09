import { createUserData } from "@/data/user";
import { Session } from "inspector";

type CreateUserServiceArgs = {
  session: Session;
  payload: { name: string };
};

export function createUserService({ payload }: CreateUserServiceArgs) {
  // TODO: do your business logic here

  return createUserData(payload);
}
