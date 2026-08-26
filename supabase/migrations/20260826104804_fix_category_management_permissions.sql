create or replace function public.can_manage_catalog()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    public.is_super_admin()
    or (
      (public.is_owner() or public.is_manager())
      and exists (
        select 1
        from public.role_modules rm
        where rm.role_id = public.current_restaurant_role()
          and rm.module_code = 'categories'
          and rm.can_view = true
      )
    );
$$;