CREATE TABLE "class_book" (
	"book_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "class_book_book_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"class_post_id" bigint NOT NULL,
	"book_title" text NOT NULL,
	"profile_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "class_book_cover" (
	"mindmap_id" bigint PRIMARY KEY NOT NULL,
	"cover_base64" text
);
--> statement-breakpoint
ALTER TABLE "class_book" ADD CONSTRAINT "class_book_class_post_id_class_posts_class_post_id_fk" FOREIGN KEY ("class_post_id") REFERENCES "public"."class_posts"("class_post_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class_book" ADD CONSTRAINT "class_book_profile_id_profiles_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class_book_cover" ADD CONSTRAINT "class_book_cover_mindmap_id_class_mindmap_mindmap_id_fk" FOREIGN KEY ("mindmap_id") REFERENCES "public"."class_mindmap"("mindmap_id") ON DELETE cascade ON UPDATE no action;