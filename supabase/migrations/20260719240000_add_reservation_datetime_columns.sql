alter table public.restaurant_reservations
add column if not exists start_at timestamptz;

alter table public.restaurant_reservations
add column if not exists end_at timestamptz;


update public.restaurant_reservations
set
start_at =
(
 reservation_date + start_time
)::timestamptz,

end_at =
(
 reservation_date + end_time
)::timestamptz;


create index if not exists idx_reservation_start_at
on public.restaurant_reservations(start_at);