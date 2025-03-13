CREATE OR REPLACE VIEW community_post_detail AS
SELECT
    posts.post_id,
    posts.title,
    posts.content,
    posts.upvotes,
    posts.created_at,
    topics.topic_id,
    topics.name as topic_name,
    topics.slug as topic_slug,
    COUNT(post_replies.post_reply_id) as replies,
    profiles.name as author_name,
    profiles.avatar as author_avatar,
    profiles.role as author_role,
    profiles.created_at as author_created_at,
    (SELECT COUNT(*) FROM products WHERE products.profile_id = profiles.profile_id) as products
FROM posts
INNER JOIN topics USING (topic_id)
LEFT JOIN post_replies USING (post_id)
INNER JOIN profiles ON (profiles.profile_id = posts.profile_id)
GROUP BY posts.post_id, topics.topic_id, topics.name, topics.slug, profiles.name, profiles.avatar, profiles.role, profiles.created_at, profiles.profile_id;