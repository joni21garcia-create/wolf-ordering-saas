"use client";

import {
  Award,
  Beer,
  Building2,
  Cake,
  Calendar,
  ChefHat,
  Coffee,
  CreditCard,
  Croissant,
  Drumstick,
  Fish,
  Flame,
  Gift,
  Headphones,
  IceCreamCone,
  Leaf,
  MapPinned,
  MessageCircle,
  Mic2,
  Music,
  PartyPopper,
  Phone,
  Pizza,
  QrCode,
  Salad,
  Sparkles,
  Star,
  Store,
  Trophy,
  Truck,
  Utensils,
  Users,
  Wallet,
  Wine,
} from "lucide-react";
import { getTheme } from "@/lib/theme/getTheme";

interface Props {
  restaurant: any;
}

const ICONS = {
  truck: Truck,
  pickup: Store,
  dinein: Utensils,
  scheduled: Calendar,
  card: CreditCard,
  cash: Wallet,
  whatsapp: MessageCircle,
  loyalty: Star,
  burger: ChefHat,
  pizza: Pizza,
  taco: Flame,
  chicken: Drumstick,
  grill: Flame,
  healthy: Salad,
  pasta: ChefHat,
  sushi: Fish,
  cocktail: Music,
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
  map: MapPinned,
  phone: Phone,
  qr: QrCode,
  award: Award,
  leaf: Leaf,
} as const;

function withAlpha(hex: string, alpha: string) {
  const value = hex.trim();

  if (!/^#[0-9a-fA-F]{6}$/.test(value)) {
    return `color-mix(in srgb, ${value} ${alpha}, transparent)`;
  }

  return `${value}${alpha}`;
}

