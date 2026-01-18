import Home from "./pages/Home";
import User from "./pages/User";
import NotFound from "./pages/NotFound";
import type { JSX } from "react";
import Product from "./pages/Product";
import UserDetail from "./pages/UserDetail";
import ProductDetail from "./pages/ProductDetail";
import { Home as HomeIcon, Package, Users } from "lucide-react";
import Role from "./pages/Role";
import RoleDetail from "./pages/RoleDetail";

export type AppRoute = {
  path: string;
  label?: string;
  icon?: JSX.Element;
  element: JSX.Element;
  nav?: boolean;
};

export const appRoutes: AppRoute[] = [
  {
    path: "/",
    label: "Home",
    icon: <HomeIcon className="h-4 w-4" />,
    element: <Home />,
    nav: true,
  },
  {
    path: "/users",
    label: "User",
    icon: <Users className="h-4 w-4" />,
    element: <User />,
    nav: true,
  },
  {
    path: "/users/:id",
    element: <UserDetail />,
  },
  {
    path: "/roles",
    label: "Role",
    icon: <Users className="h-4 w-4" />,
    element: <Role />,
    nav: true,
  },
  {
    path: "/roles/:id",
    element: <RoleDetail />,
  },
  {
    path: "/products",
    label: "Products",
    icon: <Package className="h-4 w-4" />,
    element: <Product />,
    nav: true,
  },
  {
    path: "/products/:id",
    element: <ProductDetail />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];
