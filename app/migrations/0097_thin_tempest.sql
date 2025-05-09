CREATE TABLE "class_quiz_manual_score" (
	"score_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "class_quiz_manual_score_score_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"answer_id" bigint NOT NULL,
	"score" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "class_quiz_manual_score" ADD CONSTRAINT "class_quiz_manual_score_answer_id_class_quiz_answers_answer_id_fk" FOREIGN KEY ("answer_id") REFERENCES "public"."class_quiz_answers"("answer_id") ON DELETE cascade ON UPDATE no action;