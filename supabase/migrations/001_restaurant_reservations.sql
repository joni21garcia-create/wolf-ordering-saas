-- ============================================================================
-- EXTENSIONES
-- ============================================================================

create extension if not exists pgcrypto;
-- ============================================================================
-- TABLA: restaurant_reservations
-- ============================================================================

create table public.restaurant_reservations (

    id uuid primary key default gen_random_uuid(),

    restaurant_id uuid not null
        references public.restaurants(id)
        on delete cascade,

    reservation_number text not null unique,

    confirmation_code text not null unique,

    customer_name text not null,

    customer_email text,

    customer_phone text not null,

    reservation_date date not null,

    start_time time not null,

    end_time time not null,

    guests integer not null,

    status text not null default 'pending',

    occasion text,

    notes text,

    internal_notes text,

    source text not null default 'website',

    timezone text not null default 'America/Guayaquil',

    confirmed_at timestamptz,

    checked_in_at timestamptz,

    completed_at timestamptz,

    cancelled_at timestamptz,

    created_by uuid,

    metadata jsonb not null default '{}'::jsonb,

    created_at timestamptz not null default now(),

    updated_at timestamptz not null default now(),

    constraint restaurant_reservations_guests_check
        check (guests > 0),

    constraint restaurant_reservations_status_check
        check (
            status in (
                'pending',
                'confirmed',
                'checked_in',
                'finished',
                'cancelled',
                'rejected',
                'no_show',
                'expired'
            )
        ),

    constraint restaurant_reservations_time_check
        check (start_time < end_time)

);
-- ============================================================================
-- ÍNDICES
-- ============================================================================

create index idx_restaurant_reservations_restaurant
on public.restaurant_reservations (restaurant_id);
create index idx_restaurant_reservations_date
on public.restaurant_reservations (reservation_date);
create index idx_restaurant_reservations_status
on public.restaurant_reservations (status);
create index idx_restaurant_reservations_datetime
on public.restaurant_reservations (
    reservation_date,
    start_time
);
create index idx_restaurant_reservations_customer_phone
on public.restaurant_reservations (
    customer_phone
);
create index idx_restaurant_reservations_customer_email
on public.restaurant_reservations (
    customer_email
);
-- ============================================================================
-- COMENTARIOS
-- ============================================================================

comment on table public.restaurant_reservations
is 'Reservas de los restaurantes.';
comment on column public.restaurant_reservations.reservation_number
is 'Número legible para humanos (RES-000001).';
comment on column public.restaurant_reservations.confirmation_code
is 'Código de confirmación enviado al cliente.';
comment on column public.restaurant_reservations.metadata
is 'Información adicional para futuras integraciones.';
-- ============================================================================
-- FUNCIÓN: Actualizar updated_at automáticamente
-- ============================================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;
-- ============================================================================
-- TRIGGER
-- ============================================================================

create trigger trg_restaurant_reservations_updated_at
before update
on public.restaurant_reservations
for each row
execute function public.set_updated_at();
-- ============================================================================
-- SECUENCIA PARA NÚMERO DE RESERVA
-- ============================================================================

create sequence if not exists
public.restaurant_reservation_number_seq
start with 1
increment by 1;
-- ============================================================================
-- FUNCIÓN: Generar número de reserva
-- ============================================================================

create or replace function public.generate_reservation_number()
returns trigger
language plpgsql
as $$
begin

    if new.reservation_number is null
       or trim(new.reservation_number) = '' then

        new.reservation_number :=
            'RES-' ||
            lpad(
                nextval('public.restaurant_reservation_number_seq')::text,
                6,
                '0'
            );

    end if;

    return new;

end;
$$;
-- ============================================================================
-- TRIGGER
-- ============================================================================

create trigger trg_generate_reservation_number
before insert
on public.restaurant_reservations
for each row
execute function public.generate_reservation_number();
