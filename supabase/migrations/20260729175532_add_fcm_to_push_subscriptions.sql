-- ==========================================================
-- PUSH SUBSCRIPTIONS
-- Soporte para Android (FCM)
-- ==========================================================

ALTER TABLE public.push_subscriptions
ADD COLUMN IF NOT EXISTS fcm_token text;

ALTER TABLE public.push_subscriptions
ADD COLUMN IF NOT EXISTS platform text DEFAULT 'web';

CREATE INDEX IF NOT EXISTS idx_push_subscriptions_fcm
ON public.push_subscriptions(fcm_token);