/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery } from "convex/react";

export function useConvexMutation(name: string) {
  return useMutation(name as unknown as any);
}

export function useConvexQuery(name: string, args?: unknown) {
  try {
    return useQuery(name as unknown as any, args as unknown as any);
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `Convex query ${name} failed; returning undefined fallback.`,
        error,
      );
    }
    return undefined;
  }
}
