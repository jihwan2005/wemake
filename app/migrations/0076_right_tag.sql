CREATE TABLE "class_showcase_images" (
	"showcase_image_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "class_showcase_images_showcase_image_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"class_post_id" bigint NOT NULL,
	"image_url" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "class_showcase_images" ADD CONSTRAINT "class_showcase_images_class_post_id_class_posts_class_post_id_fk" FOREIGN KEY ("class_post_id") REFERENCES "public"."class_posts"("class_post_id") ON DELETE cascade ON UPDATE no action;