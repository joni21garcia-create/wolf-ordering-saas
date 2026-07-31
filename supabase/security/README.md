# Wolf Ordering - Row Level Security (RLS)

## Objetivo

Implementar un sistema de Row Level Security (RLS) consistente,
seguro y reutilizable para todas las tablas del proyecto.

El objetivo es garantizar que:

- Cada restaurante solo pueda acceder a su propia información.
- Los Super Administradores tengan acceso global.
- El código SQL sea reutilizable.
- Las políticas sean fáciles de mantener.

---

# Arquitectura

```
auth.users
        │
        ▼
restaurant_users
        │
        ▼
current_restaurant_id()
        │
        ▼
Row Level Security
        │
        ▼
products
categories
orders
gallery
settings
reservations
etc.
```

---

# Principios

## 1.

Nunca repetir consultas complejas dentro de las políticas.

Siempre reutilizar funciones auxiliares.

---

## 2.

Toda tabla perteneciente a un restaurante debe tener:

restaurant_id UUID

---

## 3.

Las políticas deberán utilizar funciones reutilizables.

Ejemplo:

current_restaurant_id()

No realizar JOIN complejos en cada política.

---

## 4.

Cada archivo SQL debe contener únicamente las políticas
de una tabla o módulo.

---

# Orden de implementación

01-functions.sql

↓

02-enable-rls.sql

↓

03-restaurants.sql

↓

04-categories.sql

↓

05-products.sql

↓

06-gallery.sql

↓

07-orders.sql

↓

08-order-items.sql

↓

09-reservations.sql

↓

10-restaurant-settings.sql

↓

11-pwa.sql

↓

12-notifications.sql

↓

13-users-and-roles.sql

↓

14-admin.sql

↓

15-favorites.sql

---

# Convenciones

Funciones:

current_restaurant_id()

is_restaurant_user()

is_super_admin()

---

Todas las funciones deberán ser:

- SECURITY DEFINER
- STABLE
- search_path = public

---

# Flujo de trabajo

1. Diseñar

2. Documentar

3. Implementar

4. Probar

5. Actualizar CHECKLIST

6. Commit

---

# Regla del proyecto

No se implementará ninguna política
sin haber sido documentada previamente.