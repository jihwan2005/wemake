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
FROM class_posts
INNER JOIN profiles USING (profile_id);