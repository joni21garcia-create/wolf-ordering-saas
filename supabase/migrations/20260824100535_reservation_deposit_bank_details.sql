alter table public.reservation_deposit_settings
  add column if not exists bank_name text,

  add column if not exists bank_account_type text
    check (
      bank_account_type is null
      or bank_account_type in ('checking', 'savings')
    ),

  add column if not exists bank_account_number text,

  add column if not exists bank_account_holder text,

  add column if not exists bank_account_document text;