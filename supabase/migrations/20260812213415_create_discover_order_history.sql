-- ============================================================
-- Discover · Historial global de pedidos del cliente
-- ============================================================

create table if not exists public.discover_order_history (
  id uuid primary key default gen_random_uuid(),

  -- Identidad global del cliente Wolf
  customer_id text not null,

  -- Pedido real
  order_id uuid not null,

  -- Restaurante donde se realizó el pedido
  restaurant_id uuid not null,

  created_at timestamptz not null default now(),

  -- Un pedido solo puede aparecer una vez
  constraint discover_order_history_order_unique
    unique (order_id),

  -- Relación con el pedido real
  constraint discover_order_history_order_fk
    foreign key (order_id)
    references public.orders(id)
    on delete cascade,

  -- Relación con el restaurante
  constraint discover_order_history_restaurant_fk
    foreign key (restaurant_id)
    references public.restaurants(id)
    on delete cascade
);

-- ============================================================
-- Índices
-- ============================================================

create index if not exists
  discover_order_history_customer_id_idx
on public.discover_order_history(customer_id);

create index if not exists
  discover_order_history_customer_created_idx
on public.discover_order_history(
  customer_id,
  created_at desc
);

create index if not exists
  discover_order_history_restaurant_id_idx
on public.discover_order_history(restaurant_id);

-- ============================================================
-- RLS
-- ============================================================

alter table public.discover_order_history enable row level security;

-- El cliente solamente puede consultar su propio historial.
create policy "Customers can view their own order history"
on public.discover_order_history
for select
using (
  customer_id =
    current_setting('request.headers', true)::json->>'x-wolf-customer-id'
);