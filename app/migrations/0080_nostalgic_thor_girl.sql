ALTER TABLE "class_message" ADD COLUMN "is_read" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "class_message" ADD COLUMN "read_at" timestamp DEFAULT now() NOT NULL;