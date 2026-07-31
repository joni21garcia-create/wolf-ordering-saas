-- ============================================================================
-- TABLA: restaurant_waitlist
-- ============================================================================

create table public.restaurant_waitlist (

    id uuid primary key default gen_random_uuid(),

    restaurant_id uuid not null
        references public.restaurants(id)
        on delete cascade,

    reservation_id uuid
        references public.restaurant_reservations(id)
        on delete set null,

    customer_name text not null,

    customer_phone text not null,

    customer_email text,

    guests integer not null,

    requested_date date not null,

    requested_time time not null,

    status text not null default 'waiting',

    priority integer not null default 0,

    notified_at timestamptz,

    expires_at timestamptz,

    accepted_at timestamptz,

    notes text,

    metadata jsonb not null default '{}'::jsonb,

    created_at timestamptz not null default now(),

    updated_at timestamptz not null default now(),

    constraint restaurant_waitlist_guests_check
        check (guests > 0),

    constraint restaurant_waitlist_status_check
        check (
            status in (
                'waiting',
                'notified',
                'accepted',
                'expired',
                'cancelled'
            )
        )

);
-- ============================================================================
-- ÍNDICES
-- ============================================================================

create index idx_waitlist_restaurant
on public.restaurant_waitlist (
    restaurant_id
);
create index idx_waitlist_date
on public.restaurant_waitlist (
    requested_date,
    requested_time
);
create index idx_waitlist_status
on public.restaurant_waitlist (
    status
);
create index idx_waitlist_priority
on public.restaurant_waitlist (
    priority,
    created_at
);
-- ============================================================================
-- TRIGGER updated_at
-- ============================================================================

create trigger trg_waitlist_updated_at
before update
on public.restaurant_waitlist
for each row
execute function public.set_updated_at();
-- ============================================================================
-- COMENTARIOS
-- ============================================================================

comment on table public.restaurant_waitlist
is 'Lista de espera para reservas sin disponibilidad.';
comment on column public.restaurant_waitlist.priority
is 'Prioridad en la lista de espera. Un valor mayor tiene prioridad sobre uno menor.';
comment on column public.restaurant_waitlist.status
is 'Estado actual de la solicitud en lista de espera.';
