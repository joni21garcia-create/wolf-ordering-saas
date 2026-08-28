WOLF HERO SLIDER FIX

This patch preserves the existing restaurant_hero_slides system and makes the visual design layer independent from slider state.

Includes:
- components/restaurant/Hero.tsx
- components/restaurant/HeroDesigns.css

Preserved:
- restaurant.heroSlides / restaurant.slides fallback
- active slides loaded by getRestaurant
- sort_order
- title/subtitle/button/image fields
- autoplay every 5 seconds
- slide indicators
- current slide rendering
- restaurant Theme colors and existing behavior

Improved:
- stable slide keys use slide.id (fallback index), so changing design/image does not confuse AnimatePresence
- manual previous/next controls
- design remains a presentation layer over the existing slider
- no Supabase migration
