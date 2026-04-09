-- Create a function to handle user updates
CREATE OR REPLACE FUNCTION public.handle_user_update()
    RETURNS TRIGGER
    LANGUAGE plpgsql
    SECURITY DEFINER
    SET search_path = ''
    AS $$
BEGIN
    UPDATE
        public.users
    SET
        first_name = NEW.raw_user_meta_data ->> 'first_name',
        last_name = NEW.raw_user_meta_data ->> 'last_name',
        updated_at = NOW()
    WHERE
        id = NEW.id;
    RETURN NEW;
END;
$$;

-- Create the trigger on auth.users
CREATE TRIGGER on_auth_user_updated
    AFTER UPDATE ON auth.users
    FOR EACH ROW
    EXECUTE PROCEDURE public.handle_user_update();

