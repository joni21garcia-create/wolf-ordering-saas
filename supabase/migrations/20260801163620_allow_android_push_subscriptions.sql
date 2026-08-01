/*
==========================================================

Wolf Ordering

Permitir registros Android en push_subscriptions

==========================================================
*/

ALTER TABLE public.push_subscriptions
ALTER COLUMN endpoint DROP NOT NULL;

ALTER TABLE public.push_subscriptions
ALTER COLUMN subscription DROP NOT NULL;

ALTER TABLE public.push_subscriptions
ALTER COLUMN user_agent DROP NOT NULL;