-- ============================================================================
-- Wolf Ordering
-- Archivo : 02-enable-rls.sql
-- Proyecto: Wolf Ordering
--
-- Descripción
-- ----------------------------------------------------------------------------
-- Habilita Row Level Security (RLS) para todas las tablas multi-tenant
-- del sistema.
--
-- Este archivo únicamente activa RLS.
--
-- No contiene políticas.
-- Las políticas se implementan en los archivos posteriores.
--
-- ============================================================================

-- ============================================================================
-- Restaurants
-- ============================================================================

ALTER TABLE restaurants
ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- Catálogo
-- ============================================================================

ALTER TABLE categories
ENABLE ROW LEVEL SECURITY;

ALTER TABLE products
ENABLE ROW LEVEL SECURITY;

ALTER TABLE restaurant_gallery
ENABLE ROW LEVEL SECURITY;

ALTER TABLE restaurant_hero_slides
ENABLE ROW LEVEL SECURITY;

ALTER TABLE restaurant_services
ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- Usuarios
-- ============================================================================

ALTER TABLE restaurant_users
ENABLE ROW LEVEL SECURITY;

ALTER TABLE restaurant_roles
ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- Pedidos
-- ============================================================================

ALTER TABLE orders
ENABLE ROW LEVEL SECURITY;

ALTER TABLE order_items
ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- Mesas
-- ============================================================================

ALTER TABLE restaurant_tables
ENABLE ROW LEVEL SECURITY;

ALTER TABLE restaurant_table_assignments
ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- Reservaciones
-- ============================================================================

ALTER TABLE restaurant_reservations
ENABLE ROW LEVEL SECURITY;

ALTER TABLE restaurant_reservation_settings
ENABLE ROW LEVEL SECURITY;

ALTER TABLE restaurant_reservation_blocks
ENABLE ROW LEVEL SECURITY;

ALTER TABLE restaurant_reservation_logs
ENABLE ROW LEVEL SECURITY;

ALTER TABLE restaurant_reservation_reminders
ENABLE ROW LEVEL SECURITY;

ALTER TABLE restaurant_waitlist
ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- Configuración
-- ============================================================================

ALTER TABLE restaurant_settings
ENABLE ROW LEVEL SECURITY;

ALTER TABLE restaurant_theme_settings
ENABLE ROW LEVEL SECURITY;

ALTER TABLE restaurant_pwa_settings
ENABLE ROW LEVEL SECURITY;

ALTER TABLE restaurant_admin_pwa_settings
ENABLE ROW LEVEL SECURITY;

ALTER TABLE restaurant_delivery_settings
ENABLE ROW LEVEL SECURITY;

ALTER TABLE schedule_settings
ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- Notificaciones
-- ============================================================================

ALTER TABLE device_tokens
ENABLE ROW LEVEL SECURITY;

ALTER TABLE push_subscriptions
ENABLE ROW LEVEL SECURITY;

ALTER TABLE restaurant_notification_queue
ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- Favoritos
-- ============================================================================

ALTER TABLE restaurant_favorites
ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- Pagos
-- ============================================================================

ALTER TABLE restaurant_payment_qrs
ENABLE ROW LEVEL SECURITY;

ALTER TABLE liquidations
ENABLE ROW LEVEL SECURITY;

ALTER TABLE wolf_invoices
ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- Legal
-- ============================================================================

ALTER TABLE restaurant_legal_acceptance
ENABLE ROW LEVEL SECURITY;

ALTER TABLE legal_events
ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- Tablas excluidas
-- ----------------------------------------------------------------------------
-- Estas tablas utilizan un modelo de seguridad diferente o son
-- administradas exclusivamente por Wolf.
--
-- role_modules
-- legal_documents
-- manager_pwa_settings
-- system_modules
-- tables
-- ============================================================================

-- ============================================================================
-- Fin del archivo
-- ----------------------------------------------------------------------------
-- Total de tablas con RLS habilitado: 32
--
-- Las políticas Row Level Security se implementarán en:
--
-- 03-restaurants.sql
-- 04-restaurant_users.sql
-- 05-catalog.sql
-- 06-orders.sql
-- 07-reservations.sql
-- 08-settings.sql
-- 09-notifications.sql
-- 10-payments.sql
-- 11-legal.sql
-- ============================================================================