-- ============================================================
-- Wolf Ordering
-- Customer Addresses
-- Anonymous customers / device based
-- ============================================================

create extension if not exists pgcrypto;

-- ============================================================
-- TABLE
-- ============================================================

create table if not exists public.customer_addresses (
  id uuid primary key default gen_random_uuid(),

  -- Anonymous Wolf customer identifier.
  -- This is NOT a Supabase auth user.
  customer_id text not null,

  -- Casa, Trabajo, Oficina, etc.
  label text not null default 'Casa',

  -- Optional recipient information for this address.
  recipient_name text,
  recipient_phone text,

  -- Address data used by Wolf Checkout.
  address text not null,
  zone text,
  reference text,
  instructions text,

  -- Optional map coordinates for future location features.
  latitude double precision,
  longitude double precision,

  -- One address can be the default delivery address.
  is_default boolean not null default false,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint customer_addresses_label_check
    check (char_length(trim(label)) between 1 and 40),

  constraint customer_addresses_address_check
    check (char_length(trim(address)) between 2 and 300),

  constraint customer_addresses_zone_check
    check (
      zone is null
      or char_length(trim(zone)) <= 120
    ),

  constraint customer_addresses_reference_check
    check (
      reference is null
      or char_length(trim(reference)) <= 300
    ),

  constraint customer_addresses_instructions_check
    check (
      instructions is null
      or char_length(trim(instructions)) <= 500
    )
);

-- ============================================================
-- INDEXES
-- ============================================================

create index if not exists idx_customer_addresses_customer_id
  on public.customer_addresses(customer_id);

create index if not exists idx_customer_addresses_customer_created
  on public.customer_addresses(customer_id, created_at desc);

-- Only one default address per anonymous customer.
create unique index if not exists idx_customer_addresses_one_default
  on public.customer_addresses(customer_id)
  where is_default = true;

-- ============================================================
-- UPDATED_AT
-- ============================================================

create or replace function public.set_customer_addresses_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists customer_addresses_updated_at
on public.customer_addresses;

create trigger customer_addresses_updated_at
before update on public.customer_addresses
for each row
execute function public.set_customer_addresses_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.customer_addresses enable row level security;

-- ============================================================
-- PUBLIC / ANONYMOUS ACCESS
--
-- Wolf does not require Supabase Auth for customers.
--
-- The client sends:
-- x-wolf-customer-id
--
-- The policy only allows access to rows belonging to that ID.
-- ============================================================

drop policy if exists "customer_addresses_select_own"
on public.customer_addresses;

create policy "customer_addresses_select_own"
on public.customer_addresses
for select
to anon, authenticated
using (
  customer_id =
    coalesce(
      current_setting('request.headers', true)::json
        ->> 'x-wolf-customer-id',
      ''
    )
);

drop policy if exists "customer_addresses_insert_own"
on public.customer_addresses;

create policy "customer_addresses_insert_own"
on public.customer_addresses
for insert
to anon, authenticated
with check (
  customer_id =
    coalesce(
      current_setting('request.headers', true)::json
        ->> 'x-wolf-customer-id',
      ''
    )
);

drop policy if exists "customer_addresses_update_own"
on public.customer_addresses;

create policy "customer_addresses_update_own"
on public.customer_addresses
for update
to anon, authenticated
using (
  customer_id =
    coalesce(
      current_setting('request.headers', true)::json
        ->> 'x-wolf-customer-id',
      ''
    )
)
with check (
  customer_id =
    coalesce(
      current_setting('request.headers', true)::json
        ->> 'x-wolf-customer-id',
      ''
    )
);

drop policy if exists "customer_addresses_delete_own"
on public.customer_addresses;

create policy "customer_addresses_delete_own"
on public.customer_addresses
for delete
to anon, authenticated
using (
  customer_id =
    coalesce(
      current_setting('request.headers', true)::json
        ->> 'x-wolf-customer-id',
      ''
    )
);

-- ============================================================
-- COMMENTS
-- ============================================================

comment on table public.customer_addresses is
'Anonymous Wolf customer delivery addresses. Not associated with a restaurant.';

comment on column public.customer_addresses.customer_id is
'Stable anonymous Wolf customer identifier stored on the customer device.';

comment on column public.customer_addresses.label is
'Human friendly address label such as Casa, Trabajo or Oficina.';

comment on column public.customer_addresses.is_default is
'Indicates the default delivery address for this anonymous customer.';