import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const insertLead = mutation({
  args: {
    fullName: v.string(),
    email: v.string(),
    contactNumber: v.string(),
    whatsAppNumber: v.string(),
    requirement: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const leadId = await ctx.db.insert("leads", {
      fullName: args.fullName,
      email: args.email,
      contactNumber: args.contactNumber,
      whatsAppNumber: args.whatsAppNumber,
      requirement: args.requirement,
    });
    return leadId;
  },
});

export const getLeads = query({
  args: {},
  handler: async (ctx) => {
    // Convex automatically stores _creationTime. We sort descending (newest first).
    return await ctx.db.query("leads").order("desc").collect();
  },
});
