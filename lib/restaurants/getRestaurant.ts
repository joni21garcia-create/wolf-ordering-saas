import { createClient } from "@supabase/supabase-js";
import {
  isRestaurantOpen,
  getCurrentDayKey,
} from "@/lib/restaurant-hours";
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function getRestaurant(
  slug: string
) {
  const {
    data: restaurant,
    error,
  } = await supabase
    .from("restaurants")
    .select("*")
    .eq("slug", slug)
    .single();

  console.log(
    "Restaurant:",
    restaurant
  );

  console.log(
    "Error:",
    error
  );

  if (
    error ||
    !restaurant
  ) {
    return null;
  }

  const {
    data: settings,
  } = await supabase
    .from(
      "restaurant_settings"
    )
    .select("*")
    .eq(
      "restaurant_id",
      restaurant.id
    )
    .maybeSingle();

    const {
  data: pwaSettings,
} = await supabase
  .from("restaurant_pwa_settings")
  .select("*")
  .eq(
    "restaurant_id",
    restaurant.id
  )
  .maybeSingle();


const {
  data: themeSettings,
} = await supabase
  .from("restaurant_theme_settings")
  .select("*")
  .eq(
    "restaurant_id",
    restaurant.id
  )
  .order(
    "created_at",
    {
      ascending: false,
    }
  )
  .limit(1)
  .maybeSingle();

  const {
    data: categories,
  } = await supabase
    .from("categories")
    .select("*")
    .eq(
      "restaurant_id",
      restaurant.id
    )
    .order(
      "sort_order",
      {
        ascending: true,
      }
    );

  const {
    data: products,
  } = await supabase
    .from("products")
    .select("*")
    .eq(
      "restaurant_id",
      restaurant.id
    );
    

  const {
    data: featuredProducts,
  } = await supabase
    .from("products")
    .select("*")
    .eq(
      "restaurant_id",
      restaurant.id
    )
    .eq(
      "featured",
      true
    );

  const {
    data: gallery,
  } = await supabase
    .from(
      "restaurant_gallery"
    )
    .select("*")
    .eq(
      "restaurant_id",
      restaurant.id
    )
    .order(
      "sort_order"
    );

  const {
    data: services,
  } = await supabase
    .from(
      "restaurant_services"
    )
    .select("*")
    .eq(
      "restaurant_id",
      restaurant.id
    )
    .order(
      "sort_order"
    );

  const {
    data: heroSlides,
  } = await supabase
    .from(
      "restaurant_hero_slides"
    )
    .select("*")
    .eq(
      "restaurant_id",
      restaurant.id
    )
    .eq(
      "active",
      true
    )
    .order(
      "sort_order"
    );

    const {
  data: schedule,
} = await supabase
  .from(
    "schedule_settings"
  )
  .select("*")
  .eq(
    "restaurant_id",
    restaurant.id
  )
  .order(
    "created_at",
    {
      ascending: false,
    }
  )
  .limit(1)
  .maybeSingle();

  const {
  data: deliverySettings,
  error: deliveryError,
} = await supabase
  .from(
    "restaurant_delivery_settings"
  )
  .select("*")
  .eq(
    "restaurant_id",
    restaurant.id
  )
  .maybeSingle();

console.log(
  "DELIVERY ERROR:",
  deliveryError
);

console.log(
  "DELIVERY SETTINGS:",
  deliverySettings
);

console.log(
  "RESTAURANT ID:",
  restaurant.id
);



const dayKey =
  getCurrentDayKey();

const todayOpen =
  schedule?.[
    `${dayKey}_open`
  ] || "";

const todayClose =
  schedule?.[
    `${dayKey}_close`
  ] || "";

const isOpen =
  schedule
    ? isRestaurantOpen(
        schedule
      )
    : true; 

console.log(
  "DELIVERY SETTINGS:",
  deliverySettings
);

return {
  ...restaurant,

  settings,

  pwaSettings,

   themeSettings,

  deliverySettings,


  categories:
    categories || [],

  products:
    products || [],

  featuredProducts:
    featuredProducts ||
    [],

  gallery:
    gallery || [],

  services:
    services || [],

  heroSlides:
    heroSlides || [],

  schedule,

  is_open:
    isOpen,

  today_open:
    todayOpen,

  today_close:
    todayClose,
};
}
