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
        margin: "-20px auto 40px", // Reducido el margen inferior de la sección
        padding: "0 16px",
        position: "relative",
        zIndex: 10,
        boxSizing: "border-box",
        width: "100%",
      }}
    >
      <div
        style={{
          display: "grid",
          // Reducido el tamaño mínimo de 200px a 160px para juntarlos en la misma fila
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 160px), 1fr))",
          // Gap reducido de 24px 16px a 12px 8px para máxima proximidad
          gap: "12px 8px",
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
                  padding: "8px", // Reducido el padding de la tarjeta de 12px a 8px
                }}
              >
                {/* Contenedor del Icono */}
                <div
                  className={styles.serviceIcon}
                  style={{
                    width: "60px", // Sutil ajuste de 64px a 60px para mayor compresión
                    height: "60px",
                    margin: "0 auto 8px", // Reducido el margen inferior de 14px a 8px
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
                  <Icon size={24} />
                </div>

                {/* Título */}
                <h3
                  style={{
                    color: "var(--text-color)",
                    fontSize: "16px", // Sutil ajuste de 17px a 16px
                    fontWeight: "700",
                    marginBottom: "4px", // Reducido de 6px a 4px
                    marginTop: 0,
                    lineHeight: 1.2,
                  }}
                >
                  {service.title}
                </h3>

                {/* Descripción */}
                <p
                  style={{
                    color: "rgba(255,255,255,.65)",
                    fontSize: "12.5px", // Sutil ajuste de 13px a 12.5px
                    maxWidth: "160px", // Estrechado un poco para acompañar la compresión
                    margin: "0 auto",
                    lineHeight: 1.3,
                  }}
                >
                  {service.description}
                </p>

                {/* Pequeña línea decorativa inferior */}
                <div
                  style={{
                    width: "25px", // Reducido de 35px a 25px
                    height: "2px",
                    background: theme.primary,
                    margin: "8px auto 0 auto", // Reducido el margen superior de 14px a 8px
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