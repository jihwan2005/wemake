CREATE OR REPLACE VIEW product_overview_view AS
SELECT
  product_id,
  name,
  tagline,
  description,
  how_it_works,
  icon,
  url,
  stats->>'upvotes' as upvotes,
  stats->>'views' as views,
  stats->>'reviews' as reviews,
  AVG(product_reviews.rating) AS average_rating
FROM public.products
LEFT JOIN public.reviews AS product_reviews USING (product_id)
GROUP BY product_id;


