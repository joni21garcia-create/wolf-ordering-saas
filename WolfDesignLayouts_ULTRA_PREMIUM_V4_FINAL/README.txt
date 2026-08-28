WOLF ORDERING — ULTRA PREMIUM V4 (UI ONLY)

This patch improves only the Design Experience selector and Hero composition styling.
It does NOT include database migrations. Do NOT run supabase db push for this patch.

Replaces:
- app/(super-admin)/super-admin/restaurants/[id]/settings/themes/DesignThemeSelector.tsx
- components/restaurant/HeroDesigns.css

What changes:
- Premium, compact selector with less empty space.
- Real restaurant data in previews (name, description, hero image, gallery, theme colors).
- Mobile/Desktop preview toggle.
- Distinct composition previews for all 15 designs.
- Clear applied vs selected state.
- Search + category filters.
- Stronger Hero composition rules for the premium layouts.
- Existing Theme settings remain independent.

Validated with TypeScript (npx tsc --noEmit --skipLibCheck) in a project copy: PASS.
