/* eslint-disable @typescript-eslint/no-explicit-any */
import { v } from "convex/values";

import { mutation, query, type MutationCtx, type QueryCtx } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import {
  generateSessionToken,
  hashPassword,
  now,
  sessionExpiry,
  verifyPassword,
} from "./utils";
import { ADMIN_EMAILS } from "./constants";

export const signUp = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    password: v.string(),
    phone: v.optional(v.string()),
    role: v.optional(v.string()),
  },
  handler: async (
    ctx: MutationCtx,
    args: { email: string; name: string; password: string; phone?: string; role?: string },
  ) => {
    const normalizedEmail = args.email.toLowerCase().trim();
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q: any) => q.eq("email", normalizedEmail))
      .unique();

    if (existingUser) {
      throw new Error("AUTH_EMAIL_ALREADY_REGISTERED");
    }

    const timestamp = now();
    const isAdminEmail = ADMIN_EMAILS.has(normalizedEmail);
    const role = args.role ?? (isAdminEmail ? "admin" : "client");
    const userId = await ctx.db.insert("users", {
      email: normalizedEmail,
      name: args.name,
      phone: args.phone,
      passwordHash: hashPassword(args.password),
      role,
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    const sessionToken = generateSessionToken();
    await ctx.db.insert("sessions", {
      userId,
      token: sessionToken,
      expiresAt: sessionExpiry(),
      createdAt: timestamp,
    });

    const user = await ctx.db.get(userId);
    if (!user) throw new Error("AUTH_SIGNUP_FAILED");

    return {
      sessionToken,
      user: filterUserFields(user),
    };
  },
});

export const signIn = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (
    ctx: MutationCtx,
    args: { email: string; password: string },
  ) => {
    const normalizedEmail = args.email.toLowerCase().trim();
    let user = await ctx.db
      .query("users")
      .withIndex("by_email", (q: any) => q.eq("email", normalizedEmail))
      .unique();

    if (!user) {
      throw new Error("AUTH_USER_NOT_FOUND");
    }
    const valid = verifyPassword(args.password, user.passwordHash);
    if (!valid) {
      throw new Error("AUTH_INVALID_PASSWORD");
    }

    if (ADMIN_EMAILS.has(normalizedEmail) && user.role !== "admin") {
      const timestamp = now();
      await ctx.db.patch(user._id, { role: "admin", updatedAt: timestamp });
      user = { ...user, role: "admin", updatedAt: timestamp };
    }

    const sessionToken = generateSessionToken();
    const timestamp = now();
    await ctx.db.insert("sessions", {
      userId: user._id,
      token: sessionToken,
      expiresAt: sessionExpiry(),
      createdAt: timestamp,
    });

    return {
      sessionToken,
      user: filterUserFields(user),
    };
  },
});

export const signOut = mutation({
  args: {
    sessionToken: v.string(),
  },
  handler: async (ctx: MutationCtx, args: { sessionToken: string }) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q: any) => q.eq("token", args.sessionToken))
      .unique();
    if (session) {
      await ctx.db.delete(session._id);
    }
    return true;
  },
});

export const getSession = query({
  args: {
    sessionToken: v.optional(v.string()),
  },
  handler: async (ctx: QueryCtx, args: { sessionToken?: string }) => {
    if (!args.sessionToken) return null;
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q: any) => q.eq("token", args.sessionToken))
      .unique();
    if (!session) return null;
    if (session.expiresAt < now()) {
      await deleteSessionIfPossible(ctx, session._id);
      return null;
    }
    const user = await ctx.db.get(session.userId);
    if (!user) return null;

    return {
      sessionToken: session.token,
      user: filterUserFields(user),
    };
  },
});

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
