import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { cors } from "hono/cors";
import { errorHandlerMiddleware } from "./middlewares/error-handler.js";

const app = new Hono();

app.onError(errorHandlerMiddleware);

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.post("/login", (c) => {
  // Login successful from "Data Access/Service" Layer

  const sessionToken = "123123123123";

  setCookie(c, "sessionToken", sessionToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 5 * 60 * 1000, // 5 minutes
  });

  setCookie(c, "theme", "light", {
    httpOnly: true,
    secure: true,
    maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
  });

  return c.json({ message: "Login successful" });
});

app.get("/something", (c) => {
  const sessionToken = getCookie(c, "sessionToken");
  const pga4_session = getCookie(c, "pga4_session");
  const PGADMIN_LANGUAGE = getCookie(c, "PGADMIN_LANGUAGE");

  return c.json({ sessionToken, pga4_session, PGADMIN_LANGUAGE });
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
