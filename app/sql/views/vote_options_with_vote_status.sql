CREATE OR REPLACE VIEW vote_options_with_vote_status AS
SELECT
  vote_options.vote_post_id,
  vote_options.vote_option_id,
  vote_options.option_text,
  (SELECT EXISTS 
   (SELECT 1
   FROM public.user_votes 
   WHERE user_votes.vote_post_id = vote_options.vote_post_id 
     AND user_votes.profile_id = auth.uid() 
     AND user_votes.vote_option_id = vote_options.vote_option_id)) AS is_voted
FROM vote_options;
