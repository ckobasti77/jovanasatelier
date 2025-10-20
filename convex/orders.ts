import { v } from "convex/values";

import { mutation, query, type MutationCtx, type QueryCtx } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import { getViewer } from "./session";
import { now } from "./utils";

const TIMELINE_ENTRY = v.object({
  label: v.string(),
  completed: v.boolean(),
  completedAt: v.optional(v.number()),
});

const PROGRESS_ENTRY = v.object({
  id: v.string(),
  title: v.string(),
  message: v.string(),
  timelineLabel: v.optional(v.string()),
  createdAt: v.number(),
  sharedAt: v.optional(v.number()),
});

export const listByUser = query({
  args: {
    sessionToken: v.optional(v.string()),
  },
  handler: async (ctx: QueryCtx, args: { sessionToken?: string }) => {
    const viewer = await getViewer(ctx, args.sessionToken);
    if (!viewer) return [];

    const orders = await ctx.db
      .query("orders")
      .withIndex("by_user", (q) => q.eq("userId", viewer.user.id))
      .order("desc")
      .collect();

    return orders.map((order) => ({
      id: order._id,
      orderCode: order.orderCode,
      dressModel: order.dressModel,
      color: order.color,
      fabric: order.fabric,
      status: order.status,
      stage: order.stage,
      eta: order.eta,
      measurementProfileId: order.measurementProfileId,
      productionTimeline: order.productionTimeline,
      progressUpdates: order.progressUpdates ?? [],
      shareKey: order.shareKey,
      measurements: order.measurements,
      bodyProfile: order.bodyProfile,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }));
  },
});

type CreateArgs = {
  sessionToken?: string;
  orderCode: string;
  dressModel: string;
  color: string;
  fabric: string;
  status: string;
  stage: string;
  eta?: number;
  measurementProfileId?: Id<"measurementProfiles">;
  productionTimeline: Array<{ label: string; completed: boolean; completedAt?: number | null }>;
  progressUpdates?: Array<{
    id: string;
    title: string;
    message: string;
    timelineLabel?: string | null;
    createdAt: number;
    sharedAt?: number | null;
  }>;
  shareKey?: string | null;
  measurements?: {
    bust?: number | null;
    underbust?: number | null;
    waist?: number | null;
    hips?: number | null;
    hollowToFloor?: number | null;
    height?: number | null;
    preferredHeel?: number | null;
  };
  bodyProfile?: {
    height?: number | null;
    weight?: number | null;
    braBand?: number | null;
    braCup?: string | null;
  };
};

export const create = mutation({
  args: {
    sessionToken: v.optional(v.string()),
    orderCode: v.string(),
    dressModel: v.string(),
    color: v.string(),
    fabric: v.string(),
    status: v.string(),
    stage: v.string(),
    eta: v.optional(v.number()),
    measurementProfileId: v.optional(v.id("measurementProfiles")),
    productionTimeline: v.array(TIMELINE_ENTRY),
    progressUpdates: v.optional(v.array(PROGRESS_ENTRY)),
    shareKey: v.optional(v.string()),
    measurements: v.optional(
      v.object({
        bust: v.optional(v.number()),
        underbust: v.optional(v.number()),
        waist: v.optional(v.number()),
        hips: v.optional(v.number()),
        hollowToFloor: v.optional(v.number()),
        height: v.optional(v.number()),
        preferredHeel: v.optional(v.number()),
      }),
    ),
    bodyProfile: v.optional(
      v.object({
        height: v.optional(v.number()),
        weight: v.optional(v.number()),
        braBand: v.optional(v.number()),
        braCup: v.optional(v.string()),
      }),
    ),
  },
  handler: async (ctx: MutationCtx, args: CreateArgs) => {
    const viewer = await getViewer(ctx, args.sessionToken);
    if (!viewer) throw new Error("Unauthorized");

    const timestamp = now();
    const productionTimeline = args.productionTimeline.map((step) => ({
      label: step.label,
      completed: step.completed,
      completedAt: step.completedAt ?? undefined,
    }));
    const progressUpdates = args.progressUpdates
      ? args.progressUpdates.map((update) => ({
          id: update.id,
          title: update.title,
          message: update.message,
          timelineLabel: update.timelineLabel ?? undefined,
          createdAt: update.createdAt,
          sharedAt: update.sharedAt ?? undefined,
        }))
      : [];
    const measurements = args.measurements
      ? {
          bust: args.measurements.bust ?? undefined,
          underbust: args.measurements.underbust ?? undefined,
          waist: args.measurements.waist ?? undefined,
          hips: args.measurements.hips ?? undefined,
          hollowToFloor: args.measurements.hollowToFloor ?? undefined,
          height: args.measurements.height ?? undefined,
          preferredHeel: args.measurements.preferredHeel ?? undefined,
        }
      : undefined;
    const bodyProfile = args.bodyProfile
      ? {
          height: args.bodyProfile.height ?? undefined,
          weight: args.bodyProfile.weight ?? undefined,
          braBand: args.bodyProfile.braBand ?? undefined,
          braCup: args.bodyProfile.braCup ?? undefined,
        }
      : undefined;
    return ctx.db.insert("orders", {
      userId: viewer.user.id,
      orderCode: args.orderCode,
      dressModel: args.dressModel,
      color: args.color,
      fabric: args.fabric,
      status: args.status,
      stage: args.stage,
      eta: args.eta,
      measurementProfileId: args.measurementProfileId,
      productionTimeline,
      progressUpdates,
      shareKey: args.shareKey ?? undefined,
      measurements,
      bodyProfile,
      createdAt: timestamp,
      updatedAt: timestamp,
    });
  },
});

