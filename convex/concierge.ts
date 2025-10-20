import { v } from "convex/values";

import { mutation, type MutationCtx } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import { getViewer } from "./session";
import { now } from "./utils";

type SubmitArgs = {
  sessionToken?: string;
  message: string;
  preferredContact?: string;
  timeWindow?: string;
};

export const submit = mutation({
  args: {
    sessionToken: v.optional(v.string()),
    message: v.string(),
    preferredContact: v.optional(v.string()),
    timeWindow: v.optional(v.string()),
  },
  handler: async (ctx: MutationCtx, args: SubmitArgs) => {
    const viewer = await getViewer(ctx, args.sessionToken);
    if (!viewer) throw new Error("Unauthorized");

    await ctx.db.insert("conciergeRequests", {
      userId: viewer.user.id,
      message: args.message,
      preferredContact: args.preferredContact,
      timeWindow: args.timeWindow,
      status: "open",
      createdAt: now(),
    });

    return true;
  },
});

type UpdateStatusArgs = {
  sessionToken?: string;
  requestId: Id<"conciergeRequests">;
  status: string;
};

export const updateStatus = mutation({
  args: {
    sessionToken: v.optional(v.string()),
    requestId: v.id("conciergeRequests"),
    status: v.string(),
  },
  handler: async (ctx: MutationCtx, args: UpdateStatusArgs) => {
    const viewer = await getViewer(ctx, args.sessionToken);
    if (!viewer || viewer.user.role !== "admin") {
      throw new Error("Admin only");
    }

    await ctx.db.patch(args.requestId, {
      status: args.status,
    });

    return true;
  },
});
