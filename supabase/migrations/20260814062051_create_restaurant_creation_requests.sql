-- ============================================================================
-- Wolf Ordering
-- MIGRATION: RESTAURANT CREATION REQUESTS
--
-- Objetivo
-- ----------------------------------------------------------------------------
-- Registra la solicitud de creación de un restaurante antes/durante
-- el proceso de suscripción.
--
-- Flujo:
--
--   Cliente
--      ↓
--   restaurant_creation_requests
--      ↓
--   PayPal
--      ↓
--   paypal_subscription_id
--      ↓
--   Revisión Wolf
--      ↓
--   restaurant_id
--
-- IMPORTANTE
-- ----------------------------------------------------------------------------
-- Esta tabla NO crea automáticamente un restaurante.
--
-- restaurant_id permanece NULL mientras la solicitud está en revisión.
--
-- Los datos sensibles de esta tabla NO son públicos.
-- ============================================================================

BEGIN;

-- ============================================================================
-- 1. TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.restaurant_creation_requests (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

    -- ------------------------------------------------------------------------
    -- Usuario que inició la solicitud
    -- ------------------------------------------------------------------------

    user_id uuid NOT NULL
        REFERENCES auth.users(id)
        ON DELETE CASCADE,

    -- ------------------------------------------------------------------------
    -- Información proporcionada durante el onboarding
    -- ------------------------------------------------------------------------

    restaurant_name text NOT NULL,
    owner_name text NOT NULL,
    owner_email text NOT NULL,
    owner_phone text NOT NULL,

    -- ------------------------------------------------------------------------
    -- Plan seleccionado en Wolf
    -- ------------------------------------------------------------------------

    plan text NOT NULL,

    CONSTRAINT restaurant_creation_requests_plan_check
        CHECK (plan IN ('basic', 'pro')),

    -- ------------------------------------------------------------------------
    -- Referencias de PayPal
    -- ------------------------------------------------------------------------

    paypal_plan_id text,
    paypal_subscription_id text,

    -- ------------------------------------------------------------------------
    -- Estados separados
    --
    -- payment_status:
    --   Estado relacionado con el pago.
    --
    -- subscription_status:
    --   Estado de la suscripción de PayPal.
    --
    -- request_status:
    --   Estado interno de la solicitud de creación del restaurante.
    -- ------------------------------------------------------------------------

    payment_status text NOT NULL DEFAULT 'pending',

    CONSTRAINT restaurant_creation_requests_payment_status_check
        CHECK (
            payment_status IN (
                'pending',
                'completed',
                'failed',
                'cancelled'
            )
        ),

    subscription_status text NOT NULL DEFAULT 'pending',

    CONSTRAINT restaurant_creation_requests_subscription_status_check
        CHECK (
            subscription_status IN (
                'pending',
                'active',
                'suspended',
                'cancelled',
                'expired'
            )
        ),

    request_status text NOT NULL DEFAULT 'pending',

    CONSTRAINT restaurant_creation_requests_request_status_check
        CHECK (
            request_status IN (
                'pending',
                'in_review',
                'approved',
                'rejected',
                'completed',
                'cancelled'
            )
        ),

    -- ------------------------------------------------------------------------
    -- Restaurante creado a partir de esta solicitud
    --
    -- Puede permanecer NULL durante la revisión.
    -- ------------------------------------------------------------------------

    restaurant_id uuid
        REFERENCES public.restaurants(id)
        ON DELETE SET NULL,

    -- ------------------------------------------------------------------------
    -- Auditoría
    -- ------------------------------------------------------------------------

    created_at timestamptz NOT NULL DEFAULT now(),

    updated_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- 2. COMMENTS
-- ============================================================================

COMMENT ON TABLE public.restaurant_creation_requests IS
'Solicitudes de creación de restaurantes iniciadas desde el onboarding de Wolf.';

COMMENT ON COLUMN public.restaurant_creation_requests.plan IS
'Plan interno de Wolf seleccionado por el usuario: basic o pro.';

COMMENT ON COLUMN public.restaurant_creation_requests.paypal_plan_id IS
'Identificador del plan correspondiente en PayPal.';

COMMENT ON COLUMN public.restaurant_creation_requests.paypal_subscription_id IS
'Identificador de la suscripción creada en PayPal.';

COMMENT ON COLUMN public.restaurant_creation_requests.restaurant_id IS
'Restaurante creado a partir de esta solicitud. NULL mientras la solicitud no haya sido completada.';

-- ============================================================================
-- 3. INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_restaurant_creation_requests_user_id
    ON public.restaurant_creation_requests(user_id);

CREATE INDEX IF NOT EXISTS idx_restaurant_creation_requests_plan
    ON public.restaurant_creation_requests(plan);

CREATE INDEX IF NOT EXISTS idx_restaurant_creation_requests_request_status
    ON public.restaurant_creation_requests(request_status);

CREATE INDEX IF NOT EXISTS idx_restaurant_creation_requests_payment_status
    ON public.restaurant_creation_requests(payment_status);

CREATE INDEX IF NOT EXISTS idx_restaurant_creation_requests_subscription_status
    ON public.restaurant_creation_requests(subscription_status);

CREATE INDEX IF NOT EXISTS idx_restaurant_creation_requests_restaurant_id
    ON public.restaurant_creation_requests(restaurant_id);

CREATE UNIQUE INDEX IF NOT EXISTS idx_restaurant_creation_requests_paypal_subscription_id
    ON public.restaurant_creation_requests(paypal_subscription_id)
    WHERE paypal_subscription_id IS NOT NULL;

-- ============================================================================
-- 4. UPDATED_AT TRIGGER
-- ============================================================================

CREATE OR REPLACE FUNCTION public.set_restaurant_creation_request_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS restaurant_creation_requests_updated_at
ON public.restaurant_creation_requests;

CREATE TRIGGER restaurant_creation_requests_updated_at
BEFORE UPDATE ON public.restaurant_creation_requests
FOR EACH ROW
EXECUTE FUNCTION public.set_restaurant_creation_request_updated_at();

-- ============================================================================
-- 5. ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE public.restaurant_creation_requests
ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 6. CLIENT SELECT
--
-- El usuario autenticado únicamente puede consultar sus propias solicitudes.
-- ============================================================================

DROP POLICY IF EXISTS restaurant_creation_requests_select_own
ON public.restaurant_creation_requests;

CREATE POLICY restaurant_creation_requests_select_own
ON public.restaurant_creation_requests
FOR SELECT
TO authenticated
USING (
    auth.uid() = user_id
);

-- ============================================================================
-- 7. CLIENT INSERT
--
-- El usuario únicamente puede crear una solicitud a su propio nombre.
--
-- IMPORTANTE:
-- Los campos de PayPal y los estados NO se confían al cliente.
-- El endpoint server-side será responsable de establecerlos.
-- ============================================================================

DROP POLICY IF EXISTS restaurant_creation_requests_insert_own
ON public.restaurant_creation_requests;

CREATE POLICY restaurant_creation_requests_insert_own
ON public.restaurant_creation_requests
FOR INSERT
TO authenticated
WITH CHECK (
    auth.uid() = user_id
);

-- ============================================================================
-- 8. CLIENT UPDATE
--
-- No permitimos que el cliente modifique directamente:
--
--   payment_status
--   subscription_status
--   request_status
--   paypal_plan_id
--   paypal_subscription_id
--   restaurant_id
--
-- Estos valores serán gestionados desde server-side/admin.
--
-- Por seguridad, NO se crea una policy UPDATE para authenticated.
-- ============================================================================

-- ============================================================================
-- 9. CLIENT DELETE
--
-- No permitimos que el cliente elimine solicitudes.
-- ============================================================================

-- ============================================================================
-- 10. SUPER ADMIN SELECT
-- ============================================================================

DROP POLICY IF EXISTS restaurant_creation_requests_select_admin
ON public.restaurant_creation_requests;

CREATE POLICY restaurant_creation_requests_select_admin
ON public.restaurant_creation_requests
FOR SELECT
TO authenticated
USING (
    public.is_super_admin()
);

-- ============================================================================
-- 11. SUPER ADMIN UPDATE
--
-- El equipo Wolf puede actualizar el estado de la solicitud y vincular
-- el restaurante posteriormente.
-- ============================================================================

DROP POLICY IF EXISTS restaurant_creation_requests_update_admin
ON public.restaurant_creation_requests;

CREATE POLICY restaurant_creation_requests_update_admin
ON public.restaurant_creation_requests
FOR UPDATE
TO authenticated
USING (
    public.is_super_admin()
)
WITH CHECK (
    public.is_super_admin()
);

-- ============================================================================
-- 12. SUPER ADMIN INSERT
--
-- Permitimos INSERT administrativo por consistencia con la administración.
-- Las APIs server-side pueden utilizar service_role y no dependen de RLS.
-- ============================================================================

DROP POLICY IF EXISTS restaurant_creation_requests_insert_admin
ON public.restaurant_creation_requests;

CREATE POLICY restaurant_creation_requests_insert_admin
ON public.restaurant_creation_requests
FOR INSERT
TO authenticated
WITH CHECK (
    public.is_super_admin()
);

-- ============================================================================
-- 13. SUPER ADMIN DELETE
--
-- Eliminación únicamente administrativa.
-- ============================================================================

DROP POLICY IF EXISTS restaurant_creation_requests_delete_admin
ON public.restaurant_creation_requests;

CREATE POLICY restaurant_creation_requests_delete_admin
ON public.restaurant_creation_requests
FOR DELETE
TO authenticated
USING (
    public.is_super_admin()
);

-- ============================================================================
-- 14. NO PUBLIC ACCESS
--
-- No se crean policies para anon.
-- Esta tabla contiene:
--
--   - nombre del propietario
--   - email
--   - teléfono
--   - identificadores de PayPal
--
-- Por lo tanto NO debe tener acceso público.
-- ============================================================================

COMMIT;