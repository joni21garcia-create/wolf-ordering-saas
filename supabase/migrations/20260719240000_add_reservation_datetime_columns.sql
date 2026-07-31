alter table public.restaurant_reservations
add column if not exists start_at timestamptz,
add column if not exists end_at timestamptz;
update public.restaurant_reservations
set
 start_at = (reservation_date + start_time)::timestamptz,
 end_at = (reservation_date + end_time)::timestamptz
where start_at is null;
alter table public.restaurant_reservations
alter column start_at set not null,
alter column end_at set not null;
create index if not exists idx_reservations_start_at
on public.restaurant_reservations(start_at);
create index if not exists idx_reservations_end_at
on public.restaurant_reservations(end_at);
