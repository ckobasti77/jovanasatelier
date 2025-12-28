import { v4 as uuid } from "uuid";
import { v } from "convex/values";

import { mutation, query, type MutationCtx, type QueryCtx } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import { getViewer } from "./session";
import { now } from "./utils";

type AdminCtx = QueryCtx | MutationCtx;

async function requireAdmin(ctx: AdminCtx, sessionToken?: string) {
  const viewer = await getViewer(ctx, sessionToken);
  if (!viewer || viewer.user.role !== "admin") {
    throw new Error("PERMISSION_ADMIN_ONLY");
  }
  return viewer;
}

export const overview = query({
  args: { sessionToken: v.optional(v.string()) },
  handler: async (ctx: QueryCtx, args: { sessionToken?: string }) => {
    await requireAdmin(ctx, args.sessionToken);

    const [users, orders, conciergeOpen, inspirationsPublished] = await Promise.all([
      ctx.db.query("users").collect(),
      ctx.db.query("orders").collect(),
      ctx.db
        .query("conciergeRequests")
        .filter((q) => q.eq("status", "open"))
        .collect(),
      ctx.db
        .query("inspirations")
        .withIndex("by_published", (q) => q.eq("published", true))
        .collect(),
    ]);

    const admins = users.filter((user) => user.role === "admin").length;
    const completedOrders = orders.filter(
      (order) => order.status === "completed" || order.stage === "delivered",
    ).length;
    const activeOrders = orders.length - completedOrders;

    return {
      users: users.length,
      admins,
      orders: {
        total: orders.length,
        active: activeOrders,
        completed: completedOrders,
      },
      conciergeOpen: conciergeOpen.length,
      inspirationsPublished: inspirationsPublished.length,
    };
  },
});

export const orders = query({
  args: { sessionToken: v.optional(v.string()) },
  handler: async (ctx: QueryCtx, args: { sessionToken?: string }) => {
    await requireAdmin(ctx, args.sessionToken);

    const records = await ctx.db.query("orders").order("desc").collect();
    const result = await Promise.all(
      records.map(async (order) => {
        const user = await ctx.db.get(order.userId);
        return {
          id: order._id,
          orderCode: order.orderCode,
          dressModel: order.dressModel,
          color: order.color,
          fabric: order.fabric,
          status: order.status,
          stage: order.stage,
          eta: order.eta,
          productionTimeline: order.productionTimeline,
          progressUpdates: order.progressUpdates ?? [],
          shareKey: order.shareKey,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
          client: user
            ? {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
              }
            : null,
        };
      }),
    );

    return result;
  },
});

export const concierge = query({
  args: { sessionToken: v.optional(v.string()) },
  handler: async (ctx: QueryCtx, args: { sessionToken?: string }) => {
    await requireAdmin(ctx, args.sessionToken);

    const requests = await ctx.db
      .query("conciergeRequests")
      .order("desc")
      .collect();

    const withUsers = await Promise.all(
      requests.map(async (request) => {
        const user = await ctx.db.get(request.userId);
        return {
          id: request._id,
          message: request.message,
          preferredContact: request.preferredContact,
          timeWindow: request.timeWindow,
          status: request.status,
          createdAt: request.createdAt,
          client: user
            ? {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
              }
            : null,
        };
      }),
    );

    return withUsers;
  },
});

export const ensureShareKey = mutation({
  args: {
    sessionToken: v.optional(v.string()),
    orderId: v.id("orders"),
  },
  handler: async (ctx: MutationCtx, args: { sessionToken?: string; orderId: Id<"orders"> }) => {
    await requireAdmin(ctx, args.sessionToken);
    const order = await ctx.db.get(args.orderId);
    if (!order) throw new Error("ORDER_NOT_FOUND");
    if (order.shareKey) return order.shareKey;

    const shareKey = uuid();
    await ctx.db.patch(order._id, { shareKey });
    return shareKey;
  },
});

export const recordProgressUpdate = mutation({
  args: {
    sessionToken: v.optional(v.string()),
    orderId: v.id("orders"),
    title: v.string(),
    message: v.string(),
    timelineLabel: v.optional(v.string()),
    publish: v.optional(v.boolean()),
  },
  handler: async (
    ctx: MutationCtx,
    args: {
      sessionToken?: string;
      orderId: Id<"orders">;
      title: string;
      message: string;
      timelineLabel?: string;
      publish?: boolean;
    },
  ) => {
    await requireAdmin(ctx, args.sessionToken);
    const order = await ctx.db.get(args.orderId);
    if (!order) throw new Error("ORDER_NOT_FOUND");

    const timestamp = now();
    const progressUpdates = [
      ...(order.progressUpdates ?? []),
      {
        id: uuid(),
        title: args.title,
        message: args.message,
        timelineLabel: args.timelineLabel,
        createdAt: timestamp,
        sharedAt: args.publish ? timestamp : undefined,
      },
    ];

    const shareKey = args.publish ? order.shareKey ?? uuid() : order.shareKey;

    await ctx.db.patch(order._id, {
      progressUpdates,
      shareKey,
      updatedAt: timestamp,
    });

    return {
      progressUpdates,
      shareKey,
    };
  },
});

export const updateProduction = mutation({
  args: {
    sessionToken: v.optional(v.string()),
    orderId: v.id("orders"),
    status: v.string(),
    stage: v.string(),
    eta: v.optional(v.number()),
    productionTimeline: v.array(
      v.object({
        label: v.string(),
        completed: v.boolean(),
        completedAt: v.optional(v.number()),
      }),
    ),
  },
  handler: async (
    ctx: MutationCtx,
    args: {
      sessionToken?: string;
      orderId: Id<"orders">;
      status: string;
      stage: string;
      eta?: number;
      productionTimeline: Array<{ label: string; completed: boolean; completedAt?: number }>;
    },
  ) => {
    await requireAdmin(ctx, args.sessionToken);
    const order = await ctx.db.get(args.orderId);
    if (!order) throw new Error("ORDER_NOT_FOUND");

    const timestamp = now();
    await ctx.db.patch(order._id, {
      status: args.status,
      stage: args.stage,
      eta: args.eta,
      productionTimeline: args.productionTimeline.map((step) => ({
        label: step.label,
        completed: step.completed,
        completedAt: step.completedAt,
      })),
      updatedAt: timestamp,
    });

    return true;
  },
});
