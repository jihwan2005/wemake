ALTER TABLE "class_book_cover" RENAME COLUMN "mindmap_id" TO "book_id";--> statement-breakpoint
ALTER TABLE "class_book_cover" DROP CONSTRAINT "class_book_cover_mindmap_id_class_mindmap_mindmap_id_fk";
--> statement-breakpoint
ALTER TABLE "class_book_cover" ADD CONSTRAINT "class_book_cover_book_id_class_book_book_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."class_book"("book_id") ON DELETE cascade ON UPDATE no action;