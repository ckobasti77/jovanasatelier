"use client";

import {
  ConvexProvider,
  ConvexReactClient,
} from "convex/react";
import { ReactNode, useMemo } from "react";

const convexUrl =
  process.env.NEXT_PUBLIC_CONVEX_URL_PROD ||
  process.env.NEXT_PUBLIC_CONVEX_URL_DEV ||
  "http://localhost:8187";

export function ConvexClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  const client = useMemo(() => new ConvexReactClient(convexUrl), []);
  return <ConvexProvider client={client}>{children}</ConvexProvider>;
}
