import {
  bigint,
  boolean,
  date,
  decimal,
  doublePrecision,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
  type AnyPgColumn,
} from "drizzle-orm/pg-core";
import { profiles } from "../../users/schema";
import { DIFFICULTY_TYPES } from "../constants/constants";

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
    is_pinned: boolean().notNull().default(false),
    created_at: timestamp().notNull().defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.class_message_room_id, table.profile_id] }),
  ]
);

export const classMessageRoomNotification = pgTable(
  "class_message_room_notification",
  {
    class_message_room_id: bigint({ mode: "number" }).references(
      () => classMessageRooms.class_message_room_id,
      {
        onDelete: "cascade",
      }
    ),
    notification_id: bigint({ mode: "number" })
      .primaryKey()
      .generatedAlwaysAsIdentity(),
    notification_title: text().notNull(),
    notification_content: text().notNull(),
    profile_id: uuid().references(() => profiles.profile_id, {
      onDelete: "cascade",
    }),
    created_at: timestamp().notNull().defaultNow(),
  }
);

export const classMessageImages = pgTable("class_message_images", {
  message_image_id: bigint({ mode: "number" })
    .primaryKey()
    .generatedAlwaysAsIdentity(),
  class_message_room_id: bigint({ mode: "number" }).references(
    () => classMessageRooms.class_message_room_id,
    {
      onDelete: "cascade",
    }
  ),
  image_url: text().notNull(),
  created_at: timestamp().defaultNow(),
  class_message_id: bigint({ mode: "number" }).references(
    () => classMessage.class_message_id,
    {
      onDelete: "cascade",
    }
  ),
});

export const classQuizzes = pgTable("class_quizzes", {
  class_post_id: bigint({ mode: "number" })
    .references(() => classPosts.class_post_id, { onDelete: "cascade" })
    .notNull(),
  quiz_id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  quiz_title: text().notNull(),
  quiz_description: text().notNull(),
  profile_id: uuid()
    .references(() => profiles.profile_id, {
      onDelete: "cascade",
    })
    .notNull(),
  created_at: timestamp().defaultNow(),
  start_time: timestamp().notNull(),
  end_time: timestamp().notNull(),
  time_limit_minutes: integer(),
  is_public: boolean().default(false).notNull(),
});

export const questionType = pgEnum("question_type", [
  "multiple_choice",
  "short_answer",
  "long_answer",
]);

export const classQuizQuestions = pgTable("class_quiz_questions", {
  question_id: bigint({ mode: "number" })
    .primaryKey()
    .generatedAlwaysAsIdentity(),
  quiz_id: bigint({ mode: "number" })
    .references(() => classQuizzes.quiz_id, { onDelete: "cascade" })
    .notNull(),
  question_text: text().notNull(),
  question_type: questionType().notNull(),
  question_point: integer().notNull().default(1),
  question_position: integer().default(0),
  question_hint: text(),
  question_min_length: integer(),
});

export const classQuizChoices = pgTable("class_quiz_choices", {
  choice_id: bigint({ mode: "number" })
    .primaryKey()
    .generatedAlwaysAsIdentity(),
  question_id: bigint({ mode: "number" })
    .references(() => classQuizQuestions.question_id, { onDelete: "cascade" })
    .notNull(),
  choice_text: text().notNull(),
  choice_position: integer().default(0),
  is_correct: boolean().notNull(),
});

export const classQuizResponses = pgTable("class_quiz_responses", {
  response_id: bigint({ mode: "number" })
    .primaryKey()
    .generatedAlwaysAsIdentity(),
  quiz_id: bigint({ mode: "number" })
    .references(() => classQuizzes.quiz_id, { onDelete: "cascade" })
    .notNull(),
  profile_id: uuid()
    .references(() => profiles.profile_id, {
      onDelete: "cascade",
    })
    .notNull(),
  submitted_at: timestamp().defaultNow(),
});

export const confidenceLevelType = pgEnum("confidence_level_type", [
  "confident", // 확실히 품
  "unsure", // 애매하게 품
  "unanswered", // 아예 못 품
]);

export const classQuizAnswers = pgTable("class_quiz_answers", {
  answer_id: bigint({ mode: "number" })
    .primaryKey()
    .generatedAlwaysAsIdentity(),
  response_id: bigint({ mode: "number" })
    .references(() => classQuizResponses.response_id, { onDelete: "cascade" })
    .notNull(),
  question_id: bigint({ mode: "number" })
    .references(() => classQuizQuestions.question_id, { onDelete: "cascade" })
    .notNull(),
  choice_id: bigint({ mode: "number" }).references(
    () => classQuizChoices.choice_id,
    { onDelete: "cascade" }
  ),
  answer_text: text(),
  confidence_level: confidenceLevelType().notNull().default("unanswered"),
});