export default function Services({ restaurant }: Props) {
  if (restaurant.show_services === false) return null;

  const services =
    restaurant.services?.filter((service: any) => service.active) ?? [];

  if (!services.length) return null;

  const theme = getTheme(restaurant);
  const accent = theme.primary || restaurant.primary_color || "#f97316";

  return (
    <section
      id="services"
      className="wolf-services"
      style={
        {
          "--wolf-service-accent": accent,
          "--wolf-service-accent-soft": withAlpha(accent, "16"),
          "--wolf-service-accent-mid": withAlpha(accent, "42"),
        } as React.CSSProperties
      }
      aria-label="Servicios del restaurante"
    >
      <div className="wolf-services__heading">
        <span className="wolf-services__eyebrow">
          <i aria-hidden="true" />
          Experiencia
        </span>
        <h2>Todo pensado para ti.</h2>
        <p>Detalles simples que hacen que pedir sea más fácil.</p>
      </div>

      <div className="wolf-services__grid">
        {services.map((service: any, index: number) => {
          const Icon =
            ICONS[service.icon as keyof typeof ICONS] ?? Sparkles;

          return (
            <article
              key={service.id ?? `${service.title}-${index}`}
              className="wolf-service"
              style={{ "--service-index": index } as React.CSSProperties}
            >
              <div className="wolf-service__top">
                <span className="wolf-service__icon-wrap">
                  <span className="wolf-service__icon-orbit" aria-hidden="true" />
                  <span className="wolf-service__icon-halo" aria-hidden="true" />
                  <span className="wolf-service__icon">
                    <Icon size={24} strokeWidth={1.65} />
                  </span>
                  <span className="wolf-service__spark" aria-hidden="true" />
                </span>
              </div>

              <div className="wolf-service__content">
                <h3>{service.title}</h3>
                {service.description && <p>{service.description}</p>}
                <span className="wolf-service__line" aria-hidden="true" />
              </div>
            </article>
          );
        })}
      </div>

      <style jsx>{`
        .wolf-services {
          position: relative;
          isolation: isolate;
          width: 100%;
          box-sizing: border-box;
          padding: clamp(54px, 7vw, 86px) clamp(16px, 5vw, 56px) clamp(50px, 7vw, 82px);
          overflow: hidden;
          background:
            radial-gradient(circle at 50% 0%, var(--wolf-service-accent-soft), transparent 33%),
            transparent;
        }
        .wolf-services::before {
          content: "";
          position: absolute;
          left: 8%;
          right: 8%;
          top: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--wolf-service-accent) 28%, transparent), transparent);
          opacity: .55;
        }
        .wolf-services__heading {
          position: relative;
          z-index: 1;
          max-width: 980px;
          margin: 0 auto clamp(34px, 5vw, 56px);
          text-align: center;
        }
        .wolf-services__eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          margin-bottom: 13px;
          color: rgba(255,255,255,.42);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: .17em;
          text-transform: uppercase;
        }
        .wolf-services__eyebrow i {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--wolf-service-accent);
          box-shadow: 0 0 8px color-mix(in srgb, var(--wolf-service-accent) 70%, transparent), 0 0 22px color-mix(in srgb, var(--wolf-service-accent) 25%, transparent);
          animation: wolfServicePulse 2.7s ease-in-out infinite;
        }
        .wolf-services__heading h2 {
          margin: 0;
          color: rgba(255,255,255,.96);
          font-size: clamp(35px, 4.4vw, 57px);
          line-height: 1.03;
          letter-spacing: -.045em;
          font-weight: 850;
        }
        .wolf-services__heading p {
          margin: 14px auto 0;
          color: rgba(255,255,255,.42);
          font-size: clamp(13px, 1.3vw, 16px);
          line-height: 1.6;
        }
        .wolf-services__grid {
          position: relative;
          z-index: 1;
          width: min(1470px, 100%);
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          border-top: 1px solid rgba(255,255,255,.085);
          border-bottom: 1px solid rgba(255,255,255,.085);
        }
        .wolf-service {
          position: relative;
          min-width: 0;
          min-height: 238px;
          padding: 34px 32px 31px;
          border-right: 1px solid rgba(255,255,255,.07);
          background: linear-gradient(145deg, color-mix(in srgb, var(--wolf-service-accent) 0%, transparent), transparent 45%);
          transition: background .35s ease, transform .35s ease;
        }
        .wolf-service:last-child { border-right: 0; }
        .wolf-service::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--wolf-service-accent), transparent);
          opacity: .9;
          transition: width .45s ease;
        }
        .wolf-service:hover::before { width: 100%; }
        .wolf-service:hover {
          background: radial-gradient(circle at 50% 18%, var(--wolf-service-accent-soft), transparent 43%), rgba(255,255,255,.012);
          transform: translateY(-2px);
        }
        .wolf-service__top {
          display: flex;
          justify-content: flex-end;
          min-height: 58px;
        }
        .wolf-service__icon-wrap {
          position: relative;
          width: 54px;
          height: 54px;
          display: grid;
          place-items: center;
        }
        .wolf-service__icon {
          position: relative;
          z-index: 3;
          width: 48px;
          height: 48px;
          display: grid;
          place-items: center;
          border: 1px solid var(--wolf-service-accent-mid);
          border-radius: 15px;
          color: var(--wolf-service-accent);
          background: linear-gradient(145deg, color-mix(in srgb, var(--wolf-service-accent) 9%, transparent), rgba(255,255,255,.018));
          box-shadow: inset 0 1px 0 rgba(255,255,255,.05), 0 7px 22px rgba(0,0,0,.13);
          transition: color .3s ease, border-color .3s ease, box-shadow .3s ease, transform .3s ease;
        }
        .wolf-service:hover .wolf-service__icon {
          color: #fff;
          border-color: var(--wolf-service-accent);
          box-shadow: inset 0 1px 0 rgba(255,255,255,.08), 0 0 0 5px color-mix(in srgb, var(--wolf-service-accent) 5%, transparent), 0 0 30px color-mix(in srgb, var(--wolf-service-accent) 24%, transparent);
          transform: translateY(-2px) rotate(-2deg);
        }
        .wolf-service__icon-orbit {
          position: absolute;
          inset: -2px;
          z-index: 2;
          border-radius: 17px;
          background: conic-gradient(from 0deg, transparent 0deg, transparent 235deg, var(--wolf-service-accent) 278deg, transparent 313deg, transparent 360deg);
          opacity: .68;
          padding: 1px;
          mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          mask-composite: exclude;
          -webkit-mask-composite: xor;
          animation: wolfServiceSpin 7s linear infinite;
          animation-delay: calc(var(--service-index) * -0.8s);
        }
        .wolf-service__icon-halo {
          position: absolute;
          z-index: 1;
          inset: 1px;
          border-radius: 20px;
          background: var(--wolf-service-accent);
          filter: blur(22px);
          opacity: 0;
          transition: opacity .3s ease;
        }
        .wolf-service:hover .wolf-service__icon-halo { opacity: .14; }
        .wolf-service__spark {
          position: absolute;
          z-index: 4;
          width: 5px;
          height: 5px;
          right: 0;
          top: 3px;
          border-radius: 50%;
          background: var(--wolf-service-accent);
          box-shadow: 0 0 12px var(--wolf-service-accent);
          opacity: .85;
          animation: wolfServiceSpark 2.8s ease-in-out infinite;
          animation-delay: calc(var(--service-index) * -.45s);
        }
        .wolf-service__content { margin-top: 22px; }
        .wolf-service__content h3 {
          margin: 0;
          color: rgba(255,255,255,.93);
          font-size: clamp(17px, 1.45vw, 21px);
          line-height: 1.2;
          letter-spacing: -.025em;
          font-weight: 790;
        }
        .wolf-service__content p {
          max-width: 290px;
          margin: 11px 0 0;
          color: rgba(255,255,255,.43);
          font-size: 12px;
          line-height: 1.65;
        }
        .wolf-service__line {
          display: block;
          width: 38px;
          height: 1px;
          margin-top: 23px;
          background: var(--wolf-service-accent);
          opacity: .8;
          transition: width .3s ease, box-shadow .3s ease;
        }
        .wolf-service:hover .wolf-service__line {
          width: 72px;
          box-shadow: 0 0 14px color-mix(in srgb, var(--wolf-service-accent) 48%, transparent);
        }
        @keyframes wolfServiceSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes wolfServicePulse { 0%,100% { opacity:.45; transform:scale(.8); } 50% { opacity:1; transform:scale(1); } }
        @keyframes wolfServiceSpark { 0%,100% { transform:translateY(0); opacity:.4; } 50% { transform:translateY(-4px); opacity:1; } }
        @media (max-width: 900px) {
          .wolf-services__grid { grid-template-columns: repeat(2, minmax(0,1fr)); }
          .wolf-service:nth-child(2) { border-right: 0; }
          .wolf-service:nth-child(-n + 2) { border-bottom: 1px solid rgba(255,255,255,.07); }
        }
        @media (max-width: 560px) {
          .wolf-services { padding-inline: 14px; }
          .wolf-services__grid { grid-template-columns: 1fr; }
          .wolf-service, .wolf-service:nth-child(2) {
            min-height: unset;
            padding: 25px 20px 23px;
            border-right: 0;
            border-bottom: 1px solid rgba(255,255,255,.07);
          }
          .wolf-service:last-child { border-bottom: 0; }
          .wolf-service__top { min-height: 50px; }
          .wolf-service__content { margin-top: 18px; }
          .wolf-service__content p { max-width: 100%; }
        }
        @media (prefers-reduced-motion: reduce) {
          .wolf-services *, .wolf-services *::before, .wolf-services *::after {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
}
