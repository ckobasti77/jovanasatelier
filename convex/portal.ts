/* eslint-disable @typescript-eslint/no-explicit-any */
import { v } from "convex/values";

import { query, type QueryCtx } from "./_generated/server";
import { getViewer } from "./session";

export const dashboard = query({
  args: {
    sessionToken: v.optional(v.string()),
  },
  handler: async (ctx: QueryCtx, args: { sessionToken?: string }) => {
    const viewer = await getViewer(ctx, args.sessionToken);
    if (!viewer) return null;

    const orders = await ctx.db
      .query("orders")
      .withIndex("by_user", (q: any) => q.eq("userId", viewer.user.id))
      .collect();

    const measurementProfiles = await ctx.db
      .query("measurementProfiles")
      .withIndex("by_user", (q: any) => q.eq("userId", viewer.user.id))
      .order("desc")
      .collect();

    const requests = await ctx.db
      .query("conciergeRequests")
      .withIndex("by_user", (q: any) => q.eq("userId", viewer.user.id))
      .order("desc")
      .collect();

    const inspirations = await ctx.db
      .query("inspirations")
      .withIndex("by_published", (q: any) => q.eq("published", true))
      .order("desc")
      .take(6);

    return {
      user: viewer.user,
      orders: orders.map((order: any) => ({
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
        measurementProfileId: order.measurementProfileId,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      })),
      measurementProfiles: measurementProfiles.map((profile: any) => ({
        id: profile._id,
        label: profile.label,
        bust: profile.bust,
        waist: profile.waist,
        hips: profile.hips,
        height: profile.height,
        heel: profile.heel,
        notes: profile.notes,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt,
      })),
      conciergeRequests: requests.map((request: any) => ({
        id: request._id,
        message: request.message,
        preferredContact: request.preferredContact,
        timeWindow: request.timeWindow,
        status: request.status,
        createdAt: request.createdAt,
      })),
      inspirations: inspirations.map((item: any) => ({
        id: item._id,
        title: item.title,
        description: item.description,
        url: item.url,
        createdAt: item.createdAt,
      })),
    };
  },
});