type UpdateStatusArgs = {
  sessionToken?: string;
  orderId: Id<"orders">;
  status: string;
  stage: string;
  productionTimeline?: Array<{ label: string; completed: boolean; completedAt?: number | null }>;
  eta?: number;
  progressUpdates?: Array<{
    id: string;
    title: string;
    message: string;
    timelineLabel?: string | null;
    createdAt: number;
    sharedAt?: number | null;
  }>;
  shareKey?: string | null;
};

export const updateStatus = mutation({
  args: {
    sessionToken: v.optional(v.string()),
    orderId: v.id("orders"),
    status: v.string(),
    stage: v.string(),
    productionTimeline: v.optional(v.array(TIMELINE_ENTRY)),
    eta: v.optional(v.number()),
    progressUpdates: v.optional(v.array(PROGRESS_ENTRY)),
    shareKey: v.optional(v.string()),
  },
  handler: async (ctx: MutationCtx, args: UpdateStatusArgs) => {
    const viewer = await getViewer(ctx, args.sessionToken);
    if (!viewer) throw new Error("Unauthorized");

    const order = await ctx.db.get(args.orderId);
    if (!order) throw new Error("Order not found");
    if (viewer.user.role !== "admin" && order.userId !== viewer.user.id) {
      throw new Error("Not permitted to update this order");
    }

    const productionTimeline = args.productionTimeline
      ? args.productionTimeline.map((step) => ({
          label: step.label,
          completed: step.completed,
          completedAt: step.completedAt ?? undefined,
        }))
      : order.productionTimeline;

    const progressUpdates = args.progressUpdates
      ? args.progressUpdates.map((update) => ({
          id: update.id,
          title: update.title,
          message: update.message,
          timelineLabel: update.timelineLabel ?? undefined,
          createdAt: update.createdAt,
          sharedAt: update.sharedAt ?? undefined,
        }))
      : order.progressUpdates ?? [];

    await ctx.db.patch(args.orderId, {
      status: args.status,
      stage: args.stage,
      productionTimeline,
      progressUpdates,
      shareKey: args.shareKey ?? order.shareKey,
      eta: args.eta ?? order.eta,
      updatedAt: now(),
    });

    return true;
  },
});

export const shareSnapshot = query({
  args: {
    orderCode: v.string(),
    shareKey: v.optional(v.string()),
    sessionToken: v.optional(v.string()),
  },
  handler: async (
    ctx: QueryCtx,
    args: { orderCode: string; shareKey?: string; sessionToken?: string },
  ) => {
    const order = await ctx.db
      .query("orders")
      .withIndex("by_code", (q) => q.eq("orderCode", args.orderCode))
      .unique();
    if (!order) return null;

    if (args.shareKey) {
      if (order.shareKey !== args.shareKey) {
        return null;
      }
    } else {
      const viewer = await getViewer(ctx, args.sessionToken);
      if (!viewer) return null;
      if (viewer.user.role !== "admin" && order.userId !== viewer.user.id) {
        return null;
      }
    }

    const client = await ctx.db.get(order.userId);
    const isOwnerView = !args.shareKey;

    const updates = (order.progressUpdates ?? []).filter((update) => {
      if (isOwnerView) return true;
      return Boolean(update.sharedAt);
    });

    return {
      orderCode: order.orderCode,
      dressModel: order.dressModel,
      color: order.color,
      fabric: order.fabric,
      status: order.status,
      stage: order.stage,
      eta: order.eta,
      productionTimeline: order.productionTimeline,
      progressUpdates: updates,
      shareKey: order.shareKey,
      client: client
        ? {
            name: client.name,
          }
        : null,
      updatedAt: order.updatedAt,
    };
  },
});
