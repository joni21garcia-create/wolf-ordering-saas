import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";



import SettingsShell from "./components/SettingsShell";
import SettingsHeader from "./components/SettingsHeader";
import SettingsQuickActions from "./components/SettingsQuickActions";
import SettingsSearch from "./components/SettingsSearch";
import SettingsCategoryTabs from "./components/SettingsCategoryTabs";
import SettingsStats from "./components/SettingsStats";
import SettingsGrid from "./components/SettingsGrid";
import SettingsRecentModules from "./components/SettingsRecentModules";
import SettingsHealthCard from "./components/SettingsHealthCard";
import SettingsFooter from "./components/SettingsFooter";
import SettingsClient from "./components/SettingsClient";

import {
  CATEGORY_TABS,
  getQuickActions,
  getSettingsModules,
} from "./components/data";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function SettingsPage({
  params,
}: Props) {
  const { id } = await params;

  const supabase =
    await createSupabaseServerClient();

  /*
  =====================================================
  USUARIO
  =====================================================
  */

  const {
    data: { user },
  } =
    await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  /*
  =====================================================
  RESTAURANTE
  =====================================================
  */

  const {
    data: restaurant,
  } = await supabase
    .from("restaurants")
    .select(`
      id,
      name,

      logo_url,

      contact_email,

      whatsapp_url,

      instagram,

      facebook,

      tiktok
    `)
    .eq("id", id)
    .maybeSingle();

  if (!restaurant) {
    redirect("/super-admin/restaurants");
  }

  /*
  =====================================================
  DELIVERY
  =====================================================
  */

  const {
    data: delivery,
  } = await supabase
    .from(
      "restaurant_delivery_settings"
    )
    .select(`
      id
    `)
    .eq(
      "restaurant_id",
      restaurant.id
    )
    .maybeSingle();

  /*
  =====================================================
  HORARIOS
  =====================================================
  */

  const {
    data: schedule,
  } = await supabase
    .from(
      "restaurant_schedule"
    )
    .select("id")
    .eq(
      "restaurant_id",
      restaurant.id
    );

  /*
  =====================================================
  DATOS
  =====================================================
  */

  const modules =
    getSettingsModules(
      restaurant.id
    );

  const quickActions =
    getQuickActions(
      restaurant.id
    );

  /*
  =====================================================
  HEALTH
  =====================================================
  */

type HealthStatus =
  | "ok"
  | "warning"
  | "error";

type HealthItem = {
  title: string;
  status: HealthStatus;
};

  const healthItems: HealthItem[] = [
    {
      title: "Logo",

      status:
        restaurant.logo_url
          ? "ok"
          : "warning",
    },

    {
      title: "Contacto",

      status:
        restaurant.contact_email
          ? "ok"
          : "warning",
    },

    {
      title: "WhatsApp",

      status:
        restaurant.whatsapp_url
          ? "ok"
          : "warning",
    },

    {
      title: "Redes Sociales",

      status:
        restaurant.instagram ||
        restaurant.facebook ||
        restaurant.tiktok
          ? "ok"
          : "warning",
    },

    {
      title: "Delivery",

      status: delivery
        ? "ok"
        : "warning",
    },

    {
      title: "Horarios",

      status:
        schedule &&
        schedule.length > 0
          ? "ok"
          : "warning",
    },
  ];
  /*
====================================================
RENDER
====================================================
*/

  const configuredCount = healthItems.filter(
    (item) => item.status === "ok"
  ).length;

  const configurationProgress =
    modules.length > 0
      ? Math.round((configuredCount / modules.length) * 100)
      : 0;

  return (
    <SettingsShell
      restaurantName={restaurant.name}
      progress={configurationProgress}
    >
      <SettingsHeader />

      <SettingsHealthCard items={healthItems} />

      <SettingsQuickActions actions={quickActions} />

      <SettingsStats
        modules={modules}
        tabs={CATEGORY_TABS}
        actions={quickActions}
      />

      <SettingsClient modules={modules} />

      <SettingsRecentModules modules={modules} />

      <SettingsFooter />
    </SettingsShell>
  );
}