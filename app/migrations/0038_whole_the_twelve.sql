CREATE TABLE "class_chapter" (
	"chapter_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"class_post_id" bigint NOT NULL,
	"title" text
);
--> statement-breakpoint
CREATE TABLE "class_chapter_lesson" (
	"lesson_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"chapter_id" uuid NOT NULL,
	"title" text,
	"video_url" text
);
--> statement-breakpoint
ALTER TABLE "class_chapter" ADD CONSTRAINT "class_chapter_class_post_id_class_posts_class_post_id_fk" FOREIGN KEY ("class_post_id") REFERENCES "public"."class_posts"("class_post_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class_chapter_lesson" ADD CONSTRAINT "class_chapter_lesson_chapter_id_class_chapter_chapter_id_fk" FOREIGN KEY ("chapter_id") REFERENCES "public"."class_chapter"("chapter_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
--ALTER TABLE "public"."class_posts" ALTER COLUMN "difficulty_type" SET DATA TYPE text;--> statement-breakpoint
--DROP TYPE "public"."difficulty_type";--> statement-breakpoint
--CREATE TYPE "public"."difficulty_type" AS ENUM('beginner', 'intermediate', 'advanced');--> statement-breakpoint
--ALTER TABLE "public"."class_posts" ALTER COLUMN "difficulty_type" SET DATA TYPE "public"."difficulty_type" USING "difficulty_type"::"public"."difficulty_type";