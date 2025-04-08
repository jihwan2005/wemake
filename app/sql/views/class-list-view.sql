CREATE OR REPLACE VIEW class_list_view AS
SELECT
  class_posts.class_post_id,
  class_posts.title,
  class_posts.description,
  class_posts.created_at,
  class_posts.class_poster,
  profiles.avatar AS author_avatar,
  profiles.username AS author_username,
  profiles.profile_id As author_id,
  class_posts.start_at,
  class_posts.end_at,
  class_posts.field,
  class_posts.difficulty_type,
  COALESCE(array_agg(hashtags.tag) FILTER (WHERE hashtags.tag IS NOT NULL), '{}') AS hashtags
FROM class_posts
INNER JOIN profiles USING (profile_id)
LEFT JOIN "classPost_with_hashtags" ON class_posts.class_post_id = "classPost_with_hashtags".class_post_id
LEFT JOIN hashtags ON "classPost_with_hashtags".hashtag_id = hashtags.hashtag_id
GROUP BY
  class_posts.class_post_id,
  class_posts.title,
  class_posts.description,
  class_posts.created_at,
  class_posts.class_poster,
  profiles.avatar,
  profiles.username,
  profiles.profile_id,
  class_posts.start_at,
  class_posts.end_at,
  class_posts.field,
  class_posts.difficulty_type;