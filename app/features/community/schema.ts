import {
  bigint,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import type { AnyPgColumn } from "drizzle-orm/pg-core";
import { profiles } from "../users/schema";

export const votePosts = pgTable("vote_posts", {
  vote_post_id: bigint({ mode: "number" })
    .primaryKey()
    .generatedAlwaysAsIdentity(),
  title: text().notNull(),
  content: text().notNull(),
  created_at: timestamp().notNull().defaultNow().notNull(),
  profile_id: uuid()
    .references(() => profiles.profile_id, {
      onDelete: "cascade",
    })
    .notNull(),
});

export const voteOptions = pgTable("vote_options", {
  vote_option_id: bigint({ mode: "number" })
    .primaryKey()
    .generatedAlwaysAsIdentity(),
  vote_post_id: bigint({ mode: "number" })
    .references(() => votePosts.vote_post_id, {
      onDelete: "cascade",
    })
    .notNull(),
  option_text: text().notNull(),
  vote_count: bigint({ mode: "number" }).default(0).notNull(),
});

export const userVotes = pgTable(
  "user_votes",
  {
    vote_post_id: bigint({ mode: "number" })
      .references(() => votePosts.vote_post_id, {
        onDelete: "cascade",
      })
      .notNull(),
    profile_id: uuid()
      .references(() => profiles.profile_id, {
        onDelete: "cascade",
      })
      .notNull(),
    vote_option_id: bigint({ mode: "number" })
      .references(() => voteOptions.vote_option_id, {
        onDelete: "cascade",
      })
      .notNull(),
    voted_at: timestamp().notNull().defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.vote_post_id, table.profile_id] })]
);

export const topics = pgTable("topics", {
  topic_id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  name: text().notNull(),
  slug: text().notNull(),
  created_at: timestamp().notNull().defaultNow(),
});

export const posts = pgTable("posts", {
  post_id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  title: text().notNull(),
  content: text().notNull(),
  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
  topic_id: bigint({ mode: "number" })
    .references(() => topics.topic_id, {
      onDelete: "cascade",
    })
    .notNull(),
  profile_id: uuid()
    .references(() => profiles.profile_id, {
      onDelete: "cascade",
    })
    .notNull(),
  upvotes: bigint({ mode: "number" }).default(0),
});

export const postUpvotes = pgTable(
  "post_upvotes",
  {
    post_id: bigint({ mode: "number" }).references(() => posts.post_id, {
      onDelete: "cascade",
    }),
    profile_id: uuid().references(() => profiles.profile_id, {
      onDelete: "cascade",
    }),
  },
  (table) => [primaryKey({ columns: [table.post_id, table.profile_id] })]
);

export const postReplies = pgTable("post_replies", {
  post_reply_id: bigint({ mode: "number" })
    .primaryKey()
    .generatedAlwaysAsIdentity(),
  post_id: bigint({ mode: "number" }).references(() => posts.post_id, {
    onDelete: "cascade",
  }),
  parent_id: bigint({ mode: "number" }).references(
    (): AnyPgColumn => postReplies.post_reply_id,
    {
      onDelete: "cascade",
    }
  ),
  profile_id: uuid()
    .references(() => profiles.profile_id, {
      onDelete: "cascade",
    })
    .notNull(),
  reply: text().notNull(),
  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
});

export const videoPosts = pgTable("videos", {
  video_id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  title: text(),
  description: text(),
  video_url: text().notNull(),
  created_at: timestamp().notNull().defaultNow(),
  profile_id: uuid()
    .references(() => profiles.profile_id, {
      onDelete: "cascade",
    })
    .notNull(),
  video_thumbnail: text(),
  upvotes: bigint({ mode: "number" }).default(0),
});

export const videoPostUpvotes = pgTable(
  "videos_upvotes",
  {
    video_id: bigint({ mode: "number" }).references(() => videoPosts.video_id, {
      onDelete: "cascade",
    }),
    profile_id: uuid().references(() => profiles.profile_id, {
      onDelete: "cascade",
    }),
  },
  (table) => [primaryKey({ columns: [table.video_id, table.profile_id] })]
);

export const videoPostReplies = pgTable("videos_replies", {
  video_reply_id: bigint({ mode: "number" })
    .primaryKey()
    .generatedAlwaysAsIdentity(),
  video_id: bigint({ mode: "number" }).references(() => videoPosts.video_id, {
    onDelete: "cascade",
  }),
  profile_id: uuid()
    .references(() => profiles.profile_id, {
      onDelete: "cascade",
    })
    .notNull(),
  reply: text().notNull(),
  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
});