import Home from "./pages/Home";
import User from "./pages/User";
import NotFound from "./pages/NotFound";
import type { JSX } from "react";

export type AppRoute = {
  path: string;
  label?: string;
  element: JSX.Element;
  nav?: boolean;
};

export const appRoutes: AppRoute[] = [
  {
    path: "/",
    label: "Home",
    element: <Home />,
    nav: true,
  },
  {
    path: "/users",
    label: "User",
    element: <User />,
    nav: true,
  },
    {
    path: "/products",
    label: "Products",
    element: <User />,
    nav: true,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];
