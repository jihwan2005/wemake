ALTER TABLE "class_posts" ALTER COLUMN "start_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "class_posts" ALTER COLUMN "start_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "class_posts" ALTER COLUMN "end_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "class_posts" ALTER COLUMN "end_at" DROP NOT NULL;