export const classQuizImages = pgTable("class_quiz_images", {
  quiz_image_id: bigint({ mode: "number" })
    .primaryKey()
    .generatedAlwaysAsIdentity(),
  question_id: bigint({ mode: "number" })
    .references(() => classQuizQuestions.question_id, { onDelete: "cascade" })
    .notNull(),
  image_url: text().notNull(),
  image_position: integer().default(0),
});

export const classQuizVideos = pgTable("class_quiz_videos", {
  quiz_video_id: bigint({ mode: "number" })
    .primaryKey()
    .generatedAlwaysAsIdentity(),
  question_id: bigint({ mode: "number" })
    .references(() => classQuizQuestions.question_id, { onDelete: "cascade" })
    .notNull(),
  video_url: text().notNull(),
  video_position: integer().default(0),
});

export const classQuizManualScore = pgTable("class_quiz_manual_score", {
  score_id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  answer_id: bigint({ mode: "number" })
    .references(() => classQuizAnswers.answer_id, { onDelete: "cascade" })
    .notNull(),
  score: decimal({ precision: 3, scale: 1 }).notNull(),
  score_reason: text(),
});

export const classQuizScoreDispute = pgTable("class_quiz_score_dispute", {
  dispute_id: bigint({ mode: "number" })
    .primaryKey()
    .generatedAlwaysAsIdentity(),
  answer_id: bigint({ mode: "number" })
    .references(() => classQuizAnswers.answer_id, { onDelete: "cascade" })
    .notNull(),
  profile_id: uuid()
    .references(() => profiles.profile_id, {
      onDelete: "cascade",
    })
    .notNull(),
  dispute_text: text().notNull(), // 학생이 제출한 이의신청 내용
  created_at: timestamp({ withTimezone: true }).defaultNow(),
});

export const classMindMap = pgTable("class_mindmap", {
  mindmap_id: bigint({ mode: "number" })
    .primaryKey()
    .generatedAlwaysAsIdentity(),
  class_post_id: bigint({ mode: "number" })
    .notNull()
    .references(() => classPosts.class_post_id, {
      onDelete: "cascade",
    }),
  mindmap_title: text().notNull(),
  created_at: timestamp({ withTimezone: true }).defaultNow(),
  profile_id: uuid()
    .references(() => profiles.profile_id, {
      onDelete: "cascade",
    })
    .notNull(),
});

export const classMindMapNode = pgTable("class_mindmap_node", {
  mindmap_id: bigint({ mode: "number" })
    .references(() => classMindMap.mindmap_id, { onDelete: "cascade" })
    .notNull(),
  node_id: text().primaryKey(),
  parent_id: text().references((): AnyPgColumn => classMindMapNode.node_id, {
    onDelete: "cascade",
  }),
  node_label: text(),
  position_x: doublePrecision().notNull(),
  position_y: doublePrecision().notNull(),
});

export const classMindMapEdge = pgTable(
  "class_mindmap_edge",
  {
    mindmap_id: bigint({ mode: "number" })
      .references(() => classMindMap.mindmap_id, { onDelete: "cascade" })
      .notNull(),
    edge_id: text().primaryKey(),
    source_node_id: text()
      .notNull()
      .references(() => classMindMapNode.node_id, { onDelete: "cascade" }),
    target_node_id: text()
      .notNull()
      .references(() => classMindMapNode.node_id, { onDelete: "cascade" }),
  },
  (table) => [
    primaryKey({ columns: [table.source_node_id, table.target_node_id] }),
  ]
);

export const classMindMapThumbnail = pgTable("class_mindmap_thumbnail", {
  mindmap_id: bigint({ mode: "number" })
    .primaryKey()
    .references(() => classMindMap.mindmap_id, { onDelete: "cascade" }),
  thumbnail_base64: text().notNull(), // base64 문자열 저장 (또는 bytea로 저장 가능)
});

export const classBook = pgTable("class_book", {
  book_id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  class_post_id: bigint({ mode: "number" })
    .notNull()
    .references(() => classPosts.class_post_id, {
      onDelete: "cascade",
    }),
  book_title: text().notNull(),
  profile_id: uuid()
    .references(() => profiles.profile_id, {
      onDelete: "cascade",
    })
    .notNull(),
  created_at: timestamp({ withTimezone: true }).defaultNow(),
  updated_at: timestamp({ withTimezone: true }).defaultNow(),
});

export const classBookCover = pgTable("class_book_cover", {
  book_id: bigint({ mode: "number" })
    .primaryKey()
    .references(() => classBook.book_id, { onDelete: "cascade" }),
  cover_base64: text(), // base64 문자열 저장 (또는 bytea로 저장 가능)
});