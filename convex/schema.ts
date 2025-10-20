import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    name: v.string(),
    phone: v.optional(v.string()),
    passwordHash: v.string(),
    role: v.string(), // "client" | "admin"
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_role", ["role"]),

  sessions: defineTable({
    userId: v.id("users"),
    token: v.string(),
    expiresAt: v.number(),
    createdAt: v.number(),
  })
    .index("by_token", ["token"])
    .index("by_user", ["userId"]),

  measurementProfiles: defineTable({
    userId: v.id("users"),
    label: v.string(),
    bust: v.number(),
    waist: v.number(),
    hips: v.number(),
    height: v.number(),
    heel: v.number(),
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]),

  orders: defineTable({
    userId: v.id("users"),
    orderCode: v.string(),
    dressModel: v.string(),
    color: v.string(),
    fabric: v.string(),
    status: v.string(),
    stage: v.string(),
    eta: v.optional(v.number()),
    measurementProfileId: v.optional(v.id("measurementProfiles")),
    productionTimeline: v.array(
      v.object({
        label: v.string(),
        completed: v.boolean(),
        completedAt: v.optional(v.number()),
      }),
    ),
    progressUpdates: v.optional(
      v.array(
        v.object({
          id: v.string(),
          title: v.string(),
          message: v.string(),
          timelineLabel: v.optional(v.string()),
          createdAt: v.number(),
          sharedAt: v.optional(v.number()),
        }),
      ),
    ),
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
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_code", ["orderCode"]),

  conciergeRequests: defineTable({
    userId: v.id("users"),
    message: v.string(),
    preferredContact: v.optional(v.string()),
    timeWindow: v.optional(v.string()),
    status: v.string(), // open | in_progress | closed
    createdAt: v.number(),
  }).index("by_user", ["userId"]),

  inspirations: defineTable({
    title: v.string(),
    description: v.string(),
    url: v.string(),
    createdAt: v.number(),
    published: v.boolean(),
  }).index("by_published", ["published"]),

  measurementLabels: defineTable({
    key: v.string(),
    locale: v.string(),
    label: v.string(),
    helper: v.optional(v.string()),
  })
    .index("by_locale", ["locale"])
    .index("by_key_locale", ["key", "locale"]),
});
