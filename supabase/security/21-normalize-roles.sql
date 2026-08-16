-- ============================================================================
-- Wolf Ordering
-- Archivo : 16-normalize-roles.sql
--
-- Descripción
-- ----------------------------------------------------------------------------
-- Normaliza los códigos de los roles para que todo el sistema RLS
-- utilice un catálogo consistente.
--
-- No modifica IDs.
-- No modifica relaciones.
-- No modifica usuarios.
--
-- Solo estandariza restaurant_roles.code.
-- ============================================================================
-- ============================================================================
-- OWNER
-- ============================================================================

UPDATE restaurant_roles
SET code = 'owner'
WHERE LOWER(code) IN (
    'propietario',
    'owner'
);

-- ============================================================================
-- SUPER ADMIN
-- ============================================================================

UPDATE restaurant_roles
SET code = 'super-user'
WHERE LOWER(code) IN (
    'super-user',
    'super admin',
    'super admin1'
);

-- ============================================================================
-- MANAGER
-- ============================================================================

UPDATE restaurant_roles
SET code = 'manager'
WHERE LOWER(code) IN (
    'manager',
    'manager1',
    'mgr1',
    'mng1',
    'mana01'
);

-- ============================================================================
-- CASHIER
-- ============================================================================

UPDATE restaurant_roles
SET code = 'cashier'
WHERE LOWER(code) IN (
    'cash',
    'cashier'
);

-- ============================================================================
-- KITCHEN
-- ============================================================================

UPDATE restaurant_roles
SET code = 'kitchen'
WHERE LOWER(code) IN (
    'cocina',
    'cocina1',
    'kitchen'
);

-- ============================================================================
-- MARKETING
-- ============================================================================

UPDATE restaurant_roles
SET code = 'marketing'
WHERE LOWER(code) IN (
    'marketing',
    'mark001',
    'mktg1'
);

-- ============================================================================
-- TEST
-- ============================================================================

UPDATE restaurant_roles
SET code = 'test'
WHERE LOWER(code) IN (
    'prueba',
    'prueba1',
    'pru1'
);