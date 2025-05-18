CREATE TABLE "class_mindmap_edge" (
	"mindmap_id" bigint NOT NULL,
	"edge_id" text NOT NULL,
	"source_node_id" text NOT NULL,
	"target_node_id" text NOT NULL,
	CONSTRAINT "class_mindmap_edge_source_node_id_target_node_id_pk" PRIMARY KEY("source_node_id","target_node_id")
);
--> statement-breakpoint
CREATE TABLE "class_mindmap_node" (
	"mindmap_id" bigint NOT NULL,
	"node_id" text PRIMARY KEY NOT NULL,
	"parent_id" text,
	"node_label" text,
	"position_x" integer NOT NULL,
	"position_y" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "class_mindmap_edge" ADD CONSTRAINT "class_mindmap_edge_mindmap_id_class_mindmap_mindmap_id_fk" FOREIGN KEY ("mindmap_id") REFERENCES "public"."class_mindmap"("mindmap_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class_mindmap_edge" ADD CONSTRAINT "class_mindmap_edge_source_node_id_class_mindmap_node_node_id_fk" FOREIGN KEY ("source_node_id") REFERENCES "public"."class_mindmap_node"("node_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class_mindmap_edge" ADD CONSTRAINT "class_mindmap_edge_target_node_id_class_mindmap_node_node_id_fk" FOREIGN KEY ("target_node_id") REFERENCES "public"."class_mindmap_node"("node_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class_mindmap_node" ADD CONSTRAINT "class_mindmap_node_mindmap_id_class_mindmap_mindmap_id_fk" FOREIGN KEY ("mindmap_id") REFERENCES "public"."class_mindmap"("mindmap_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class_mindmap_node" ADD CONSTRAINT "class_mindmap_node_parent_id_class_mindmap_node_node_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."class_mindmap_node"("node_id") ON DELETE cascade ON UPDATE no action;