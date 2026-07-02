"use client";

import { Truck, Store, Utensils, Calendar, CreditCard, Wallet, MessageCircle, Star, Hamburger, Pizza, Flame, Drumstick, Salad, ChefHat, Fish, Martini, Beer, Wine, Music, Headphones, Trophy, Sparkles, PartyPopper, Cake, Building2, Users, Mic2, Gift, Coffee, IceCreamCone, Croissant } from "lucide-react";

interface Props {
  restaurant: any;
}

export default function Services({ restaurant }: Props) {
  const ICONS: any = { truck: Truck, pickup: Store, dinein: Utensils, scheduled: Calendar, card: CreditCard, cash: Wallet, whatsapp: MessageCircle, loyalty: Star, burger: Hamburger, pizza: Pizza, taco: Flame, chicken: Drumstick, grill: Flame, healthy: Salad, pasta: ChefHat, sushi: Fish, cocktail: Martini, beer: Beer, wine: Wine, music: Music, dj: Headphones, sports: Trophy, night: Sparkles, events: PartyPopper, birthday: Cake, corporate: Building2, groups: Users, karaoke: Mic2, promo: Gift, coffee: Coffee, dessert: Cake, cake: Cake, icecream: IceCreamCone, bakery: Croissant };

  if (restaurant.show_services === false) return null;
  const services = restaurant.services?.filter((s: any) => s.active) || [];
  if (!services.length) return null;

  return (
    <section style={{ maxWidth: "1000px", margin: "0 auto", padding: "40px 20px" }}>
      <div style={{ 
        display: "grid", 
        // 240px permite que en móviles entren incluso dos por fila si el dispositivo es lo suficientemente ancho
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", 
        gap: "30px" 
      }}>
        {services.map((service: any) => {
          const Icon = ICONS[service.icon] || Star;
          return (
            <div key={service.id} style={{ 
              textAlign: "center",
              padding: "10px" 
            }}>
              <div style={{
                // Tamaño reducido: de 80px a 60px
                width: "60px", height: "60px", margin: "0 auto 15px",
                borderRadius: "50%",
                border: `2px solid ${restaurant.primary_color || '#f97316'}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: restaurant.primary_color || '#f97316',
                boxShadow: `0 0 15px ${restaurant.primary_color || '#f97316'}33`
              }}>
                <Icon size={28} />
              </div>

              <h3 style={{ 
                color: "#fff", 
                fontSize: "clamp(1rem, 3vw, 1.25rem)", 
                fontWeight: "700", 
                marginBottom: "8px" 
              }}>
                {service.title}
              </h3>
              
              <p style={{ 
                color: "rgba(255,255,255,.6)", 
                fontSize: "clamp(0.8rem, 2vw, 0.9rem)", 
                maxWidth: "250px", 
                margin: "0 auto", 
                lineHeight: 1.5 
              }}>
                {service.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}