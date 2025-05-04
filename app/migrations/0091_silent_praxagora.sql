ALTER TABLE "class_quiz_choices" ADD COLUMN "choice_position" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "class_quiz_images" ADD COLUMN "image_position" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "class_quiz_questions" ADD COLUMN "question_position" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "class_quiz_videos" ADD COLUMN "video_position" integer DEFAULT 0;