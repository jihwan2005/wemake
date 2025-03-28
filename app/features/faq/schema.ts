import { bigint, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { profiles } from "../users/schema";

export const faq = pgTable("faq", {
  faq_id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  question: text().notNull(),
  profile_id: uuid()
    .notNull()
    .references(() => profiles.profile_id, {
      onDelete: "cascade",
    }),
  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
});
