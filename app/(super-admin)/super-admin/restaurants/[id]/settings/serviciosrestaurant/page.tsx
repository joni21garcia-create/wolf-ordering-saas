"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import BackToSettings from "@/components/admin/BackToSettings";
import PermissionGuard from "@/components/auth/PermissionGuard";

const SERVICE_ICON_MAP: Record<string, string> = {
  truck: "🚚",
  pickup: "🏪",
  dinein: "🍽️",
  schedule: "📦",
  scheduled: "📦",
  onlinepay: "💳",
  card: "💳",
  cash: "💵",
  whatsapp: "📱",
  loyalty: "⭐",
  burger: "🍔",
  pizza: "🍕",
  mexican: "🌮",
  taco: "🌮",
  chicken: "🍗",
  grill: "🥩",
  healthy: "🥗",
  pasta: "🍝",
  sushi: "🍣",
  cocktail: "🍹",
  beer: "🍺",
  wine: "🍷",
  music: "🎵",
  dj: "🎧",
  sports: "⚽",
  happyhour: "🥂",
  nightlife: "🌙",
  night: "🌙",
  party: "🎉",
  events: "🎉",
  birthday: "🎂",
  corporate: "💼",
  groups: "👨‍👩‍👧‍👦",
  karaoke: "🎤",
  promo: "🎁",
  coffee: "☕",
  dessert: "🧁",
  cake: "🍰",
  icecream: "🍨",
  bakery: "🥐",
};

function getServiceEmoji(icon: unknown) {
  if (typeof icon !== "string") return "✦";
  return SERVICE_ICON_MAP[icon.toLowerCase()] || icon || "✦";
}

