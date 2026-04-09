-- inserts a row into public.user_settings
CREATE OR REPLACE FUNCTION public.create_public_user_settings()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = ''
  AS $$
BEGIN
  INSERT INTO public.user_settings(user_id)
    VALUES(NEW.id);
  RETURN NEW;
END;
$$;

-- trigger the function every time a public user is created
CREATE TRIGGER on_public_user_created
  AFTER INSERT ON public.users
  FOR EACH ROW
  EXECUTE PROCEDURE public.create_public_user_settings();

