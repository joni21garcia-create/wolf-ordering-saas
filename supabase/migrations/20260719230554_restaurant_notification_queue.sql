-- ============================================================================
-- TABLA: restaurant_notification_queue
-- ============================================================================

create table public.restaurant_notification_queue (

    id uuid primary key default gen_random_uuid(),

    restaurant_id uuid not null
        references public.restaurants(id)
        on delete cascade,

    reservation_id uuid
        references public.restaurant_reservations(id)
        on delete cascade,

    channel text not null,

    notification_type text not null,

    recipient text not null,

    subject text,

    content text not null,

    status text not null default 'pending',

    attempts integer not null default 0,

    max_attempts integer not null default 3,

    scheduled_for timestamptz not null default now(),

    sent_at timestamptz,

    last_error text,

    metadata jsonb not null default '{}'::jsonb,

    created_at timestamptz not null default now(),

    constraint notification_queue_channel_check
        check (
            channel in (
                'email',
                'whatsapp',
                'sms',
                'push'
            )
        ),

    constraint notification_queue_status_check
        check (
            status in (
                'pending',
                'processing',
                'sent',
                'failed',
                'cancelled'
            )
        )

);

-- ============================================================================
-- ÍNDICES
-- ============================================================================

create index idx_notification_queue_status
on public.restaurant_notification_queue (
    status,
    scheduled_for
);

create index idx_notification_queue_restaurant
on public.restaurant_notification_queue (
    restaurant_id
);

create index idx_notification_queue_reservation
on public.restaurant_notification_queue (
    reservation_id
);

-- ============================================================================
-- COMENTARIOS
-- ============================================================================

comment on table public.restaurant_notification_queue
is 'Cola de envío de notificaciones del módulo de reservas.';

comment on column public.restaurant_notification_queue.channel
is 'Canal utilizado para enviar la notificación.';

comment on column public.restaurant_notification_queue.notification_type
is 'Tipo de notificación: confirmación, recordatorio, cancelación, etc.';