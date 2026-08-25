-- Google Reviews: controla si el botón aparece en el landing público.
-- El enlace google_reviews_url continúa siendo independiente.

alter table public.restaurants
add column if not exists show_google_reviews_landing boolean
not null default false;