"use client";

import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/**
 * False during SSR / initial hydration, true afterward — avoids class/text mismatches
 * from `prefers-*` APIs, pathname styling, random IDs, etc.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}
