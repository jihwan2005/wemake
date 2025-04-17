CREATE TABLE "class_Attendance" (
	"profile_id" uuid NOT NULL,
	"class_post_id" bigint NOT NULL,
	"date" date NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "class_Attendance_profile_id_class_post_id_date_pk" PRIMARY KEY("profile_id","class_post_id","date")
);
--> statement-breakpoint
ALTER TABLE "class_Attendance" ADD CONSTRAINT "class_Attendance_profile_id_profiles_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class_Attendance" ADD CONSTRAINT "class_Attendance_class_post_id_class_posts_class_post_id_fk" FOREIGN KEY ("class_post_id") REFERENCES "public"."class_posts"("class_post_id") ON DELETE cascade ON UPDATE no action;