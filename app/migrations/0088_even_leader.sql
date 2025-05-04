CREATE TYPE "public"."question_type" AS ENUM('multiple_choice', 'short_answer', 'long_answer');--> statement-breakpoint
CREATE TABLE "class_quiz_answers" (
	"answer_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "class_quiz_answers_answer_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"response_id" bigint NOT NULL,
	"question_id" bigint NOT NULL,
	"choice_id" bigint,
	"answer_text" text
);
--> statement-breakpoint
CREATE TABLE "class_quiz_choices" (
	"choice_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "class_quiz_choices_choice_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"question_id" bigint NOT NULL,
	"choice_text" text NOT NULL,
	"is_correct" boolean NOT NULL
);
--> statement-breakpoint
CREATE TABLE "class_quiz_questions" (
	"question_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "class_quiz_questions_question_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"quiz_id" bigint NOT NULL,
	"question_text" text NOT NULL,
	"question_type" "question_type" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "class_quiz_responses" (
	"response_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "class_quiz_responses_response_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"quiz_id" bigint NOT NULL,
	"profile_id" uuid NOT NULL,
	"submitted_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "class_quizzes" (
	"class_post_id" bigint NOT NULL,
	"quiz_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "class_quizzes_quiz_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"quiz_title" text NOT NULL,
	"quiz_description" text NOT NULL,
	"profile_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"start_time" timestamp NOT NULL,
	"time_limit_minutes" integer
);
--> statement-breakpoint
ALTER TABLE "class_quiz_answers" ADD CONSTRAINT "class_quiz_answers_response_id_class_quiz_responses_response_id_fk" FOREIGN KEY ("response_id") REFERENCES "public"."class_quiz_responses"("response_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class_quiz_answers" ADD CONSTRAINT "class_quiz_answers_question_id_class_quiz_questions_question_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."class_quiz_questions"("question_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class_quiz_answers" ADD CONSTRAINT "class_quiz_answers_choice_id_class_quiz_choices_choice_id_fk" FOREIGN KEY ("choice_id") REFERENCES "public"."class_quiz_choices"("choice_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class_quiz_choices" ADD CONSTRAINT "class_quiz_choices_question_id_class_quiz_questions_question_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."class_quiz_questions"("question_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class_quiz_questions" ADD CONSTRAINT "class_quiz_questions_quiz_id_class_quizzes_quiz_id_fk" FOREIGN KEY ("quiz_id") REFERENCES "public"."class_quizzes"("quiz_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class_quiz_responses" ADD CONSTRAINT "class_quiz_responses_quiz_id_class_quizzes_quiz_id_fk" FOREIGN KEY ("quiz_id") REFERENCES "public"."class_quizzes"("quiz_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class_quiz_responses" ADD CONSTRAINT "class_quiz_responses_profile_id_profiles_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class_quizzes" ADD CONSTRAINT "class_quizzes_class_post_id_class_posts_class_post_id_fk" FOREIGN KEY ("class_post_id") REFERENCES "public"."class_posts"("class_post_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class_quizzes" ADD CONSTRAINT "class_quizzes_profile_id_profiles_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;