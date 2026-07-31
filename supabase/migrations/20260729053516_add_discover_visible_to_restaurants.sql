ALTER TABLE public.restaurants
ADD COLUMN discover_visible boolean NOT NULL DEFAULT false;
COMMENT ON COLUMN public.restaurants.discover_visible IS
'Indica si el restaurante debe aparecer en Discover.';
