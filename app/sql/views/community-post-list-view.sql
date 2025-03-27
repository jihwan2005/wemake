/*
  view는 DB에 저장돼있는 데이터를 가져올 때 사용됨. aggreagte function, join, left join을 사용한다면 view를 만드는 것이 좋음. 
*/
CREATE OR REPLACE VIEW community_post_list_view AS
SELECT
  posts.post_id,
  posts.title,
  posts.created_at,
  topics.name AS topic,
  profiles.name AS author,
  profiles.avatar AS author_avatar,
  profiles.username AS author_username,
  posts.upvotes,
  topics.slug AS topic_slug,
  (SELECT EXISTS (SELECT 1 FROM public.post_upvotes WHERE post_upvotes.post_id = posts.post_id AND post_upvotes.profile_id = auth.uid())) AS is_upvoted
FROM posts
INNER JOIN topics USING (topic_id)
INNER JOIN profiles USING (profile_id);