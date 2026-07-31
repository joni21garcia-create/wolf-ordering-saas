-- ============================================================================
-- Permite consultar pedidos por tracking público
-- ============================================================================

create policy orders_public_tracking

on public.orders

for select

to anon

using (

    tracking_code is not null

);