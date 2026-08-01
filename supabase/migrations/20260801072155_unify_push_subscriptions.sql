/*
==========================================================

Wolf Ordering Push V2

Unificar Push Subscriptions

==========================================================
*/

BEGIN;

-- ======================================================
-- Agregar columnas para Android
-- ======================================================

ALTER TABLE push_subscriptions
ADD COLUMN IF NOT EXISTS fcm_token text;

ALTER TABLE push_subscriptions
ADD COLUMN IF NOT EXISTS platform text DEFAULT 'web';

-- ======================================================
-- Índice único para Web Push
-- ======================================================

CREATE UNIQUE INDEX IF NOT EXISTS
push_subscriptions_endpoint_idx
ON push_subscriptions(endpoint)
WHERE endpoint IS NOT NULL;

-- ======================================================
-- Índice único para Android
-- ======================================================

CREATE UNIQUE INDEX IF NOT EXISTS
push_subscriptions_fcm_token_idx
ON push_subscriptions(fcm_token)
WHERE fcm_token IS NOT NULL;

COMMIT;