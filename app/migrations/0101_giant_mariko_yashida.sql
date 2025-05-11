CREATE TABLE "class_mindmap" (
	"mindmap_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "class_mindmap_mindmap_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"class_post_id" bigint NOT NULL,
	"mindmap_title" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"profile_id" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "class_mindmap" ADD CONSTRAINT "class_mindmap_class_post_id_class_posts_class_post_id_fk" FOREIGN KEY ("class_post_id") REFERENCES "public"."class_posts"("class_post_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class_mindmap" ADD CONSTRAINT "class_mindmap_profile_id_profiles_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;