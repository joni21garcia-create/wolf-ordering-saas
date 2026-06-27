"use client";

import styles from "./Services.module.css";
import {
  Bike,
  Store,
  Utensils,
  Hamburger,
  Pizza,
  Package,
  CreditCard,
  Wallet,
  MessageCircle,
  Star,
  TicketPercent,
  Clock,
  Calendar1,
  ChefHat,
  Drumstick,
  Martini,
  Fish,
  Wine,
  Beer,
  Coffee,
  Music,
  Headphones,
  Mic2,
  Trophy,
  Gamepad2,
  PartyPopper,
  Cake,
  HeartHandshake,
  Building2,
  Users,
  Gift,
  Calendar,
  Sparkles,
  Flame,
  Award,
  Salad,
  Gem,
  Leaf,
  MapPinned,
  Bell,
  Smartphone,
  QrCode,
  Images,
  Phone,
  MessagesSquare,
  Truck,
  IceCreamCone,
  Croissant,
} from "lucide-react";

interface Props {
  restaurant: any;
}

export default function Services({
  restaurant,
}: Props) {

const ICONS = {
  truck: Truck,
  pickup: Store,
  dinein: Utensils,
  scheduled: Calendar,

  card: CreditCard,
  cash: Wallet,

  whatsapp: MessageCircle,
  loyalty: Star,

  burger: Hamburger,
  pizza: Pizza,
  taco: Flame,
  chicken: Drumstick,
  grill: Flame,
  healthy: Salad,
  pasta: ChefHat,
  sushi: Fish,

  cocktail: Martini,
  beer: Beer,
  wine: Wine,

  music: Music,
  dj: Headphones,
  sports: Trophy,
  night: Sparkles,

  events: PartyPopper,
  birthday: Cake,
  corporate: Building2,
  groups: Users,
  karaoke: Mic2,
  promo: Gift,

  coffee: Coffee,
  dessert: Cake,
  cake: Cake,
  icecream: IceCreamCone,
  bakery: Croissant,
};

  if (
    restaurant.show_services ===
    false
  ) {
    return null;
  }

  const services =
    restaurant.services?.filter(
      (service: any) =>
        service.active
    ) || [];

  if (!services.length) {
    return null;
  }

  return (
    <section
      style={{
        maxWidth: "1200px",
        margin:
          "-20px auto 80px",
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
                textAlign:
                  "center",
                position:
                  "relative",
              }}
            >
              {index <
                services.length -
                  1 && (
                <div
                  style={{
                    position:
                      "absolute",
                    right:
                      "-10px",
                    top: "50%",
                    transform:
                      "translateY(-50%)",
                    width: "1px",
                    height:
                      "120px",
                    background:
                      "rgba(255,255,255,.15)",
                  }}
                />
              )}
{
  (() => {
    const Icon =
      ICONS[
        service.icon as keyof typeof ICONS
      ] || Star;

    return (
      <div
        className={
          styles.serviceIcon
        }
        style={{
          width: "90px",
          height: "90px",
          margin:
            "0 auto 20px",
          borderRadius:
            "50%",
          border:
            "2px solid rgba(249,115,22,.5)",
          display:
            "flex",
          alignItems:
            "center",
          justifyContent:
            "center",
          color:
            restaurant.primary_color,
          boxShadow:
            "0 0 30px rgba(249,115,22,.35)",
        }}
      >
        <Icon size={42} />
      </div>
    );
  })()
}

              <h3
                style={{
                  color:
                    "#fff",
                  fontSize:
                    "24px",
                  fontWeight:
                    "700",
                  marginBottom:
                    "10px",
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
    lineHeight: 1.7,
  }}
>
  {service.description}
</p>

<div
  style={{
    width: "70px",
    height: "3px",
    background:
      restaurant.primary_color,
    margin:
      "25px auto 0 auto",
    borderRadius: "999px",
    boxShadow: `0 0 20px ${restaurant.primary_color}`,
  }}
/>
            </div>
          )
        )}
      </div>
    </section>
  );
}