# Wolf Ordering

# Database Security Map

## Objetivo

Este documento identifica el tipo de protección que requiere
cada tabla del sistema.

---

# Clasificación

## A. Tablas Multi-Tenant

Estas tablas pertenecen a un restaurante.

Su acceso deberá depender de:

restaurant_id

Utilizarán:

current_restaurant_id()

---

## B. Tablas Heredadas

No tienen restaurant_id.

Obtienen el restaurante desde otra tabla.

---

## C. Tablas Globales

Información administrada únicamente por Wolf.

No pertenecen a un restaurante.

---

## D. Tablas Administrativas

Solo accesibles por Super Admin.

---

# Inventario

| Tabla | Tipo | restaurant_id | RLS | Estado |
|--------|------|---------------|-----|--------|
| restaurants | Multi Tenant | ✅ | Pendiente | ⏳ |
| categories | Multi Tenant | ✅ | Pendiente | ⏳ |
| products | Multi Tenant | ✅ | Pendiente | ⏳ |
| restaurant_gallery | Multi Tenant | ✅ | Pendiente | ⏳ |
| restaurant_services | Multi Tenant | ✅ | Pendiente | ⏳ |
| restaurant_tables | Multi Tenant | ✅ | Pendiente | ⏳ |
| restaurant_users | Multi Tenant | ✅ | Pendiente | ⏳ |
| restaurant_roles | Multi Tenant | ✅ | Pendiente | ⏳ |
| orders | Multi Tenant | ✅ | Pendiente | ⏳ |
| order_items | Heredada | ❌ | Pendiente | ⏳ |
| restaurant_reservations | Multi Tenant | ✅ | Pendiente | ⏳ |
| restaurant_reservation_logs | Multi Tenant | ✅ | Pendiente | ⏳ |
| restaurant_waitlist | Multi Tenant | ✅ | Pendiente | ⏳ |
| restaurant_notification_queue | Multi Tenant | ✅ | Pendiente | ⏳ |
| device_tokens | Multi Tenant | ✅ | Pendiente | ⏳ |
| push_subscriptions | Multi Tenant | ✅ | Pendiente | ⏳ |
| liquidations | Multi Tenant | ✅ | Pendiente | ⏳ |
| wolf_invoices | Heredada | ❌ | Pendiente | ⏳ |
| legal_documents | Global | ❌ | No aplica | ⏳ |
| legal_events | Heredada | ❌ | Pendiente | ⏳ |
| system_modules | Global | ❌ | No aplica | ⏳ |
| manager_pwa_settings | Global | ❌ | No aplica | ⏳ |

---

# Funciones reutilizadas

current_restaurant_id()

current_restaurant_user_id()

current_restaurant_role()

is_restaurant_user()

is_restaurant_admin()

is_super_admin()

---

# Orden de implementación

1. Restaurants
2. Users
3. Roles
4. Catalog
5. Orders
6. Reservations
7. Settings
8. Notifications
9. Payments
10. Legal

---

# Estado

Pendiente de implementación.