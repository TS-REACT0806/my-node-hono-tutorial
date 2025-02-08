import { faker } from "@faker-js/faker";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { sql } from "kysely";
import { createDbClient } from "./db/create-db-client.js";
import { UserRoleType } from "./db/types.js";
import { errorHandlerMiddleware } from "./middlewares/error-handler.js";

const app = new Hono();

app.onError(errorHandlerMiddleware);

const dbClient = createDbClient();

app.post("/users", async (c) => {
  const users = Array.from({ length: 10 }, (_, i) => ({
    created_at: faker.date.recent(),
    updated_at: faker.date.recent(),
    deleted_at: null,
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email().toLowerCase(),
    role: UserRoleType.USER,
  }));

  const createdUsers = await dbClient
    .insertInto("users")
    .values(users)
    .returningAll()
    .execute();

  return c.json(createdUsers);
});

app.get("/users/search", async (c) => {
  const { q } = c.req.query();

  const qWithWildcards = `%${q}%`;

  const query = sql`
   SELECT * FROM users 
   WHERE first_name ILIKE ${qWithWildcards} OR last_name ILIKE ${qWithWildcards}  
  `;

  console.log(query.compile(dbClient));

  const results = await query.execute(dbClient);

  return c.json(results.rows);
});

app.get("/users/:name", async (c) => {
  const { name } = c.req.param();

  if (!name) {
    return c.json({ error: "First name is required" }, 400);
  }

  const query = sql`SELECT * FROM users WHERE first_name = ${name}`;

  console.log(query.compile(dbClient));

  const results = await query.execute(dbClient);
  return c.json(results.rows);
});

/* Routes */
// routes.forEach((route) => {
//   app.route("/", route);
// });

const port = 3000;
console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
