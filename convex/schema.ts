import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  leads: defineTable({
    fullName: v.string(),
    email: v.string(),
    contactNumber: v.string(),
    whatsAppNumber: v.string(),
    requirement: v.optional(v.string()),
  }),
});
