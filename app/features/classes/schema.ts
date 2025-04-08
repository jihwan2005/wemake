import {
  bigint,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { profiles } from "../users/schema";
import { DIFFICULTY_TYPES } from "./constants";

export const difficultyTypes = pgEnum(
  "difficulty_type",
  DIFFICULTY_TYPES.map((type) => type.value) as [string, ...string[]]
);

export const hashtags = pgTable("hashtags", {
  hashtag_id: uuid().primaryKey().defaultRandom(),
  tag: text().notNull().unique(),
});

export const classPostHashtags = pgTable("classPost_with_hashtags", {
  class_post_id: bigint({ mode: "number" })
    .references(() => classPosts.class_post_id, { onDelete: "cascade" })
    .notNull(),
  hashtag_id: uuid()
    .references(() => hashtags.hashtag_id, { onDelete: "cascade" })
    .notNull(),
});

export const classPosts = pgTable("class_posts", {
  class_post_id: bigint({ mode: "number" })
    .primaryKey()
    .generatedAlwaysAsIdentity(),
  title: text().notNull(),
  description: text().notNull(),
  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
  profile_id: uuid()
    .references(() => profiles.profile_id, {
      onDelete: "cascade",
    })
    .notNull(),
  class_poster: text(),
  start_at: timestamp().defaultNow(),
  end_at: timestamp().defaultNow(),
  field: text().notNull(),
  difficulty_type: difficultyTypes().notNull(),
});