export default function ServiciosRestaurantPage() {
  const params = useParams();
  const restaurantId = params.id as string;
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServices();
  }, []);

  async function loadServices() {
    try {
      const { data } = await supabase
        .from("restaurant_services")
        .select("*")
        .eq("restaurant_id", restaurantId)
        .order("sort_order");
      setServices(data || []);
    } finally {
      setLoading(false);
    }
  }

  async function toggleService(service: any) {
    await supabase
      .from("restaurant_services")
      .update({ active: !service.active })
      .eq("id", service.id);
    loadServices();
  }

  async function deleteService(serviceId: string) {
    if (!confirm("¿Eliminar este servicio permanentemente?")) return;
    await supabase.from("restaurant_services").delete().eq("id", serviceId);
    loadServices();
  }

  if (loading) {
    return (
      <main className="restaurant-services-page loading-page">
        <div>Cargando servicios...</div>
      </main>
    );
  }

  return (
    <PermissionGuard permission="serviciosrestaurant">
      <main className="restaurant-services-page">
        <div className="services-shell">
          <header className="services-header">
            <BackToSettings restaurantId={restaurantId} />

            <div className="header-row">
              <div>
                <span className="eyebrow">EXPERIENCIA · SERVICIOS</span>
                <h1>Servicios</h1>
                <p>Gestiona los servicios que muestras en tu restaurante.</p>
              </div>

              <Link
                className="add-button"
                href={`/super-admin/restaurants/${restaurantId}/settings/serviciosrestaurant/nuevo`}
              >
                <span>＋</span>
                Nuevo
              </Link>
            </div>
          </header>

          <section className="summary">
            <div>
              <span>Total</span>
              <strong>{services.length}</strong>
            </div>
            <div>
              <span>Activos</span>
              <strong className="green">
                {services.filter((service) => service.active).length}
              </strong>
            </div>
            <div>
              <span>Ocultos</span>
              <strong>
                {services.filter((service) => !service.active).length}
              </strong>
            </div>
          </section>

          <section className="services-list">
            {services.length === 0 ? (
              <div className="empty">
                <div className="empty-icon">✦</div>
                <strong>No hay servicios todavía</strong>
                <small>Agrega el primero para mostrarlo en tu restaurante.</small>
                <Link
                  href={`/super-admin/restaurants/${restaurantId}/settings/serviciosrestaurant/nuevo`}
                  className="empty-button"
                >
                  ＋ Crear servicio
                </Link>
              </div>
            ) : (
              services.map((service, index) => (
                <ServiceAccordion
                  key={service.id}
                  service={service}
                  index={index}
                  restaurantId={restaurantId}
                  onToggle={() => toggleService(service)}
                  onDelete={() => deleteService(service.id)}
                />
              ))
            )}
          </section>
        </div>

        <style jsx global>{`
          .restaurant-services-page {
            min-height:100dvh;
            width:100%;
            box-sizing:border-box;
            padding:14px 10px 34px;
            background:#080808;
            color:#fff;
            font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
          }

          .services-shell {
            width:100%;
            max-width:680px;
            margin:0 auto;
          }

          .services-header {
            margin-bottom:8px;
          }

          .header-row {
            display:flex;
            align-items:flex-end;
            justify-content:space-between;
            gap:8px;
            margin-top:8px;
          }

          .eyebrow {
            display:block;
            color:#f97316;
            font-size:7px;
            font-weight:900;
            letter-spacing:1.2px;
          }

          .header-row h1 {
            margin:2px 0 0;
            font-size:23px;
            line-height:1.05;
            letter-spacing:-.55px;
            font-weight:900;
          }

          .header-row p {
            margin:4px 0 0;
            color:rgba(255,255,255,.32);
            font-size:8px;
            line-height:1.4;
          }

          .add-button,
          .empty-button {
            display:inline-flex;
            align-items:center;
            justify-content:center;
            gap:4px;
            min-height:31px;
            padding:0 10px;
            border:1px solid rgba(249,115,22,.18);
            border-radius:8px;
            background:rgba(249,115,22,.065);
            color:#f97316;
            text-decoration:none;
            font:850 8px system-ui,sans-serif;
            cursor:pointer;
          }

          .add-button span {
            font-size:12px;
          }

          .summary {
            display:grid;
            grid-template-columns:repeat(3,1fr);
            gap:5px;
            margin-bottom:7px;
          }

          .summary > div {
            padding:8px 5px;
            border:1px solid rgba(255,255,255,.05);
            border-radius:9px;
            background:#101010;
            text-align:center;
          }

          .summary span {
            display:block;
            color:rgba(255,255,255,.24);
            font-size:6px;
            font-weight:800;
            text-transform:uppercase;
            letter-spacing:.4px;
          }

          .summary strong {
            display:block;
            margin-top:3px;
            color:#f97316;
            font-size:12px;
            line-height:1;
          }

          .summary strong.green {
            color:#22c55e;
          }

          .services-list {
            display:flex;
            flex-direction:column;
            gap:5px;
          }

          .service-card {
            overflow:hidden;
            border:1px solid rgba(255,255,255,.055);
            border-radius:10px;
            background:#101010;
          }

          .service-card.open {
            border-color:rgba(249,115,22,.17);
          }

          .service-head {
            width:100%;
            min-height:54px;
            display:flex;
            align-items:center;
            gap:8px;
            padding:7px 9px;
            border:0;
            background:transparent;
            color:#fff;
            text-align:left;
            cursor:pointer;
          }

          .service-icon {
            width:32px;
            height:32px;
            display:grid;
            place-items:center;
            flex:0 0 32px;
            overflow:hidden;
            border-radius:9px;
            background:rgba(249,115,22,.07);
            font-size:15px;
            line-height:1;
          }

          .service-copy {
            min-width:0;
            flex:1;
          }

          .service-copy strong {
            display:block;
            overflow:hidden;
            text-overflow:ellipsis;
            white-space:nowrap;
            color:#fff;
            font-size:9px;
            line-height:1.15;
            font-weight:850;
          }

          .service-copy small {
            display:block;
            margin-top:3px;
            overflow:hidden;
            text-overflow:ellipsis;
            white-space:nowrap;
            color:rgba(255,255,255,.28);
            font-size:6px;
            line-height:1.2;
          }

          .status {
            display:inline-flex;
            align-items:center;
            gap:3px;
            padding:4px 6px;
            border-radius:999px;
            background:rgba(239,68,68,.07);
            color:#ef4444;
            font-size:5.5px;
            font-weight:850;
            text-transform:uppercase;
          }

          .status.active {
            background:rgba(34,197,94,.07);
            color:#22c55e;
          }

          .status i {
            width:4px;
            height:4px;
            border-radius:50%;
            background:currentColor;
          }

          .chevron {
            width:23px;
            height:23px;
            display:grid;
            place-items:center;
            border-radius:7px;
            background:rgba(255,255,255,.035);
            color:rgba(255,255,255,.35);
            font-size:11px;
          }

          .service-card.open .chevron {
            color:#f97316;
            background:rgba(249,115,22,.07);
          }

          .service-body {
            padding:0 8px 8px;
            border-top:1px solid rgba(255,255,255,.045);
          }

          .service-description {
            padding:8px 2px;
            color:rgba(255,255,255,.35);
            font-size:7px;
            line-height:1.45;
          }

          .service-actions {
            display:grid;
            grid-template-columns:1fr 1fr 1fr;
            gap:4px;
          }

          .service-action {
            min-height:29px;
            border:1px solid rgba(255,255,255,.05);
            border-radius:6px;
            background:rgba(255,255,255,.025);
            color:rgba(255,255,255,.5);
            font:800 6.5px system-ui,sans-serif;
            text-decoration:none;
            cursor:pointer;
            display:grid;
            place-items:center;
          }

          .service-action.edit {
            color:#60a5fa;
            border-color:rgba(96,165,250,.12);
            background:rgba(96,165,250,.04);
          }

          .service-action.toggle {
            color:#22c55e;
            border-color:rgba(34,197,94,.12);
            background:rgba(34,197,94,.04);
          }

          .service-action.toggle.off {
            color:#f97316;
            border-color:rgba(249,115,22,.12);
            background:rgba(249,115,22,.04);
          }

          .service-action.delete {
            color:#ef4444;
            border-color:rgba(239,68,68,.1);
            background:rgba(239,68,68,.035);
          }

          .empty {
            min-height:220px;
            display:flex;
            flex-direction:column;
            align-items:center;
            justify-content:center;
            padding:20px;
            text-align:center;
            border:1px dashed rgba(249,115,22,.15);
            border-radius:10px;
            background:rgba(249,115,22,.02);
          }

          .empty-icon {
            width:38px;
            height:38px;
            display:grid;
            place-items:center;
            margin-bottom:8px;
            border-radius:10px;
            background:rgba(249,115,22,.08);
            color:#f97316;
            font-size:17px;
          }

          .empty strong {
            font-size:9px;
          }

          .empty small {
            max-width:230px;
            margin-top:4px;
            color:rgba(255,255,255,.24);
            font-size:7px;
            line-height:1.4;
          }

          .empty-button {
            margin-top:10px;
          }

          .loading-page {
            display:grid;
            place-items:center;
          }

          .loading-page > div {
            color:rgba(255,255,255,.3);
            font-size:9px;
          }

          @media(max-width:390px) {
            .restaurant-services-page {
              padding-left:8px;
              padding-right:8px;
            }

            .service-actions {
              grid-template-columns:1fr 1fr;
            }

            .service-action.delete {
              grid-column:1 / -1;
            }

            .status {
              display:none;
            }

            .service-head {
              min-height:52px;
              padding:6px 8px;
              gap:7px;
            }

            .service-icon {
              width:31px;
              height:31px;
              flex-basis:31px;
            }

            .service-copy strong {
              font-size:8.5px;
            }

            .service-copy small {
              font-size:5.8px;
            }

            .chevron {
              width:22px;
              height:22px;
              flex:0 0 22px;
            }
          }
        `}</style>
      </main>
    </PermissionGuard>
  );
}

