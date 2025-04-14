CREATE TABLE "keyword_ranking" (
	"keyword_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "keyword_ranking_keyword_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"keyword_text" text NOT NULL,
	"keyword_frequency" bigint DEFAULT 0
);
