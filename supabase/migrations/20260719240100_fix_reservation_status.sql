alter table public.restaurant_reservations
drop constraint if exists restaurant_reservations_status_check;


alter table public.restaurant_reservations
add constraint restaurant_reservations_status_check
check (
 status in (
  'pending',
  'confirmed',
  'checked_in',
  'completed',
  'cancelled',
  'rejected',
  'no_show',
  'expired'
 )
);