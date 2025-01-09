import productsRoutes from "./products/routes";
import usersRoutes from "./users/routes";

export const routes = [usersRoutes, productsRoutes] as const;

export type AppRoutes = (typeof routes)[number];
