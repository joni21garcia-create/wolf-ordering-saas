-- ============================================================================
-- TABLA: restaurant_reservation_blocks
-- ============================================================================

create table public.restaurant_reservation_blocks (

    id uuid primary key default gen_random_uuid(),

    restaurant_id uuid not null
        references public.restaurants(id)
        on delete cascade,

    table_id uuid
        references public.restaurant_tables(id)
        on delete cascade,

    title text not null,

    description text,

    block_type text not null default 'schedule',

    start_at timestamptz not null,

    end_at timestamptz not null,

    affects_all_tables boolean not null default true,

    active boolean not null default true,

    color text default '#ef4444',

    metadata jsonb not null default '{}'::jsonb,

    created_at timestamptz not null default now(),

    updated_at timestamptz not null default now(),

    constraint reservation_blocks_dates_check
        check (start_at < end_at),

    constraint reservation_blocks_type_check
        check (
            block_type in (
                'schedule',
                'maintenance',
                'holiday',
                'private_event',
                'manual'
            )
        )

);
-- ============================================================================
-- ÍNDICES
-- ============================================================================

create index idx_reservation_blocks_restaurant
on public.restaurant_reservation_blocks (
    restaurant_id
);
create index idx_reservation_blocks_dates
on public.restaurant_reservation_blocks (
    start_at,
    end_at
);
create index idx_reservation_blocks_table
on public.restaurant_reservation_blocks (
    table_id
);
create index idx_reservation_blocks_active
on public.restaurant_reservation_blocks (
    active
);
-- ============================================================================
-- TRIGGER
-- ============================================================================

create trigger trg_reservation_blocks_updated_at
before update
on public.restaurant_reservation_blocks
for each row
execute function public.set_updated_at();
-- ============================================================================
-- COMENTARIOS
-- ============================================================================

comment on table public.restaurant_reservation_blocks
is 'Bloqueos de horarios, mesas o fechas para reservas.';
comment on column public.restaurant_reservation_blocks.affects_all_tables
is 'Si es true bloquea todas las mesas del restaurante.';
comment on column public.restaurant_reservation_blocks.block_type
is 'Tipo de bloqueo aplicado.';
comment on column public.restaurant_reservation_blocks.metadata
is 'Información adicional del bloqueo.';
