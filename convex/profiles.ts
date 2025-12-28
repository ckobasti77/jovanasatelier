import { v } from "convex/values";

import { mutation, query, type MutationCtx, type QueryCtx } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import { getViewer } from "./session";
import { now } from "./utils";

const MEASUREMENT_FIELDS = {
  label: v.string(),
  bust: v.number(),
  waist: v.number(),
  hips: v.number(),
  height: v.number(),
  heel: v.number(),
  notes: v.optional(v.string()),
};

export const list = query({
  args: { sessionToken: v.optional(v.string()) },
  handler: async (ctx: QueryCtx, args: { sessionToken?: string }) => {
    const viewer = await getViewer(ctx, args.sessionToken);
    if (!viewer) return [];

    const profiles = await ctx.db
      .query("measurementProfiles")
      .withIndex("by_user", (q) => q.eq("userId", viewer.user.id))
      .order("desc")
      .collect();

    return profiles.map((profile) => ({
      id: profile._id,
      ...profile,
    }));
  },
});

export const get = query({
  args: {
    sessionToken: v.optional(v.string()),
    profileId: v.id("measurementProfiles"),
  },
  handler: async (
    ctx: QueryCtx,
    args: { sessionToken?: string; profileId: Id<"measurementProfiles"> },
  ) => {
    const viewer = await getViewer(ctx, args.sessionToken);
    if (!viewer) return null;

    const profile = await ctx.db.get(args.profileId);
    if (!profile || profile.userId !== viewer.user.id) {
      return null;
    }

    return {
      id: profile._id,
      label: profile.label,
      bust: profile.bust,
      waist: profile.waist,
      hips: profile.hips,
      height: profile.height,
      heel: profile.heel,
      notes: profile.notes ?? undefined,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    };
  },
});

type UpsertArgs = {
  sessionToken?: string;
  profileId?: Id<"measurementProfiles">;
  label: string;
  bust: number;
  waist: number;
  hips: number;
  height: number;
  heel: number;
  notes?: string;
};

export const upsert = mutation({
  args: {
    sessionToken: v.optional(v.string()),
    profileId: v.optional(v.id("measurementProfiles")),
    ...MEASUREMENT_FIELDS,
  },
  handler: async (ctx: MutationCtx, args: UpsertArgs) => {
    const { sessionToken, profileId, ...profileData } = args;
    const viewer = await getViewer(ctx, sessionToken);
    if (!viewer) {
      throw new Error("AUTH_UNAUTHORIZED");
    }

    const timestamp = now();

    if (profileId) {
      const existing = await ctx.db.get(profileId);
      if (!existing || existing.userId !== viewer.user.id) {
        throw new Error("PROFILE_NOT_FOUND");
      }
      await ctx.db.patch(profileId, {
        ...profileData,
        updatedAt: timestamp,
      });
      return profileId;
    }

    return ctx.db.insert("measurementProfiles", {
      userId: viewer.user.id,
      ...profileData,
      createdAt: timestamp,
      updatedAt: timestamp,
    });
  },
});

type RemoveArgs = {
  sessionToken?: string;
  profileId: Id<"measurementProfiles">;
};

export const remove = mutation({
  args: {
    sessionToken: v.optional(v.string()),
    profileId: v.id("measurementProfiles"),
  },
  handler: async (ctx: MutationCtx, args: RemoveArgs) => {
    const viewer = await getViewer(ctx, args.sessionToken);
    if (!viewer) throw new Error("AUTH_UNAUTHORIZED");

    const profile = await ctx.db.get(args.profileId);
    if (!profile || profile.userId !== viewer.user.id) {
      throw new Error("PROFILE_NOT_FOUND");
    }

    await ctx.db.delete(args.profileId);
    return true;
  },
});
