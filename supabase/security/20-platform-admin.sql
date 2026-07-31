-- ============================================================================
-- legal_documents
-- ============================================================================

ALTER TABLE public.legal_documents
ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- SELECT
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS legal_documents_select
ON public.legal_documents;

CREATE POLICY legal_documents_select
ON public.legal_documents
FOR SELECT
USING (
    public.is_super_admin()
);

-- ----------------------------------------------------------------------------
-- INSERT
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS legal_documents_insert
ON public.legal_documents;

CREATE POLICY legal_documents_insert
ON public.legal_documents
FOR INSERT
WITH CHECK (
    public.is_super_admin()
);

-- ----------------------------------------------------------------------------
-- UPDATE
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS legal_documents_update
ON public.legal_documents;

CREATE POLICY legal_documents_update
ON public.legal_documents
FOR UPDATE
USING (
    public.is_super_admin()
)
WITH CHECK (
    public.is_super_admin()
);

-- ----------------------------------------------------------------------------
-- DELETE
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS legal_documents_delete
ON public.legal_documents;

CREATE POLICY legal_documents_delete
ON public.legal_documents
FOR DELETE
USING (
    public.is_super_admin()
);
-- ============================================================================
-- restaurant_legal_acceptance
-- ============================================================================

ALTER TABLE public.restaurant_legal_acceptance
ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- SELECT
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS restaurant_legal_acceptance_select
ON public.restaurant_legal_acceptance;

CREATE POLICY restaurant_legal_acceptance_select
ON public.restaurant_legal_acceptance
FOR SELECT
USING (
    public.is_super_admin()
    OR (
        public.belongs_to_restaurant(restaurant_id)
        AND public.is_owner()
    )
);

-- ----------------------------------------------------------------------------
-- INSERT
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS restaurant_legal_acceptance_insert
ON public.restaurant_legal_acceptance;

CREATE POLICY restaurant_legal_acceptance_insert
ON public.restaurant_legal_acceptance
FOR INSERT
WITH CHECK (
    public.belongs_to_restaurant(restaurant_id)
    AND public.is_owner()
);

-- ----------------------------------------------------------------------------
-- UPDATE
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS restaurant_legal_acceptance_update
ON public.restaurant_legal_acceptance;

CREATE POLICY restaurant_legal_acceptance_update
ON public.restaurant_legal_acceptance
FOR UPDATE
USING (
    public.belongs_to_restaurant(restaurant_id)
    AND public.is_owner()
)
WITH CHECK (
    public.belongs_to_restaurant(restaurant_id)
    AND public.is_owner()
);

-- ----------------------------------------------------------------------------
-- DELETE
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS restaurant_legal_acceptance_delete
ON public.restaurant_legal_acceptance;

CREATE POLICY restaurant_legal_acceptance_delete
ON public.restaurant_legal_acceptance
FOR DELETE
USING (
    public.is_super_admin()
);
-- ============================================================================
-- legal_events
-- ============================================================================

ALTER TABLE public.legal_events
ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- SELECT
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS legal_events_select
ON public.legal_events;

CREATE POLICY legal_events_select
ON public.legal_events
FOR SELECT
USING (
    public.is_super_admin()
);

-- ----------------------------------------------------------------------------
-- INSERT
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS legal_events_insert
ON public.legal_events;

CREATE POLICY legal_events_insert
ON public.legal_events
FOR INSERT
WITH CHECK (
    public.is_super_admin()
);

-- ----------------------------------------------------------------------------
-- UPDATE
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS legal_events_update
ON public.legal_events;

CREATE POLICY legal_events_update
ON public.legal_events
FOR UPDATE
USING (
    public.is_super_admin()
)
WITH CHECK (
    public.is_super_admin()
);

-- ----------------------------------------------------------------------------
-- DELETE
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS legal_events_delete
ON public.legal_events;

CREATE POLICY legal_events_delete
ON public.legal_events
FOR DELETE
USING (
    public.is_super_admin()
);
-- ============================================================================
-- liquidations
-- ============================================================================

ALTER TABLE public.liquidations
ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- SELECT
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS liquidations_select
ON public.liquidations;

CREATE POLICY liquidations_select
ON public.liquidations
FOR SELECT
USING (
    public.is_super_admin()
    OR (
        public.belongs_to_restaurant(restaurant_id)
        AND public.is_owner()
    )
);

