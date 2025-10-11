import { useEffect } from "react";
import { useLocation, matchRoutes } from "react-router-dom";

import type { RouteObject } from "react-router-dom";

export const useDocumentTitle = (routes: RouteObject[]) => {
  const location = useLocation();
  const defaultTitle = import.meta.env.VITE_GLOB_APP_TITLE;

  useEffect(() => {
    const matches = matchRoutes(routes, location);
    if (matches && matches.length > 0) {
      const { route } = matches[matches.length - 1];
      document.title = `${defaultTitle} | ${route.handle?.title}`;
    }
  }, [location]);
};
