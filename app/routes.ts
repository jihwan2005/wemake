import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  index("common/pages/home-page.tsx"),
  ...prefix("/classes", [
    index("features/classes/pages/main/classes-page.tsx"),
    route(":classId", "features/classes/pages/main/class-page.tsx"),
    route(":classId/lobby", "features/classes/pages/main/class-lobby-page.tsx"),
    route(
      ":classId/quiz",
      "features/classes/pages/quiz/class-quizzes-page.tsx"
    ),
    route(
      ":classId/mindmaps",
      "features/classes/pages/mindmap/class-mindmaps-page.tsx"
    ),
    route(":classId/books", "features/classes/pages/book/class-books-page.tsx"),
    route(
      ":classId/books/:bookId",
      "features/classes/pages/book/class-book-page.tsx"
    ),
    route(
      ":classId/mindmaps/:mindmapId",
      "features/classes/pages/mindmap/class-mindmap-page.tsx"
    ),
    route(
      ":classId/quiz/public",
      "features/classes/pages/action/quiz/class-quizzes-public-page.tsx"
    ),
    route(
      ":classId/quiz/:quizId/upload",
      "features/classes/pages/quiz/class-quiz-upload-page.tsx"
    ),
    route(
      ":classId/quiz/:quizId/insight",
      "features/classes/pages/quiz/class-quiz-insight-page.tsx"
    ),
    route(
      ":classId/quiz/:quizId/delete",
      "features/classes/pages/action/quiz/class-quiz-delete-page.tsx"
    ),
    route(
      ":classId/quiz/:quizId/",
      "features/classes/pages/quiz/class-quiz-page.tsx"
    ),
    route(
      ":classId/quiz/:quizId/result",
      "features/classes/pages/quiz/class-quiz-result-page.tsx"
    ),
    route(
      ":classId/quiz/:quizId/score",
      "features/classes/pages/quiz/class-quiz-score-page.tsx"
    ),
    route("/my", "features/classes/pages/main/class-my-page.tsx"),
    route("/keyword", "features/classes/pages/action/keyword-page.tsx"),
    route(
      "/:notificationId/see",
      "features/classes/pages/action/class/see-class-notification-page.tsx"
    ),
    route(
      "/:notificationId/delete",
      "features/classes/pages/action/class/delete-class-notification-page.tsx"
    ),
    route(
      ":classId/lesson/:lessonId",
      "features/classes/pages/lesson/lesson-page.tsx"
    ),
    route(
      ":classId/send-message",
      "features/classes/pages/action/message/class-send-message-page.tsx"
    ),
    route(
      "/:classId/enroll",
      "features/classes/pages/action/class/class-enroll-page.tsx"
    ),
    route(
      "/:classId/upvote",
      "features/classes/pages/action/class/class-upvote-page.tsx"
    ),
    route(
      "/:classId/review",
      "features/classes/pages/action/review/class-review-page.tsx"
    ),
    route(
      "/:classId/attendance",
      "features/classes/pages/action/class/class-attendance-page.tsx"
    ),
    route(
      "/:classId/review/update",
      "features/classes/pages/action/review/class-review-update-page.tsx"
    ),
    route(
      "/:classId/review/delete",
      "features/classes/pages/action/review/class-review-delete-page.tsx"
    ),
    route(
      ":classId/:lessonId/bookmark",
      "features/classes/pages/action/lesson/lesson-bookmark-page.tsx"
    ),
    route(
      ":classId/:lessonId/complete",
      "features/classes/pages/action/lesson/lesson-complete-page.tsx"
    ),
    layout("features/classes/layouts/class-messages-layout.tsx", [
      ...prefix("/messages", [
        index("features/classes/pages/message/class-messages-page.tsx"),
        route(
          "/deliver",
          "features/classes/pages/action/message/class-message-deliver-page.tsx"
        ),
        route(
          "/:classMessageRoomId",
          "features/classes/pages/message/class-message-page.tsx"
        ),
        route(
          "/:classMessageRoomId/delete",
          "features/classes/pages/action/message/class-message-delete-page.tsx"
        ),
        route(
          "/:classMessageRoomId/restore",
          "features/classes/pages/action/message/class-message-restore-page.tsx"
        ),
        route(
          "/:classMessageRoomId/update",
          "features/classes/pages/action/message/class-message-update-page.tsx"
        ),
        route(
          "/:classMessageRoomId/pin",
          "features/classes/pages/action/message/class-message-pin-page.tsx"
        ),
      ]),
    ]),
  ]),
  ...prefix("/auth", [
    layout("features/auth/layouts/auth-layout.tsx", [
      route("/login", "features/auth/pages/login-page.tsx"),
      route("/join", "features/auth/pages/join-page.tsx"),
      ...prefix("/otp", [
        route("/start", "features/auth/pages/otp-start-page.tsx"),
        route("/complete", "features/auth/pages/otp-complete-page.tsx"),
      ]),
      ...prefix("/social/:provider", [
        route("/start", "features/auth/pages/social-start-page.tsx"),
        route("/complete", "features/auth/pages/social-complete-page.tsx"),
      ]),
    ]),
    route("/logout", "features/auth/pages/logout-page.tsx"),
  ]),
  ...prefix("/my", [
    layout("features/users/layouts/dashboard-layout.tsx", [
      ...prefix("/dashboard", [
        index("features/users/pages/dashboard-page.tsx"),
        route("/ideas", "features/users/pages/dashboard-ideas-page.tsx"),
        route(
          "/products/:productId",
          "features/users/pages/dashboard-product-page.tsx"
        ),
      ]),
    ]),
    layout("features/users/layouts/messages-layout.tsx", [
      ...prefix("/messages", [
        index("features/users/pages/messages-page.tsx"),
        route("/:messageRoomId", "features/users/pages/message-page.tsx"),
      ]),
    ]),
    route("/profile", "features/users/pages/my-profile-page.tsx"),
    route("/settings", "features/users/pages/settings-page.tsx"),
    route("/notifications", "features/users/pages/notifications-page.tsx"),
    route(
      "/notifications/:notificationId/see",
      "features/users/pages/see-notification-page.tsx"
    ),
  ]),
  ...prefix("/users/:username", [
    layout("features/users/layouts/profile-layout.tsx", [
      index("features/users/pages/profile-page.tsx"),
      route("/products", "features/users/pages/profile-products-page.tsx"),
      route("/posts", "features/users/pages/profile-posts-page.tsx"),
    ]),
    route("/messages", "features/users/pages/send-message-page.tsx"),
  ]),
] satisfies RouteConfig;