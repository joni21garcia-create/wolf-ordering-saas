-- Fecha exacta en la que un pedido Delivery pasa a "En camino".
-- Ejecutar una sola vez en Supabase SQL Editor.

alter table public.orders
add column if not exists out_for_delivery_at timestamptz;