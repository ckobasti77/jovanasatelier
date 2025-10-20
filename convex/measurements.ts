import { v } from "convex/values";

import { query } from "./_generated/server";

export const listLabels = query({
  args: {
    locale: v.optional(v.string()),
  },
  handler: async (ctx, args: { locale?: string }) => {
    const requestedLocale = (args.locale ?? "en").toLowerCase();

    const byLocale = await ctx.db
      .query("measurementLabels")
      .withIndex("by_locale", (q) => q.eq("locale", requestedLocale))
      .collect();

    const result = new Map<string, { label: string; helper?: string }>();
    for (const record of byLocale) {
      result.set(record.key, { label: record.label, helper: record.helper ?? undefined });
    }

    if (requestedLocale !== "en") {
      const english = await ctx.db
        .query("measurementLabels")
        .withIndex("by_locale", (q) => q.eq("locale", "en"))
        .collect();
      for (const record of english) {
        if (!result.has(record.key)) {
          result.set(record.key, { label: record.label, helper: record.helper ?? undefined });
        }
      }
    }

    return Array.from(result.entries()).map(([key, value]) => ({
      key,
      label: value.label,
      helper: value.helper,
    }));
  },
});
