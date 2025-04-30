import {
  createBrowserClient,
  createServerClient,
  parseCookieHeader,
  serializeCookieHeader,
} from "@supabase/ssr";
import type { Database as SupabaseDatabase } from "database.types";
import type { MergeDeep } from "type-fest/source/merge-deep.d.ts";
import type { SetNonNullable } from "type-fest/source/set-non-nullable.d.ts";
import type { SetFieldType } from "type-fest/source/set-field-type.d.ts";
import { createClient } from "@supabase/supabase-js";

export type Database = MergeDeep<
  SupabaseDatabase,
  {
    public: {
      Views: {
        messages_view: {
          Row: SetNonNullable<
            SupabaseDatabase["public"]["Views"]["messages_view"]["Row"]
          >;
        };
        community_post_list_view: {
          Row: SetFieldType<
            SetNonNullable<
              SupabaseDatabase["public"]["Views"]["community_post_list_view"]["Row"]
            >,
            "author_avatar",
            string | null
          >;
        };
        product_overview_view: {
          Row: SetNonNullable<
            SupabaseDatabase["public"]["Views"]["product_overview_view"]["Row"]
          >;
        };
        gpt_ideas_view: {
          Row: SetNonNullable<
            SupabaseDatabase["public"]["Views"]["gpt_ideas_view"]["Row"]
          >;
        };
        community_post_detail: {
          Row: SetNonNullable<
            SupabaseDatabase["public"]["Views"]["community_post_detail"]["Row"]
          >;
        };
        feedback_list_view: {
          Row: SetNonNullable<
            SupabaseDatabase["public"]["Views"]["feedback_list_view"]["Row"]
          >;
        };
        faq_list_view: {
          Row: SetNonNullable<
            SupabaseDatabase["public"]["Views"]["faq_list_view"]["Row"]
          >;
        };
        vote_post_list_view: {
          Row: SetNonNullable<
            SupabaseDatabase["public"]["Views"]["vote_post_list_view"]["Row"]
          >;
        };
        vote_options_with_vote_status: {
          Row: SetNonNullable<
            SupabaseDatabase["public"]["Views"]["vote_options_with_vote_status"]["Row"]
          >;
        };
        video_list_view: {
          Row: SetNonNullable<
            SupabaseDatabase["public"]["Views"]["video_list_view"]["Row"]
          >;
        };
        video_replies_list_view: {
          Row: SetNonNullable<
            SupabaseDatabase["public"]["Views"]["video_replies_list_view"]["Row"]
          >;
        };
        class_list_view: {
          Row: SetNonNullable<
            SupabaseDatabase["public"]["Views"]["class_list_view"]["Row"]
          >;
        };
        checked_goal_list_view: {
          Row: SetNonNullable<
            SupabaseDatabase["public"]["Views"]["checked_goal_list_view"]["Row"]
          >;
        };
        class_attendance_with_status: {
          Row: SetNonNullable<
            SupabaseDatabase["public"]["Views"]["class_attendance_with_status"]["Row"]
          >;
        };
        bookmarked_lesson_list_view: {
          Row: SetNonNullable<
            SupabaseDatabase["public"]["Views"]["bookmarked_lesson_list_view"]["Row"]
          >;
        };
        certificate_view: {
          Row: SetNonNullable<
            SupabaseDatabase["public"]["Views"]["certificate_view"]["Row"]
          >;
        };
        class_messages_view: {
          Row: SetFieldType<
            SetNonNullable<
              SupabaseDatabase["public"]["Views"]["class_messages_view"]["Row"]
            >,
            "avatar",
            string | null
          >;
        };
      };
    };
  }
>;
export const browserClient = createBrowserClient<Database>(
  "https://trwxbnzdoifmjxezpanj.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRyd3hibnpkb2lmbWp4ZXpwYW5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0MTA4MTUsImV4cCI6MjA1Njk4NjgxNX0.rt_Z9sptZ5RQvgb2pa5DM1aMGrIK7u7huVH6pF2FKzo"
);

export const supabaseAdmin = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY!
);

export const makeSSRClient = (request: Request) => {
  const headers = new Headers();
  const serverSideClient = createServerClient<Database>(
    import.meta.env.VITE_SUPABASE_URL!,
    import.meta.env.VITE_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return parseCookieHeader(request.headers.get("cookie") ?? "");
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            headers.append(
              "Set-Cookie",
              serializeCookieHeader(name, value, options)
            );
          });
        },
      },
    }
  );

  return {
    client: serverSideClient,
    headers,
  };
};
