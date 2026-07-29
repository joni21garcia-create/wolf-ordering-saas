-- ===========================================================
-- Categoría para Discover
-- ===========================================================

ALTER TABLE public.restaurants
ADD COLUMN IF NOT EXISTS category TEXT;

COMMENT ON COLUMN public.restaurants.category IS
'Categoría utilizada por Discover (parrilla, pizza, sushi, mexicana, etc.)';

-- Valor por defecto para restaurantes existentes
UPDATE public.restaurants
SET category = 'restaurant'
WHERE category IS NULL;