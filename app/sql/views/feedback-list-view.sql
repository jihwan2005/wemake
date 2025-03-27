CREATE OR REPLACE VIEW feedback_list_view AS
SELECT
  feedback.feedback_id,
  feedback.content,
  feedback.created_at,
  profiles.name AS author,
  profiles.avatar AS author_avatar,
  profiles.username AS author_username,
  feedback.upvotes,
  (SELECT EXISTS (SELECT 1 FROM public.feedback_upvotes WHERE feedback_upvotes.feedback_id = feedback.feedback_id AND feedback_upvotes.profile_id = auth.uid())) AS is_upvoted
FROM feedback
INNER JOIN profiles USING (profile_id);