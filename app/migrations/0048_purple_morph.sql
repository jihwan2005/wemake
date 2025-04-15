--> statement-breakpoint
ALTER TABLE "bookmarked_lesson" ALTER COLUMN "lesson_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "bookmarked_lesson" ALTER COLUMN "lesson_id" SET DEFAULT gen_random_uuid();