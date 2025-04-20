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
      };
    };
  }
>;

export const browserClient = createBrowserClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const makeSSRClient = (request: Request) => {
  const headers = new Headers();
  const serverSideClient = createServerClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
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
