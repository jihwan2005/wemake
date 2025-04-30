import {
  bigint,
  boolean,
  date,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { profiles } from "../users/schema";
import { DIFFICULTY_TYPES } from "./constants";
import { profile } from "console";

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
  subtitle: text(),
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

export const classShowcaseImages = pgTable("class_showcase_images", {
  showcase_image_id: bigint({ mode: "number" })
    .primaryKey()
    .generatedAlwaysAsIdentity(),
  class_post_id: bigint({ mode: "number" })
    .notNull()
    .references(() => classPosts.class_post_id, {
      onDelete: "cascade",
    }),
  image_url: text().notNull(),
  created_at: timestamp().defaultNow(),
});

export const classChapter = pgTable("class_chapter", {
  chapter_id: uuid().primaryKey().defaultRandom(),
  class_post_id: bigint({ mode: "number" })
    .references(() => classPosts.class_post_id, { onDelete: "cascade" })
    .notNull(),
  title: text(),
  order: bigint({ mode: "number" }).default(0).notNull(),
});

export const classChapterLesson = pgTable("class_chapter_lesson", {
  lesson_id: uuid().primaryKey().defaultRandom(),
  chapter_id: uuid()
    .references(() => classChapter.chapter_id, { onDelete: "cascade" })
    .notNull(),
  title: text(),
  video_url: text(),
  order: bigint({ mode: "number" }).default(0).notNull(),
  is_hidden: boolean().default(false).notNull(),
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

export const keywordRanking = pgTable("keyword_ranking", {
  keyword_id: bigint({ mode: "number" })
    .primaryKey()
    .generatedAlwaysAsIdentity(),
  keyword_text: text().notNull(),
  keyword_frequency: bigint({ mode: "number" }).default(0),
});

export const bookmarkedLesson = pgTable(
  "bookmarked_lesson",
  {
    profile_id: uuid()
      .references(() => profiles.profile_id, {
        onDelete: "cascade",
      })
      .notNull(),
    lesson_id: uuid()
      .references(() => classChapterLesson.lesson_id, { onDelete: "cascade" })
      .notNull(),
  },
  (table) => [primaryKey({ columns: [table.lesson_id, table.profile_id] })]
);

export const completedLesson = pgTable(
  "completed_lesson",
  {
    profile_id: uuid()
      .references(() => profiles.profile_id, {
        onDelete: "cascade",
      })
      .notNull(),
    lesson_id: uuid()
      .references(() => classChapterLesson.lesson_id, { onDelete: "cascade" })
      .notNull(),
  },
  (table) => [primaryKey({ columns: [table.lesson_id, table.profile_id] })]
);

export const classGoals = pgTable("class_goals", {
  goal_id: uuid().primaryKey().defaultRandom(),
  goal_text: text().notNull(),
  profile_id: uuid()
    .references(() => profiles.profile_id, {
      onDelete: "cascade",
    })
    .notNull(),
  class_post_id: bigint({ mode: "number" })
    .references(() => classPosts.class_post_id, { onDelete: "cascade" })
    .notNull(),
  created_at: timestamp().notNull().defaultNow(),
});

export const checkedGoal = pgTable(
  "checked_goal",
  {
    goal_id: uuid()
      .references(() => classGoals.goal_id, { onDelete: "cascade" })
      .notNull(),
    profile_id: uuid()
      .references(() => profiles.profile_id, {
        onDelete: "cascade",
      })
      .notNull(),
  },
  (table) => [primaryKey({ columns: [table.goal_id, table.profile_id] })]
);

export const classAttendance = pgTable(
  "class_Attendance",
  {
    profile_id: uuid("profile_id")
      .references(() => profiles.profile_id, { onDelete: "cascade" })
      .notNull(),

    class_post_id: bigint({ mode: "number" })
      .references(() => classPosts.class_post_id, { onDelete: "cascade" })
      .notNull(),

    date: date("date").notNull(),

    created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    primaryKey({
      columns: [table.profile_id, table.class_post_id, table.date],
    }),
  ]
);

export const notificationType = pgEnum("class_notification_type", [
  "upload",
  "upload-notify",
  "enrollment",
  "complete",
  "complete-goal",
  "message",
]);

export const classNotifications = pgTable("class_notifications", {
  notification_id: bigint({ mode: "number" })
    .primaryKey()
    .generatedAlwaysAsIdentity(),
  source_id: uuid().references(() => profiles.profile_id, {
    onDelete: "cascade",
  }),
  lesson_id: uuid().references(() => classChapterLesson.lesson_id, {
    onDelete: "cascade",
  }),
  enrollment_id: bigint({ mode: "number" }).references(
    () => classEnrollments.enrollment_id,
    {
      onDelete: "cascade",
    }
  ),
  notify_id: bigint({ mode: "number" }).references(
    () => classNotify.notify_id,
    {
      onDelete: "cascade",
    }
  ),
  message_id: bigint({ mode: "number" }).references(
    () => classMessage.class_message_id,
    {
      onDelete: "cascade",
    }
  ),
  target_id: uuid()
    .references(() => profiles.profile_id, {
      onDelete: "cascade",
    })
    .notNull(),
  seen: boolean().default(false).notNull(),
  type: notificationType().notNull(),
  created_at: timestamp().notNull().defaultNow(),
});

export const classNotify = pgTable("class_notify", {
  notify_id: bigint({ mode: "number" })
    .primaryKey()
    .generatedAlwaysAsIdentity(),
  class_post_id: bigint({ mode: "number" })
    .references(() => classPosts.class_post_id, { onDelete: "cascade" })
    .notNull(),
  profile_id: uuid()
    .references(() => profiles.profile_id, {
      onDelete: "cascade",
    })
    .notNull(),
  notify_title: text().notNull(),
  notify_content: text(),
  created_at: timestamp().notNull().defaultNow(),
});

export const classCertificate = pgTable(
  "class_certificate",
  {
    profile_id: uuid()
      .references(() => profiles.profile_id, { onDelete: "cascade" })
      .notNull(),
    class_post_id: bigint({ mode: "number" })
      .references(() => classPosts.class_post_id, { onDelete: "cascade" })
      .notNull(),
    issued_at: timestamp().defaultNow().notNull(),
  },
  (table) => [primaryKey({ columns: [table.profile_id, table.class_post_id] })]
);

export const classMessage = pgTable("class_message", {
  class_message_id: bigint({ mode: "number" })
    .primaryKey()
    .generatedAlwaysAsIdentity(),
  class_message_room_id: bigint({ mode: "number" }).references(
    () => classMessageRooms.class_message_room_id,
    {
      onDelete: "cascade",
    }
  ),
  sender: uuid()
    .references(() => profiles.profile_id, {
      onDelete: "cascade",
    })
    .notNull(),
  message_content: text().notNull(),
  created_at: timestamp().notNull().defaultNow(),
  is_read: boolean().notNull().default(false),
  is_delete: boolean().notNull().default(false),
  is_edited: boolean().notNull().default(false),
  read_at: timestamp().notNull().defaultNow(),
});

export const classMessageRooms = pgTable("class_message_rooms", {
  class_message_room_id: bigint({ mode: "number" })
    .primaryKey()
    .generatedAlwaysAsIdentity(),
  created_at: timestamp().notNull().defaultNow(),
});

export const messageRoomMembers = pgTable(
  "class_message_room_members",
  {
    class_message_room_id: bigint({ mode: "number" }).references(
      () => classMessageRooms.class_message_room_id,
      {
        onDelete: "cascade",
      }
    ),
    profile_id: uuid().references(() => profiles.profile_id, {
      onDelete: "cascade",
    }),
    created_at: timestamp().notNull().defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.class_message_room_id, table.profile_id] }),
  ]
);

