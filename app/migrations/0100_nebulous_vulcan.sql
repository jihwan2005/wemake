CREATE TABLE "class_quiz_score_dispute" (
	"dispute_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "class_quiz_score_dispute_dispute_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"answer_id" bigint NOT NULL,
	"profile_id" uuid NOT NULL,
	"dispute_text" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "class_quiz_score_dispute" ADD CONSTRAINT "class_quiz_score_dispute_answer_id_class_quiz_answers_answer_id_fk" FOREIGN KEY ("answer_id") REFERENCES "public"."class_quiz_answers"("answer_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class_quiz_score_dispute" ADD CONSTRAINT "class_quiz_score_dispute_profile_id_profiles_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;