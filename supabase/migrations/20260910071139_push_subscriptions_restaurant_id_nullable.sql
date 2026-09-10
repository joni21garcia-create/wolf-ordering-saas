/*
==========================================================

Wolf Ordering Push V2

Permitir restaurant_id NULL en push_subscriptions para
repartidores de flota (sin restaurante fijo asignado).

==========================================================
*/

ALTER TABLE public.push_subscriptions
ALTER COLUMN restaurant_id DROP NOT NULL;