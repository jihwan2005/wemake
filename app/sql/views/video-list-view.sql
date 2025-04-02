CREATE OR REPLACE VIEW video_list_view AS
SELECT
  videos.video_id,
  videos.title,
  videos.description,
  videos.created_at,
  videos.video_url,
  profiles.name AS author,
  profiles.avatar AS author_avatar,
  profiles.username AS author_username,
FROM videos
INNER JOIN profiles USING (profile_id);