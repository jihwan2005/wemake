CREATE TABLE "completed_lesson" (
	"profile_id" uuid NOT NULL,
	"lesson_id" uuid NOT NULL,
	CONSTRAINT "completed_lesson_lesson_id_profile_id_pk" PRIMARY KEY("lesson_id","profile_id")
);
--> statement-breakpoint
ALTER TABLE "completed_lesson" ADD CONSTRAINT "completed_lesson_profile_id_profiles_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "completed_lesson" ADD CONSTRAINT "completed_lesson_lesson_id_class_chapter_lesson_lesson_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."class_chapter_lesson"("lesson_id") ON DELETE cascade ON UPDATE no action;