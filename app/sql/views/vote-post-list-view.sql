CREATE OR REPLACE VIEW vote_post_list_view AS
SELECT
  vote_posts.vote_post_id,
  vote_posts.title,
  vote_posts.content,
  vote_posts.created_at,
  profiles.name AS author,
  profiles.avatar AS author_avatar,
  profiles.username AS author_username
FROM vote_posts
INNER JOIN profiles USING (profile_id);