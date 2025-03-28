CREATE OR REPLACE VIEW faq_list_view AS
SELECT
  faq.faq_id,
  faq.question,
  faq.created_at,
  profiles.name AS author,
  profiles.avatar AS author_avatar,
  profiles.username AS author_username
FROM faq
INNER JOIN profiles USING (profile_id);