CREATE FUNCTION public.handle_post_upvote() 
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    UPDATE public.posts SET upvotes = upvotes + 1 WHERE post_id = NEW.post_id;
    RETURN NEW;
END;
$$;

CREATE TRIGGER post_upvote_trigger
AFTER INSERT ON public.post_upvotes
FOR EACH ROW EXECUTE FUNCTION public.handle_post_upvote();

CREATE FUNCTION public.handle_post_unupvote() 
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    UPDATE public.posts SET upvotes = upvotes - 1 WHERE post_id = OLD.post_id;
    RETURN OLD;
END;
$$;

CREATE TRIGGER post_unupvote_trigger
AFTER DELETE ON public.post_upvotes
FOR EACH ROW EXECUTE FUNCTION public.handle_post_unupvote();
