"use client";

import { Fragment, useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";

/**
 * Keys the page subtree by pathname so client navigations always remount route UI,
 * and scrolls the document to the top (avoids “same viewport” after route change).
 */
export function RoutedTemplateBody({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return <Fragment key={pathname}>{children}</Fragment>;
}
