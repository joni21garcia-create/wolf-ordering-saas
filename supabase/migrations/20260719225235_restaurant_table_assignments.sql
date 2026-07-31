-- ============================================================================
-- TABLA: restaurant_table_assignments
-- ============================================================================

create table public.restaurant_table_assignments (

    id uuid primary key default gen_random_uuid(),

    reservation_id uuid not null
        references public.restaurant_reservations(id)
        on delete cascade,

    table_id uuid not null
        references public.restaurant_tables(id)
        on delete cascade,

    assigned_guests integer not null,

    is_primary boolean not null default false,

    assigned_at timestamptz not null default now(),

    assigned_by uuid,

    notes text,

    metadata jsonb not null default '{}'::jsonb,

    created_at timestamptz not null default now(),

    updated_at timestamptz not null default now(),

    constraint restaurant_table_assignments_guests_check
        check (assigned_guests > 0),

    constraint restaurant_table_assignments_unique
        unique (
            reservation_id,
            table_id
        )

);
-- ============================================================================
-- ÍNDICES
-- ============================================================================

create index idx_table_assignments_reservation
on public.restaurant_table_assignments (
    reservation_id
);
create index idx_table_assignments_table
on public.restaurant_table_assignments (
    table_id
);
create index idx_table_assignments_primary
on public.restaurant_table_assignments (
    reservation_id,
    is_primary
);
-- ============================================================================
-- TRIGGER updated_at
-- ============================================================================

create trigger trg_table_assignments_updated_at
before update
on public.restaurant_table_assignments
for each row
execute function public.set_updated_at();
-- ============================================================================
-- COMENTARIOS
-- ============================================================================

comment on table public.restaurant_table_assignments
is 'Relación entre reservas y mesas asignadas.';
comment on column public.restaurant_table_assignments.is_primary
is 'Indica cuál es la mesa principal cuando una reserva utiliza varias mesas.';
comment on column public.restaurant_table_assignments.assigned_guests
is 'Cantidad de personas asignadas a esa mesa.';
comment on column public.restaurant_table_assignments.metadata
is 'Información adicional de la asignación.';
