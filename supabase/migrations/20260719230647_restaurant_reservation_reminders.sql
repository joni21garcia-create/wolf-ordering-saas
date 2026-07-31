-- ============================================================================
-- TABLA: restaurant_reservation_reminders
-- ============================================================================

create table public.restaurant_reservation_reminders (

    id uuid primary key default gen_random_uuid(),

    reservation_id uuid not null
        references public.restaurant_reservations(id)
        on delete cascade,

    restaurant_id uuid not null
        references public.restaurants(id)
        on delete cascade,

    reminder_type text not null,

    send_before_minutes integer not null,

    channel text not null,

    enabled boolean not null default true,

    last_sent_at timestamptz,

    created_at timestamptz not null default now(),

    updated_at timestamptz not null default now(),

    constraint reservation_reminders_minutes_check
        check (send_before_minutes > 0),

    constraint reservation_reminders_type_check
        check (
            reminder_type in (
                'confirmation',
                'upcoming',
                'follow_up'
            )
        ),

    constraint reservation_reminders_channel_check
        check (
            channel in (
                'email',
                'whatsapp',
                'sms',
                'push'
            )
        )

);
-- ============================================================================
-- ÍNDICES
-- ============================================================================

create index idx_reservation_reminders_reservation
on public.restaurant_reservation_reminders (
    reservation_id
);
create index idx_reservation_reminders_restaurant
on public.restaurant_reservation_reminders (
    restaurant_id
);
create index idx_reservation_reminders_enabled
on public.restaurant_reservation_reminders (
    enabled
);
-- ============================================================================
-- TRIGGER updated_at
-- ============================================================================

create trigger trg_reservation_reminders_updated_at
before update
on public.restaurant_reservation_reminders
for each row
execute function public.set_updated_at();
-- ============================================================================
-- COMENTARIOS
-- ============================================================================

comment on table public.restaurant_reservation_reminders
is 'Configuración y seguimiento de recordatorios asociados a reservas.';
comment on column public.restaurant_reservation_reminders.send_before_minutes
is 'Minutos antes de la reserva en que debe enviarse el recordatorio.';
comment on column public.restaurant_reservation_reminders.reminder_type
is 'Tipo de recordatorio programado.';
