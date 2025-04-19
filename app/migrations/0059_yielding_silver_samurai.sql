CREATE TYPE "public"."class_notification_type" AS ENUM('upload');--> statement-breakpoint
CREATE TABLE "class_notifications" (
	"notification_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "class_notifications_notification_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"source_id" uuid,
	"lesson_id" uuid,
	"target_id" uuid NOT NULL,
	"seen" boolean DEFAULT false NOT NULL,
	"type" "class_notification_type" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "class_notifications" ADD CONSTRAINT "class_notifications_source_id_profiles_profile_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class_notifications" ADD CONSTRAINT "class_notifications_lesson_id_class_chapter_lesson_lesson_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."class_chapter_lesson"("lesson_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class_notifications" ADD CONSTRAINT "class_notifications_target_id_profiles_profile_id_fk" FOREIGN KEY ("target_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;