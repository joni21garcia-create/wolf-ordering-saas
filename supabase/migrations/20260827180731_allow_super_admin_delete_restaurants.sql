CREATE POLICY restaurants_delete
ON public.restaurants
FOR DELETE
TO authenticated
USING (
  public.is_super_admin()
);