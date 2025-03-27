import {
  bigint,
  pgTable,
  text,
  timestamp,
  uuid,
  primaryKey,
} from "drizzle-orm/pg-core";
import { profiles } from "../users/schema";

export const feedback = pgTable("feedback", {
  feedback_id: bigint({ mode: "number" })
    .primaryKey()
    .generatedAlwaysAsIdentity(),
  content: text().notNull(),
  profile_id: uuid()
    .references(() => profiles.profile_id, {
      onDelete: "cascade",
    })
    .notNull(),
  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
  upvotes: bigint({ mode: "number" }).default(0),
});

export const feedbackUpvotes = pgTable(
  "feedback_upvotes",
  {
    feedback_id: bigint({ mode: "number" }).references(
      () => feedback.feedback_id,
      {
        onDelete: "cascade",
      }
    ),
    profile_id: uuid().references(() => profiles.profile_id, {
      onDelete: "cascade",
    }),
  },
  (table) => [primaryKey({ columns: [table.feedback_id, table.profile_id] })]
);
