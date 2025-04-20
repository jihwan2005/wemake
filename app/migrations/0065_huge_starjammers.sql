ALTER TABLE "class_notify" RENAME COLUMN "notify_text" TO "notify_title";--> statement-breakpoint
ALTER TABLE "class_notify" ADD COLUMN "notify_content" text;