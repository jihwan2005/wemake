CREATE TABLE "class_quiz_images" (
	"quiz_image_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "class_quiz_images_quiz_image_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"question_id" bigint NOT NULL,
	"image_url" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "class_quiz_videos" (
	"quiz_video_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "class_quiz_videos_quiz_video_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"question_id" bigint NOT NULL,
	"video_url" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "class_quiz_images" ADD CONSTRAINT "class_quiz_images_question_id_class_quiz_questions_question_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."class_quiz_questions"("question_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class_quiz_videos" ADD CONSTRAINT "class_quiz_videos_question_id_class_quiz_questions_question_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."class_quiz_questions"("question_id") ON DELETE cascade ON UPDATE no action;