/*
==========================================================

Wolf Ordering Push V2

Corregir índice UNIQUE de FCM

==========================================================
*/

-- Eliminar índice parcial incompatible con ON CONFLICT
DROP INDEX IF EXISTS public.push_subscriptions_fcm_token_idx;

-- Crear índice UNIQUE compatible con UPSERT
CREATE UNIQUE INDEX IF NOT EXISTS push_subscriptions_fcm_token_key
ON public.push_subscriptions (fcm_token);