function ServiceAccordion({
  service,
  index,
  restaurantId,
  onToggle,
  onDelete,
}: {
  service: any;
  index: number;
  restaurantId: string;
  onToggle: () => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <article className={open ? "service-card open" : "service-card"}>
      <button
        type="button"
        className="service-head"
        onClick={() => setOpen((value) => !value)}
      >
        <span className="service-icon" aria-hidden="true">{getServiceEmoji(service.icon)}</span>

        <span className="service-copy">
          <strong>{service.title || `Servicio ${index + 1}`}</strong>
          <small>{service.description || "Sin descripción"}</small>
        </span>

        <span className={service.active ? "status active" : "status"}>
          <i />
          {service.active ? "Activo" : "Oculto"}
        </span>

        <span className="chevron">{open ? "−" : "+"}</span>
      </button>

      {open && (
        <div className="service-body">
          <div className="service-description">
            {service.description || "Este servicio no tiene descripción."}
          </div>

          <div className="service-actions">
            <Link
              href={`/super-admin/restaurants/${restaurantId}/settings/serviciosrestaurant/${service.id}`}
              className="service-action edit"
            >
              Editar
            </Link>

            <button
              type="button"
              className={service.active ? "service-action toggle" : "service-action toggle off"}
              onClick={onToggle}
            >
              {service.active ? "Ocultar" : "Activar"}
            </button>

            <button
              type="button"
              className="service-action delete"
              onClick={onDelete}
            >
              Eliminar
            </button>
          </div>
        </div>
      )}
    </article>
  );
  }