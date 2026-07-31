# Wolf Ordering - Plan de pruebas RLS

## Objetivo

Verificar que todas las políticas de Row Level Security funcionen
correctamente antes de pasar a producción.

---

# Casos de prueba

## Usuario sin iniciar sesión

Debe:

- No ver información privada.
- No crear registros.
- No modificar registros.
- No eliminar registros.

Resultado esperado:

✅ Acceso denegado.

---

## Usuario de Restaurante A

Debe:

- Ver únicamente su restaurante.
- Crear registros únicamente en su restaurante.
- Editar únicamente su restaurante.
- No acceder al Restaurante B.

Resultado esperado:

✅ Acceso permitido únicamente a su restaurante.

---

## Usuario de Restaurante B

Debe:

- No visualizar información del Restaurante A.

Resultado esperado:

✅ Datos completamente aislados.

---

## Usuario inactivo

Debe:

- No acceder al sistema.

Resultado esperado:

✅ Acceso denegado.

---

## Super Administrador

Debe:

- Ver todos los restaurantes.
- Administrar todos los restaurantes.

Resultado esperado:

✅ Acceso completo.

---

# Tablas a validar

- restaurants
- categories
- products
- gallery
- orders
- order_items
- reservations
- restaurant_settings
- notifications
- favorites

---

# Validaciones

Cada módulo deberá comprobar:

- SELECT
- INSERT
- UPDATE
- DELETE

---

# Checklist por tabla

☐ SELECT

☐ INSERT

☐ UPDATE

☐ DELETE

---

# Producción

No activar RLS en producción hasta que todas las pruebas
estén completadas.