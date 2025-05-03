CREATE TABLE "class_message_images" (
	"message_image_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "class_message_images_message_image_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"class_message_room_id" bigint,
	"image_url" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "class_message_images" ADD CONSTRAINT "class_message_images_class_message_room_id_class_message_rooms_class_message_room_id_fk" FOREIGN KEY ("class_message_room_id") REFERENCES "public"."class_message_rooms"("class_message_room_id") ON DELETE cascade ON UPDATE no action;