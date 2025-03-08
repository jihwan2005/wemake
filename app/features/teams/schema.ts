import {
  bigint,
  check,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { PRODUCT_STAGES } from "./constants";
import { sql } from "drizzle-orm";

export const productStage = pgEnum(
  "product_stage",
  PRODUCT_STAGES.map((stage) => stage.value) as [string, ...string[]]
);

export const team = pgTable(
  "team",
  {
    team_id: bigint({ mode: "number" })
      .primaryKey()
      .generatedAlwaysAsIdentity(),
    product_name: text().notNull(),
    team_size: integer().notNull(),
    equity_split: integer().notNull(),
    product_stage: productStage().notNull(),
    roles: text().notNull(),
    product_description: text().notNull(),
    created_at: timestamp().notNull().defaultNow(),
    updated_at: timestamp().notNull().defaultNow(),
  },
  (table) => [
    check("team_size_check", sql`${table.team_size} BETWEEN 1 AND 100`),
    check("equity_split_check", sql`${table.equity_split} BETWEEN 1 AND 100`),
    check(
      "product_description_check",
      sql`LENGTH(${table.product_description}) <= 200`
    ),
  ]
);
