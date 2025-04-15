CREATE TABLE "bookmarked_lesson" (
	"profile_id" uuid NOT NULL,
	"lesson_id" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "bookmarked_lesson" ADD CONSTRAINT "bookmarked_lesson_profile_id_profiles_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookmarked_lesson" ADD CONSTRAINT "bookmarked_lesson_lesson_id_class_chapter_lesson_lesson_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."class_chapter_lesson"("lesson_id") ON DELETE cascade ON UPDATE no action;