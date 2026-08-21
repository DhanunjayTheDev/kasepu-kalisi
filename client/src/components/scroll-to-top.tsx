import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * A client-side route change keeps the previous scroll position, which on mobile
 * drops you into the middle of the next page. Reset to the top on navigation.
 */
export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}
