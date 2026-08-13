-- ============================================================
-- MIGRATION
-- Restaurant Favorites para clientes de Discover
-- ============================================================

BEGIN;

-- ============================================================
-- 1. CREAR TABLA SI NO EXISTE
-- ============================================================

CREATE TABLE IF NOT EXISTS public.restaurant_favorites (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

    auth_user_id uuid NOT NULL
        REFERENCES auth.users(id)
        ON DELETE CASCADE,

    restaurant_id uuid NOT NULL
        REFERENCES public.restaurants(id)
        ON DELETE CASCADE,

    created_at timestamptz NOT NULL DEFAULT now()
);


-- ============================================================
-- 2. EVITAR DUPLICADOS
--
-- Un usuario solamente puede guardar una vez
-- el mismo restaurante.
-- ============================================================

CREATE UNIQUE INDEX IF NOT EXISTS
restaurant_favorites_user_restaurant_unique
ON public.restaurant_favorites (
    auth_user_id,
    restaurant_id
);


-- ============================================================
-- 3. ÍNDICES
-- ============================================================

CREATE INDEX IF NOT EXISTS
restaurant_favorites_auth_user_id_idx
ON public.restaurant_favorites (
    auth_user_id
);

CREATE INDEX IF NOT EXISTS
restaurant_favorites_restaurant_id_idx
ON public.restaurant_favorites (
    restaurant_id
);


-- ============================================================
-- 4. RLS
-- ============================================================

ALTER TABLE public.restaurant_favorites
ENABLE ROW LEVEL SECURITY;


-- ============================================================
-- 5. ELIMINAR POLÍTICAS ANTERIORES
-- ============================================================

DROP POLICY IF EXISTS restaurant_favorites_select
ON public.restaurant_favorites;

DROP POLICY IF EXISTS restaurant_favorites_insert
ON public.restaurant_favorites;

DROP POLICY IF EXISTS restaurant_favorites_update
ON public.restaurant_favorites;

DROP POLICY IF EXISTS restaurant_favorites_delete
ON public.restaurant_favorites;


-- ============================================================
-- 6. SELECT
--
-- El cliente solamente puede ver SUS favoritos.
-- ============================================================

CREATE POLICY restaurant_favorites_select
ON public.restaurant_favorites
FOR SELECT
TO authenticated
USING (
    auth.uid() = auth_user_id
);


-- ============================================================
-- 7. INSERT
--
-- El cliente puede guardar cualquier restaurante.
--
-- IMPORTANTE:
-- NO usamos belongs_to_restaurant().
-- El usuario no tiene que pertenecer al restaurante.
-- ============================================================

CREATE POLICY restaurant_favorites_insert
ON public.restaurant_favorites
FOR INSERT
TO authenticated
WITH CHECK (
    auth.uid() = auth_user_id
);


-- ============================================================
-- 8. DELETE
--
-- El cliente solamente puede eliminar SUS favoritos.
-- ============================================================

CREATE POLICY restaurant_favorites_delete
ON public.restaurant_favorites
FOR DELETE
TO authenticated
USING (
    auth.uid() = auth_user_id
);


-- ============================================================
-- 9. NO UPDATE
--
-- Los favoritos funcionan como:
--
--   INSERT = guardar
--   DELETE = quitar
--
-- No necesitamos UPDATE.
-- ============================================================

COMMIT;