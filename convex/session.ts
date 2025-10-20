/* eslint-disable @typescript-eslint/no-explicit-any */
import { v } from "convex/values";

import { query, type MutationCtx, type QueryCtx } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import { now } from "./utils";

export type Viewer = {
  session: any;
  user: any;
};

export const viewer = query({
  args: { sessionToken: v.optional(v.string()) },
  handler: async (ctx: QueryCtx, args: { sessionToken?: string }) => {
    return getViewer(ctx, args.sessionToken);
  },
});

export async function getViewer(
  ctx: QueryCtx | MutationCtx,
  sessionToken?: string,
): Promise<Viewer | null> {
  if (!sessionToken) return null;

  const session = await ctx.db
    .query("sessions")
    .withIndex("by_token", (q: any) => q.eq("token", sessionToken))
    .unique();
  if (!session) return null;

  if (session.expiresAt < now()) {
    await deleteSessionIfPossible(ctx, session._id);
    return null;
  }

  const user = await ctx.db.get(session.userId);
  if (!user) return null;

  return {
    session,
    user: filterUserFields(user),
  };
}

function filterUserFields(user: any) {
  if (!user) return null;
  const { _id, ...rest } = user;
  const publicFields = { ...rest } as Record<string, unknown> & {
    passwordHash?: unknown;
    _creationTime?: unknown;
  };
  delete publicFields.passwordHash;
  delete publicFields._creationTime;
  return { id: _id, ...publicFields };
}

async function deleteSessionIfPossible(ctx: QueryCtx | MutationCtx, sessionId: Id<"sessions">) {
  const db = ctx.db as { delete?: (id: Id<"sessions">) => Promise<void> };
  if (typeof db.delete === "function") {
    await db.delete(sessionId);
  }
}
