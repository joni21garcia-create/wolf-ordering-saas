import styles from "./Services.module.css";
import * as Icons from "lucide-react";
import { getTheme } from "@/lib/theme/getTheme";

const ICONS: Record<string, any> = {
  truck: Icons.Truck,
  pickup: Icons.Store,
  dinein: Icons.Utensils,
  scheduled: Icons.Calendar,

  card: Icons.CreditCard,
  cash: Icons.Wallet,

  whatsapp: Icons.MessageCircle,
  loyalty: Icons.Star,

  burger: Icons.Hamburger,
  pizza: Icons.Pizza,
  taco: Icons.Flame,
  chicken: Icons.Drumstick,
  grill: Icons.Flame,
  healthy: Icons.Salad,
  pasta: Icons.ChefHat,
  sushi: Icons.Fish,

  cocktail: Icons.Martini,
  beer: Icons.Beer,
  wine: Icons.Wine,

  music: Icons.Music,
  dj: Icons.Headphones,
  sports: Icons.Trophy,
  night: Icons.Sparkles,

  events: Icons.PartyPopper,
  birthday: Icons.Cake,
  corporate: Icons.Building2,
  groups: Icons.Users,
  karaoke: Icons.Mic2,
  promo: Icons.Gift,

  coffee: Icons.Coffee,
  dessert: Icons.Cake,
  cake: Icons.Cake,
  icecream: Icons.IceCreamCone,
  bakery: Icons.Croissant,
};

interface Props {
  restaurant: any;
}

export default function Services({
  restaurant,
}: Props) {

  const theme = getTheme(restaurant);

  const services =
    restaurant.services?.filter(
      (service: any) => service.active
    ) || [];

  if (!services.length) {
    return null;
  }

  return (
    <section
      style={{
        maxWidth: "1200px",
        margin: "-20px auto 60px",
        padding: "0 20px",
        position: "relative",
        zIndex: 10,
        boxSizing: "border-box",
        width: "100%",
      }}
    >
      <div
        style={{
          display: "grid",
          // auto-fit y minmax hacen que se ajusten solos y bajen de fila dinámicamente
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 200px), 1fr))",
          gap: "24px 16px",
          justifyContent: "center",
          width: "100%",
        }}
      >
        {services.map(
          (
            service: any,
            index: number
          ) => {
            const Icon = ICONS[service.icon] || Icons.Star;

            return (
              <div
                key={service.id}
                style={{
                  textAlign: "center",
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  boxSizing: "border-box",
                  padding: "12px",
                }}
              >
                {/* Contenedor del Icono (Reducido de 90px a 64px) */}
                <div
                  className={styles.serviceIcon}
                  style={{
                    width: "64px",
                    height: "64px",
                    margin: "0 auto 14px",
                    borderRadius: "50%",
                    border: `2px solid ${theme.primary}40`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: theme.primary,
                    boxShadow: `0 0 20px ${theme.primary}30`,
                    background: "rgba(0,0,0,0.2)",
                    flexShrink: 0,
                  }}
                >
                  <Icon size={26} />
                </div>

                {/* Título (Reducido de 24px a 17px) */}
                <h3
                  style={{
                    color: "var(--text-color)",
                    fontSize: "17px",
                    fontWeight: "700",
                    marginBottom: "6px",
                    marginTop: 0,
                    lineHeight: 1.3,
                  }}
                >
                  {service.title}
                </h3>

                {/* Descripción (Reducido de 15px a 13px) */}
                <p
                  style={{
                    color: "rgba(255,255,255,.65)",
                    fontSize: "13px",
                    maxWidth: "180px",
                    margin: "0 auto",
                    lineHeight: 1.4,
                  }}
                >
                  {service.description}
                </p>

                {/* Pequeña línea decorativa inferior */}
                <div
                  style={{
                    width: "35px",
                    height: "2px",
                    background: theme.primary,
                    margin: "14px auto 0 auto",
                    borderRadius: "999px",
                    opacity: 0.8,
                  }}
                />
              </div>
            );
          }
        )}
      </div>
    </section>
  );
}