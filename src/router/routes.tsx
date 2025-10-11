import { Navigate } from "react-router-dom";
import Layout from "@/layout";

import type { RouteObject } from "react-router-dom";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        lazy: async () => ({
          Component: (await import("@/pages/home")).default,
        }),
        handle: { title: "首页" },
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
];

export default routes;
