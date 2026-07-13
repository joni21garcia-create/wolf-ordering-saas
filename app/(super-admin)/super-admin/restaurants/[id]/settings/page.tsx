import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";



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

  return (
      <main
        style={{
          minHeight: "100vh",
          background:
            "radial-gradient(circle at top right,#351400 0%,#050505 45%)",
          color: "#fff",
        }}
      >
        <div
          style={{
            maxWidth: 1700,
            margin: "0 auto",
            padding: "40px 28px 60px",
          }}
        >
<SettingsHeader
  restaurantName={restaurant.name}
  totalModules={modules.length}
  configuredModules={
    healthItems.filter(
      x => x.status === "ok"
    ).length
  }
/>

          <SettingsHealthCard
            items={healthItems}
          />

          <SettingsQuickActions
            actions={quickActions}
          />

          <SettingsStats
            modules={modules}
            tabs={CATEGORY_TABS}
            actions={quickActions}
          />

          {/*
          ==========================================
          DESDE AQUÍ ENTRA LA PARTE CLIENTE
          ==========================================
          */}

          <SettingsClient
            modules={modules}
          />

          <SettingsRecentModules
            modules={modules}
          />

          <SettingsFooter />
        </div>
      </main>
    
  );
}