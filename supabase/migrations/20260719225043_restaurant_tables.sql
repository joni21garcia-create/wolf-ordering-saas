-- ============================================================================
-- TABLA: restaurant_tables
-- ============================================================================

create table public.restaurant_tables (

    id uuid primary key default gen_random_uuid(),

    restaurant_id uuid not null
        references public.restaurants(id)
        on delete cascade,

    code text not null,

    name text not null,

    area text,

    capacity integer not null,

    min_capacity integer not null default 1,

    max_capacity integer,

    position_x numeric(10,2),

    position_y numeric(10,2),

    shape text not null default 'square',

    color text,

    active boolean not null default true,

    joinable boolean not null default false,

    notes text,

    metadata jsonb not null default '{}'::jsonb,

    created_at timestamptz not null default now(),

    updated_at timestamptz not null default now(),

    constraint restaurant_tables_capacity_check
        check (capacity > 0),

    constraint restaurant_tables_min_capacity_check
        check (
            min_capacity > 0
            and
            min_capacity <= capacity
        ),

    constraint restaurant_tables_max_capacity_check
        check (
            max_capacity is null
            or max_capacity >= capacity
        ),

    constraint restaurant_tables_shape_check
        check (
            shape in (
                'square',
                'rectangle',
                'round',
                'oval',
                'custom'
            )
        ),

    constraint restaurant_tables_unique_code
        unique (restaurant_id, code)

);
-- ============================================================================
-- ÍNDICES
-- ============================================================================

create index idx_restaurant_tables_restaurant
on public.restaurant_tables (restaurant_id);
create index idx_restaurant_tables_active
on public.restaurant_tables (
    restaurant_id,
    active
);
create index idx_restaurant_tables_capacity
on public.restaurant_tables (
    restaurant_id,
    capacity
);
-- ============================================================================
-- TRIGGER updated_at
-- ============================================================================

create trigger trg_restaurant_tables_updated_at
before update
on public.restaurant_tables
for each row
execute function public.set_updated_at();
-- ============================================================================
-- COMENTARIOS
-- ============================================================================

comment on table public.restaurant_tables
is 'Mesas disponibles de cada restaurante.';
comment on column public.restaurant_tables.code
is 'Código interno de la mesa. Ej: M01, T12, VIP-1.';
comment on column public.restaurant_tables.position_x
is 'Posición X para plano del restaurante.';
comment on column public.restaurant_tables.position_y
is 'Posición Y para plano del restaurante.';
comment on column public.restaurant_tables.joinable
is 'Indica si la mesa puede unirse con otras.';
comment on column public.restaurant_tables.metadata
is 'Información adicional del plano o integraciones.';
