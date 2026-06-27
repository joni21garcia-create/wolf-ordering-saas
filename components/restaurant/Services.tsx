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

const theme =
  getTheme(restaurant);


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
        margin: "-20px auto 80px",
        padding: "0 20px",
        position: "relative",
        zIndex: 10,
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${services.length},1fr)`,
          gap: "20px",
        }}
      >
        {services.map(
          (
            service: any,
            index: number
          ) => (
            <div
              key={service.id}
              style={{
                textAlign: "center",
                position: "relative",
              }}
            >
              {index <
                services.length - 1 && (
                <div
                  style={{
                    position: "absolute",
                    right: "-10px",
                    top: "50%",
                    transform:
                      "translateY(-50%)",
                    width: "1px",
                    height: "120px",
                    background:
                      "rgba(255,255,255,.15)",
                  }}
                />
              )}

              {(() => {
  const Icon =
    ICONS[service.icon] || Icons.Star;

  return (
    <div
      className={styles.serviceIcon}
      style={{
        width: "90px",
        height: "90px",
        margin: "0 auto 20px",
        borderRadius: "50%",
        border:
  `2px solid ${theme.primary}55`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color:
theme.primary,
       boxShadow:
  `0 0 30px ${theme.primary}55`,
      }}
    >
      <Icon size={42} />
    </div>
  );
})()}
              <h3
                style={{
                  color: "#fff",
                  fontSize: "24px",
                  fontWeight: "700",
                  marginBottom: "10px",
                }}
              >
                {service.title}
              </h3>

              <p
                style={{
                  color:
                    "rgba(255,255,255,.7)",
                  fontSize: "15px",
                  maxWidth: "220px",
                  margin: "0 auto",
                }}
              >
                {service.description}
              </p>

              <div
                style={{
                  width: "70px",
                  height: "3px",
                  background:
  theme.primary,
                  margin:
                    "25px auto 0 auto",
                  borderRadius: "999px",
                }}
              />
            </div>
          )
        )}
      </div>
    </section>
  );
}