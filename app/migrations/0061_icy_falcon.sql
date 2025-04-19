CREATE TABLE "class_notify" (
	"notify_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "class_notify_notify_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"class_post_id" bigint NOT NULL,
	"profile_id" uuid NOT NULL,
	"notify_text" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "class_notify" ADD CONSTRAINT "class_notify_class_post_id_class_posts_class_post_id_fk" FOREIGN KEY ("class_post_id") REFERENCES "public"."class_posts"("class_post_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class_notify" ADD CONSTRAINT "class_notify_profile_id_profiles_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;