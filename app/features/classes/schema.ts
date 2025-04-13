import {
  bigint,
  pgEnum,
  pgTable,
  primaryKey,
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
  upvotes: bigint({ mode: "number" }).default(0),
  learners: bigint({ mode: "number" }).default(0),
  reviews: bigint({ mode: "number" }).default(0),
});

export const classChapter = pgTable("class_chapter", {
  chapter_id: uuid().primaryKey().defaultRandom(),
  class_post_id: bigint({ mode: "number" })
    .references(() => classPosts.class_post_id, { onDelete: "cascade" })
    .notNull(),
  title: text(),
});

export const classChapterLesson = pgTable("class_chapter_lesson", {
  lesson_id: uuid().primaryKey().defaultRandom(),
  chapter_id: uuid()
    .references(() => classChapter.chapter_id, { onDelete: "cascade" })
    .notNull(),
  title: text(),
  video_url: text(),
});

export const classUpvotes = pgTable(
  "class_upvotes",
  {
    class_post_id: bigint({ mode: "number" }).references(
      () => classPosts.class_post_id,
      {
        onDelete: "cascade",
      }
    ),
    profile_id: uuid().references(() => profiles.profile_id, {
      onDelete: "cascade",
    }),
  },
  (table) => [primaryKey({ columns: [table.class_post_id, table.profile_id] })]
);

export const classReviews = pgTable("class_reviews", {
  class_review_id: bigint({ mode: "number" })
    .primaryKey()
    .generatedAlwaysAsIdentity(),
  class_post_id: bigint({ mode: "number" }).references(
    () => classPosts.class_post_id,
    {
      onDelete: "cascade",
    }
  ),
  profile_id: uuid()
    .references(() => profiles.profile_id, {
      onDelete: "cascade",
    })
    .notNull(),
  review: text().notNull(),
  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
});

export const classEnrollments = pgTable("class_enrollments", {
  enrollment_id: bigint({ mode: "number" })
    .primaryKey()
    .generatedAlwaysAsIdentity(),
  profile_id: uuid()
    .references(() => profiles.profile_id, {
      onDelete: "cascade",
    })
    .notNull(),
  class_post_id: bigint({ mode: "number" })
    .references(() => classPosts.class_post_id, { onDelete: "cascade" })
    .notNull(),
  enrolled_at: timestamp().notNull().defaultNow(),
});