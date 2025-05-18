CREATE TABLE "class_mindmap_thumbnail" (
	"mindmap_id" bigint PRIMARY KEY NOT NULL,
	"thumbnail_base64" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "class_mindmap_thumbnail" ADD CONSTRAINT "class_mindmap_thumbnail_mindmap_id_class_mindmap_mindmap_id_fk" FOREIGN KEY ("mindmap_id") REFERENCES "public"."class_mindmap"("mindmap_id") ON DELETE cascade ON UPDATE no action;