-- ----------------------------------------------------------------------------
-- INSERT
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS liquidations_insert
ON public.liquidations;

CREATE POLICY liquidations_insert
ON public.liquidations
FOR INSERT
WITH CHECK (
    public.is_super_admin()
);

-- ----------------------------------------------------------------------------
-- UPDATE
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS liquidations_update
ON public.liquidations;

CREATE POLICY liquidations_update
ON public.liquidations
FOR UPDATE
USING (
    public.is_super_admin()
)
WITH CHECK (
    public.is_super_admin()
);

-- ----------------------------------------------------------------------------
-- DELETE
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS liquidations_delete
ON public.liquidations;

CREATE POLICY liquidations_delete
ON public.liquidations
FOR DELETE
USING (
    public.is_super_admin()
);
-- ============================================================================
-- role_modules
-- ============================================================================

ALTER TABLE public.role_modules
ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- SELECT
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS role_modules_select
ON public.role_modules;

CREATE POLICY role_modules_select
ON public.role_modules
FOR SELECT
USING (
    public.is_super_admin()
);

-- ----------------------------------------------------------------------------
-- INSERT
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS role_modules_insert
ON public.role_modules;

CREATE POLICY role_modules_insert
ON public.role_modules
FOR INSERT
WITH CHECK (
    public.is_super_admin()
);

-- ----------------------------------------------------------------------------
-- UPDATE
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS role_modules_update
ON public.role_modules;

CREATE POLICY role_modules_update
ON public.role_modules
FOR UPDATE
USING (
    public.is_super_admin()
)
WITH CHECK (
    public.is_super_admin()
);

-- ----------------------------------------------------------------------------
-- DELETE
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS role_modules_delete
ON public.role_modules;

CREATE POLICY role_modules_delete
ON public.role_modules
FOR DELETE
USING (
    public.is_super_admin()
);
-- ============================================================================
-- system_modules
-- ============================================================================

ALTER TABLE public.system_modules
ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- SELECT
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS system_modules_select
ON public.system_modules;

CREATE POLICY system_modules_select
ON public.system_modules
FOR SELECT
USING (
    public.is_super_admin()
);

-- ----------------------------------------------------------------------------
-- INSERT
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS system_modules_insert
ON public.system_modules;

CREATE POLICY system_modules_insert
ON public.system_modules
FOR INSERT
WITH CHECK (
    public.is_super_admin()
);

-- ----------------------------------------------------------------------------
-- UPDATE
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS system_modules_update
ON public.system_modules;

CREATE POLICY system_modules_update
ON public.system_modules
FOR UPDATE
USING (
    public.is_super_admin()
)
WITH CHECK (
    public.is_super_admin()
);

-- ----------------------------------------------------------------------------
-- DELETE
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS system_modules_delete
ON public.system_modules;

CREATE POLICY system_modules_delete
ON public.system_modules
FOR DELETE
USING (
    public.is_super_admin()
);
-- ============================================================================
-- wolf_invoices
-- ============================================================================

ALTER TABLE public.wolf_invoices
ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- SELECT
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS wolf_invoices_select
ON public.wolf_invoices;

CREATE POLICY wolf_invoices_select
ON public.wolf_invoices
FOR SELECT
USING (
    public.is_super_admin()
    OR (
        public.belongs_to_restaurant(restaurant_id)
        AND public.is_owner()
    )
);

-- ----------------------------------------------------------------------------
-- INSERT
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS wolf_invoices_insert
ON public.wolf_invoices;

CREATE POLICY wolf_invoices_insert
ON public.wolf_invoices
FOR INSERT
WITH CHECK (
    public.is_super_admin()
);

-- ----------------------------------------------------------------------------
-- UPDATE
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS wolf_invoices_update
ON public.wolf_invoices;

CREATE POLICY wolf_invoices_update
ON public.wolf_invoices
FOR UPDATE
USING (
    public.is_super_admin()
)
WITH CHECK (
    public.is_super_admin()
);

-- ----------------------------------------------------------------------------
-- DELETE
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS wolf_invoices_delete
ON public.wolf_invoices;

CREATE POLICY wolf_invoices_delete
ON public.wolf_invoices
FOR DELETE
USING (
    public.is_super_admin()
);