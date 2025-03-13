import { createClient } from "@supabase/supabase-js";
import type { Database as SupabaseDatabase } from "database.types";
import type { MergeDeep } from "type-fest/source/merge-deep.d.ts";
import type { SetNonNullable } from "type-fest/source/set-non-nullable.d.ts";
import type { SetFieldType } from "type-fest/source/set-field-type.d.ts";

type Database = MergeDeep<
  SupabaseDatabase,
  {
    public: {
      Views: {
        community_post_list_view: {
          Row: SetFieldType<
            SetNonNullable<
              SupabaseDatabase["public"]["Views"]["community_post_list_view"]["Row"]
            >,
            "author_avatar",
            string | null
          >;
        };
        gpt_ideas_view: {
          Row: SetNonNullable<
            SupabaseDatabase["public"]["Views"]["gpt_ideas_view"]["Row"]
          >;
        };
      };
    };
  }
>;

const client = createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export default client;
