-- ============================================================================
-- TABLA: restaurant_reservation_settings
-- ============================================================================

create table public.restaurant_reservation_settings (

    id uuid primary key default gen_random_uuid(),

    restaurant_id uuid not null
        unique
        references public.restaurants(id)
        on delete cascade,

    reservations_enabled boolean not null default true,

    auto_confirm boolean not null default false,

    min_guests_per_reservation integer not null default 1,

    max_guests_per_reservation integer not null default 20,

    reservation_duration_minutes integer not null default 90,

    slot_interval_minutes integer not null default 30,

    buffer_before_minutes integer not null default 0,

    buffer_after_minutes integer not null default 0,

    min_advance_hours integer not null default 1,

    max_advance_days integer not null default 30,

    allow_same_day boolean not null default true,

    require_phone boolean not null default true,

    require_email boolean not null default false,

    allow_cancellations boolean not null default true,

    cancellation_limit_hours integer not null default 2,

    timezone text not null default 'America/Guayaquil',

    weekly_schedule jsonb not null default '{
        "monday":{"enabled":true,"open":"09:00","close":"22:00"},
        "tuesday":{"enabled":true,"open":"09:00","close":"22:00"},
        "wednesday":{"enabled":true,"open":"09:00","close":"22:00"},
        "thursday":{"enabled":true,"open":"09:00","close":"22:00"},
        "friday":{"enabled":true,"open":"09:00","close":"23:00"},
        "saturday":{"enabled":true,"open":"09:00","close":"23:00"},
        "sunday":{"enabled":true,"open":"09:00","close":"21:00"}
    }'::jsonb,

    special_dates jsonb not null default '[]'::jsonb,

    created_at timestamptz not null default now(),

    updated_at timestamptz not null default now(),

    constraint reservation_settings_guests_check
        check (
            min_guests_per_reservation > 0
            and
            max_guests_per_reservation >= min_guests_per_reservation
        ),

    constraint reservation_settings_duration_check
        check (
            reservation_duration_minutes > 0
        ),

    constraint reservation_settings_slot_check
        check (
            slot_interval_minutes > 0
        ),

    constraint reservation_settings_advance_check
        check (
            min_advance_hours >= 0
            and
            max_advance_days > 0
        )

);
-- ============================================================================
-- ÍNDICES
-- ============================================================================

create index idx_reservation_settings_restaurant
on public.restaurant_reservation_settings (
    restaurant_id
);
-- ============================================================================
-- TRIGGER updated_at
-- ============================================================================

create trigger trg_reservation_settings_updated_at
before update
on public.restaurant_reservation_settings
for each row
execute function public.set_updated_at();
-- ============================================================================
-- COMENTARIOS
-- ============================================================================

comment on table public.restaurant_reservation_settings
is 'Configuración general del módulo de reservas para cada restaurante.';
comment on column public.restaurant_reservation_settings.weekly_schedule
is 'Horario semanal del restaurante en formato JSON.';
comment on column public.restaurant_reservation_settings.special_dates
is 'Fechas especiales como feriados, cierres o eventos.';
