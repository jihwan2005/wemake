CREATE TYPE "public"."difficulty_type" AS ENUM('beginner', 'Intermediate', 'advanced');--> statement-breakpoint
ALTER TABLE "class_posts" ADD COLUMN "difficulty_type" "difficulty_type" NOT NULL;