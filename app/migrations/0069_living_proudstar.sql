CREATE TABLE "class_certificate" (
	"profile_id" uuid NOT NULL,
	"class_post_id" bigint NOT NULL,
	"issued_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "class_certificate_profile_id_class_post_id_pk" PRIMARY KEY("profile_id","class_post_id")
);
--> statement-breakpoint
ALTER TABLE "class_certificate" ADD CONSTRAINT "class_certificate_profile_id_profiles_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class_certificate" ADD CONSTRAINT "class_certificate_class_post_id_class_posts_class_post_id_fk" FOREIGN KEY ("class_post_id") REFERENCES "public"."class_posts"("class_post_id") ON DELETE cascade ON UPDATE no action;