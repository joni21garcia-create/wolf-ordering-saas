-- ============================================================================
-- PROTECCIÓN DE CONCURRENCIA PARA ASIGNACIÓN DE MESAS
-- ============================================================================
--
-- Evita que dos reservas simultáneas puedan asignar la misma mesa
-- durante intervalos de tiempo que se solapan.
--
-- La protección se realiza en PostgreSQL mediante:
--
--   pg_advisory_xact_lock()
--
-- El lock vive durante toda la transacción.
--
-- Esto es importante porque una comprobación solamente en TypeScript
-- tiene una ventana de carrera:
--
--   A comprueba -> libre
--   B comprueba -> libre
--   A inserta
--   B inserta
--
-- El trigger elimina esa condición de carrera.
-- ============================================================================


-- ============================================================================
-- FUNCIÓN
-- ============================================================================

create or replace function public.prevent_table_assignment_overlap()
returns trigger
language plpgsql
as $$
declare
    v_restaurant_id uuid;
    v_new_start timestamptz;
    v_new_end timestamptz;
    v_conflicting_assignment_id uuid;
    v_conflicting_reservation_id uuid;
    v_conflicting_reservation_number text;
begin

    --------------------------------------------------------------------------
    -- Obtener restaurante y horario de la reserva que se está asignando.
    --------------------------------------------------------------------------

    select
        rr.restaurant_id,
        rr.start_at,
        rr.end_at
    into
        v_restaurant_id,
        v_new_start,
        v_new_end
    from public.restaurant_reservations rr
    where rr.id = new.reservation_id;


    --------------------------------------------------------------------------
    -- La reserva debe existir.
    --------------------------------------------------------------------------

    if v_restaurant_id is null then
        raise exception
            using
                errcode = '23503',
                message =
                    'RESERVATION_NOT_FOUND',
                detail =
                    'No existe la reserva asociada a la asignación de mesa.';
    end if;


    --------------------------------------------------------------------------
    -- Validación básica del intervalo.
    --------------------------------------------------------------------------

    if v_new_start is null
       or v_new_end is null
       or v_new_start >= v_new_end then

        raise exception
            using
                errcode = '22023',
                message =
                    'INVALID_RESERVATION_INTERVAL',
                detail =
                    'La reserva tiene un intervalo de tiempo inválido.';
    end if;


    --------------------------------------------------------------------------
    -- Lock transaccional por restaurante.
    --
    -- Todas las asignaciones del mismo restaurante pasan por el mismo lock.
    --
    -- El lock se libera automáticamente al terminar la transacción.
    --------------------------------------------------------------------------

    perform pg_advisory_xact_lock(
        hashtextextended(
            'reservation-table-assignment:' ||
            v_restaurant_id::text,
            0
        )
    );


    --------------------------------------------------------------------------
    -- Buscar una asignación conflictiva.
    --
    -- Los estados que ocupan mesa son:
    --
    --   pending
    --   confirmed
    --   checked_in
    --
    -- Los estados finales no bloquean:
    --
    --   finished
    --   cancelled
    --   rejected
    --   no_show
    --   expired
    --
    -- Importante:
    --
    --   start < existing_end
    --   AND
    --   end > existing_start
    --
    -- Esto permite:
    --
    --   18:00 - 19:30
    --   19:30 - 21:00
    --
    -- porque no existe solapamiento real.
    --------------------------------------------------------------------------

    select
        rta.id,
        rr.id,
        rr.reservation_number
    into
        v_conflicting_assignment_id,
        v_conflicting_reservation_id,
        v_conflicting_reservation_number
    from public.restaurant_table_assignments rta

    inner join public.restaurant_reservations rr
        on rr.id = rta.reservation_id

    where rta.table_id = new.table_id

      and rr.restaurant_id = v_restaurant_id

      and rr.id <> new.reservation_id

      and rr.status in (
          'pending',
          'confirmed',
          'checked_in'
      )

      and rr.start_at < v_new_end
      and rr.end_at > v_new_start

    limit 1;


    --------------------------------------------------------------------------
    -- Si existe conflicto, abortar la asignación.
    --------------------------------------------------------------------------

    if v_conflicting_assignment_id is not null then

        raise exception
            using
                errcode = '23P01',
                message =
                    'TABLE_ASSIGNMENT_CONFLICT',
                detail =
                    format(
                        'La mesa %s ya está asignada a la reserva %s durante el intervalo solicitado.',
                        new.table_id,
                        coalesce(
                            v_conflicting_reservation_number,
                            v_conflicting_reservation_id::text
                        )
                    ),
                hint =
                    'Seleccione otra mesa u otro horario.';
    end if;


    return new;
end;
$$;


-- ============================================================================
-- TRIGGER
-- ============================================================================

drop trigger if exists
trg_prevent_table_assignment_overlap
on public.restaurant_table_assignments;


create trigger
trg_prevent_table_assignment_overlap

before insert or update
on public.restaurant_table_assignments

for each row

execute function
public.prevent_table_assignment_overlap();


-- ============================================================================
-- COMENTARIO
-- ============================================================================

comment on function
public.prevent_table_assignment_overlap()

is
'Evita asignaciones simultáneas de la misma mesa durante intervalos solapados y protege la asignación contra condiciones de carrera mediante un advisory transaction lock.';