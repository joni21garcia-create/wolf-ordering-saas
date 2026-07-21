-- ============================================================================
-- TABLA: restaurant_reservation_logs
-- ============================================================================

create table public.restaurant_reservation_logs (

    id uuid primary key default gen_random_uuid(),

    reservation_id uuid not null
        references public.restaurant_reservations(id)
        on delete cascade,

    restaurant_id uuid not null
        references public.restaurants(id)
        on delete cascade,

    action text not null,

    previous_status text,

    new_status text,

    actor_type text not null default 'system',

    actor_id uuid,

    message text,

    metadata jsonb not null default '{}'::jsonb,

    created_at timestamptz not null default now(),

    constraint reservation_logs_action_check
        check (
            action in (
                'created',
                'updated',
                'confirmed',
                'checked_in',
                'finished',
                'cancelled',
                'rejected',
                'no_show',
                'expired',
                'table_assigned',
                'table_removed',
                'note_added'
            )
        ),

    constraint reservation_logs_actor_check
        check (
            actor_type in (
                'system',
                'customer',
                'staff',
                'admin'
            )
        )

);

-- ============================================================================
-- ÍNDICES
-- ============================================================================

create index idx_reservation_logs_reservation
on public.restaurant_reservation_logs (
    reservation_id
);

create index idx_reservation_logs_restaurant
on public.restaurant_reservation_logs (
    restaurant_id
);

create index idx_reservation_logs_created_at
on public.restaurant_reservation_logs (
    created_at desc
);

create index idx_reservation_logs_action
on public.restaurant_reservation_logs (
    action
);

-- ============================================================================
-- COMENTARIOS
-- ============================================================================

comment on table public.restaurant_reservation_logs
is 'Historial completo de acciones realizadas sobre una reserva.';

comment on column public.restaurant_reservation_logs.action
is 'Acción registrada en el historial.';

comment on column public.restaurant_reservation_logs.actor_type
is 'Origen de la acción: sistema, cliente, personal o administrador.';