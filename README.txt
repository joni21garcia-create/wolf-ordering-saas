WOLF ORDERING — UI/WARNING FIX PATCH

Purpose:
- Fix long design names/descriptions overflowing in the compact design selector.
- Remove the fake/embedded preview dependency from the selector (the selector remains compact).
- Fix Next Image performance warning in the Hero by using explicit intrinsic dimensions.
- Fix Framer Motion color warning by giving the hovered "Ver Menú" surface a concrete rgba background instead of relying on Tailwind's color token during animation.

No database migration.
Do NOT run supabase db push for this patch.

Copy this package over the existing project and restart Next.js after deleting .next.
