 "use client";

import {
  ArrowUpRight,
  AtSign,
  Mail,
  MapPin,
  Music2,
  Phone,
} from "lucide-react";
import { getTheme } from "@/lib/theme/getTheme";

interface Props {
  restaurant: any;
}

function firstValue(...values: unknown[]) {
  return values.find(
    (value) => typeof value === "string" && value.trim()
  ) as string | undefined;
}

function socialValue(restaurant: any, ...keys: string[]) {
  for (const key of keys) {
    const value = restaurant?.[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return undefined;
}

function socialHref(value?: string) {
  if (!value) return undefined;
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith("@")) {
    return `https://www.instagram.com/${value.slice(1)}`;
  }
  return `https://${value}`;
}

export default function Footer({ restaurant }: Props) {
  const theme = getTheme(restaurant);

  const address = firstValue(
    restaurant?.address,
    restaurant?.restaurant_address,
    restaurant?.location,
    restaurant?.contact_address
  );

  const email = firstValue(
    restaurant?.email,
    restaurant?.contact_email,
    restaurant?.restaurant_email
  );

  const phone = firstValue(
    restaurant?.phone,
    restaurant?.phone_number,
    restaurant?.contact_phone
  );

  const description = firstValue(
    restaurant?.footer_description,
    restaurant?.short_description,
    restaurant?.description,
    restaurant?.hero_subtitle
  );

  const instagram = socialHref(
    socialValue(
      restaurant,
      "instagram_url",
      "instagram",
      "instagram_link",
      "social_instagram"
    )
  );

  const facebook = socialHref(
    socialValue(
      restaurant,
      "facebook_url",
      "facebook",
      "facebook_link",
      "social_facebook"
    )
  );

  const tiktok = socialHref(
    socialValue(
      restaurant,
      "tiktok_url",
      "tiktok",
      "tiktok_link",
      "social_tiktok"
    )
  );

  const socials = [
    instagram
      ? {
          key: "instagram",
          label: "Instagram",
          href: instagram,
          icon: <AtSign size={20} strokeWidth={1.8} />,
        }
      : null,
    facebook
      ? {
          key: "facebook",
          label: "Facebook",
          href: facebook,
          icon: (
            <span
              aria-hidden="true"
              style={{
                fontSize: 21,
                lineHeight: 1,
                fontWeight: 850,
                fontFamily: "Arial, sans-serif",
              }}
            >
              f
            </span>
          ),
        }
      : null,
    tiktok
      ? {
          key: "tiktok",
          label: "TikTok",
          href: tiktok,
          icon: <Music2 size={20} strokeWidth={1.8} />,
        }
      : null,
  ].filter(Boolean) as Array<{
    key: string;
    label: string;
    href: string;
    icon: React.ReactNode;
  }>;

  return (
    <footer
      className="wolf-footer"
      style={
        {
          "--footer-bg": theme.background,
          "--footer-text": theme.text,
          "--footer-primary": theme.primary,
          "--footer-secondary": theme.secondary,
          "--footer-radius": `${theme.radius}px`,
        } as React.CSSProperties
      }
    >
      <div className="wolf-footer__ambient" aria-hidden="true" />

      <div className="wolf-footer__inner">
        <div className="wolf-footer__topline" />

        <div className="wolf-footer__grid">
          <div className="wolf-footer__identity">
            <a
              className="wolf-footer__brand"
              href="#top"
              aria-label={restaurant.name}
            >
              {restaurant.logo_url ? (
                <span className="wolf-footer__logo">
                  <img
                    src={restaurant.logo_url}
                    alt=""
                    className="wolf-footer__logo-image"
                  />
                </span>
              ) : (
                <span className="wolf-footer__logo wolf-footer__logo--letter">
                  {String(restaurant.name ?? "R").charAt(0)}
                </span>
              )}

              <span className="wolf-footer__brand-copy">
                <strong>{restaurant.name}</strong>
                <small>Experiencia digital</small>
              </span>
            </a>

            {description && (
              <p className="wolf-footer__description">{description}</p>
            )}
          </div>

          <div className="wolf-footer__contact">
            <span className="wolf-footer__eyebrow">Contacto</span>

            <div className="wolf-footer__contact-list">
              {address && (
                <div className="wolf-footer__contact-item">
                  <span className="wolf-footer__contact-icon">
                    <MapPin size={15} strokeWidth={1.7} />
                  </span>
                  <span>{address}</span>
                </div>
              )}

              {email && (
                <a
                  className="wolf-footer__contact-item wolf-footer__contact-item--link"
                  href={`mailto:${email}`}
                >
                  <span className="wolf-footer__contact-icon">
                    <Mail size={15} strokeWidth={1.7} />
                  </span>
                  <span>{email}</span>
                </a>
              )}

              {phone && (
                <a
                  className="wolf-footer__contact-item wolf-footer__contact-item--link"
                  href={`tel:${phone.replace(/\s+/g, "")}`}
                >
                  <span className="wolf-footer__contact-icon">
                    <Phone size={15} strokeWidth={1.7} />
                  </span>
                  <span>{phone}</span>
                </a>
              )}
            </div>
          </div>

          <div className="wolf-footer__socials">
            <div className="wolf-footer__social-head">
              <span className="wolf-footer__eyebrow">Síguenos</span>
              <span className="wolf-footer__social-caption">
                Mantente cerca
              </span>
            </div>

            {socials.length > 0 ? (
              <div className="wolf-footer__social-list">
                {socials.map((social, index) => (
                  <a
                    key={social.key}
                    className="wolf-footer__social"
                    href={social.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={social.label}
                    title={social.label}
                    style={
                      {
                        "--social-delay": `${index * 120}ms`,
                      } as React.CSSProperties
                    }
                  >
                    <span className="wolf-footer__social-orbit" aria-hidden="true" />
                    <span className="wolf-footer__social-core">
                      {social.icon}
                    </span>
                    <span className="wolf-footer__social-arrow" aria-hidden="true">
                      <ArrowUpRight size={11} strokeWidth={1.8} />
                    </span>
                    <span className="wolf-footer__social-sheen" aria-hidden="true" />
                  </a>
                ))}
              </div>
            ) : (
              <span className="wolf-footer__social-empty">
                Redes sociales disponibles próximamente
              </span>
            )}
          </div>
        </div>

        <div className="wolf-footer__bottomline">
          <span>
            © {new Date().getFullYear()} {restaurant.name}
          </span>
          <span className="wolf-footer__signature">
            <i aria-hidden="true" />
            Hecho para pedir mejor
          </span>
        </div>
      </div>

      <style jsx>{`
        .wolf-footer {
          position: relative;
          width: 100%;
          overflow: hidden;
          box-sizing: border-box;
          padding: clamp(46px, 7vw, 76px) 18px 20px;
          background:
            radial-gradient(
              circle at 86% 18%,
              color-mix(in srgb, var(--footer-primary) 7%, transparent),
              transparent 31%
            ),
            linear-gradient(
              180deg,
              color-mix(in srgb, var(--footer-bg) 98%, #000),
              var(--footer-bg)
            );
          color: var(--footer-text);
          isolation: isolate;
        }

        .wolf-footer__ambient {
          position: absolute;
          width: min(440px, 44vw);
          height: min(440px, 44vw);
          right: -180px;
          top: -240px;
          border-radius: 50%;
          background: var(--footer-primary);
          filter: blur(150px);
          opacity: 0.07;
          pointer-events: none;
          z-index: -1;
        }

        .wolf-footer__inner {
          width: min(1240px, 100%);
          margin: 0 auto;
        }

        .wolf-footer__topline {
          height: 1px;
          width: 100%;
          margin-bottom: clamp(34px, 5vw, 52px);
          background: linear-gradient(
            90deg,
            transparent,
            color-mix(in srgb, var(--footer-primary) 30%, transparent) 18%,
            rgba(255,255,255,.09) 50%,
            color-mix(in srgb, var(--footer-primary) 30%, transparent) 82%,
            transparent
          );
        }

        .wolf-footer__grid {
          display: grid;
          grid-template-columns: minmax(260px, 1.35fr) minmax(220px, .95fr) minmax(250px, 1fr);
          gap: clamp(28px, 5vw, 76px);
          align-items: start;
        }

        .wolf-footer__identity,
        .wolf-footer__contact,
        .wolf-footer__socials {
          min-width: 0;
        }

        .wolf-footer__brand {
          display: inline-flex;
          align-items: center;
          gap: 11px;
          color: var(--footer-text);
          text-decoration: none;
        }

        .wolf-footer__logo {
          width: 42px;
          height: 42px;
          flex: 0 0 auto;
          overflow: hidden;
          border: 1px solid color-mix(in srgb, var(--footer-primary) 45%, transparent);
          border-radius: 13px;
          background: rgba(255,255,255,.035);
          box-shadow: 0 0 0 4px color-mix(in srgb, var(--footer-primary) 5%, transparent);
        }

        .wolf-footer__logo-image {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
        }

        .wolf-footer__logo--letter {
          display: grid;
          place-items: center;
          color: var(--footer-primary);
          font-size: 14px;
          font-weight: 850;
        }

        .wolf-footer__brand-copy {
          display: grid;
          gap: 2px;
        }

        .wolf-footer__brand-copy strong {
          font-size: 15px;
          line-height: 1.05;
          font-weight: 800;
          letter-spacing: -.02em;
        }

        .wolf-footer__brand-copy small {
          color: rgba(255,255,255,.35);
          font-size: 8px;
          font-weight: 700;
          letter-spacing: .09em;
          text-transform: uppercase;
        }

        .wolf-footer__description {
          max-width: 390px;
          margin: 16px 0 0;
          color: rgba(255,255,255,.48);
          font-size: 11px;
          line-height: 1.65;
        }

        .wolf-footer__eyebrow {
          display: block;
          margin-bottom: 12px;
          color: var(--footer-primary);
          font-size: 8px;
          font-weight: 850;
          letter-spacing: .16em;
          text-transform: uppercase;
        }

        .wolf-footer__contact-list {
          display: grid;
          gap: 7px;
        }

        .wolf-footer__contact-item {
          display: flex;
          align-items: center;
          min-width: 0;
          gap: 9px;
          color: rgba(255,255,255,.55);
          font-size: 10px;
          line-height: 1.45;
        }

        .wolf-footer__contact-item span:last-child {
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .wolf-footer__contact-item--link {
          text-decoration: none;
          transition: color .2s ease, transform .2s ease;
        }

        .wolf-footer__contact-item--link:hover {
          color: var(--footer-text);
          transform: translateX(2px);
        }

        .wolf-footer__contact-icon {
          width: 28px;
          height: 28px;
          display: grid;
          place-items: center;
          flex: 0 0 auto;
          border: 1px solid rgba(255,255,255,.07);
          border-radius: 9px;
          color: rgba(255,255,255,.62);
          background: rgba(255,255,255,.025);
        }

        .wolf-footer__social-head {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 12px;
        }

        .wolf-footer__social-caption {
          color: rgba(255,255,255,.24);
          font-size: 8px;
        }

        .wolf-footer__social-list {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .wolf-footer__social {
          position: relative;
          width: 54px;
          height: 54px;
          display: grid;
          place-items: center;
          overflow: visible;
          color: var(--footer-primary);
          text-decoration: none;
          border-radius: 18px;
          isolation: isolate;
          transition:
            transform .24s ease,
            color .24s ease,
            filter .24s ease;
        }

        .wolf-footer__social:hover {
          transform: translateY(-4px) scale(1.025);
          color: var(--footer-text);
          filter:
            drop-shadow(
              0 9px 22px
                color-mix(in srgb, var(--footer-primary) 18%, transparent)
            );
        }

        .wolf-footer__social-core {
          position: relative;
          z-index: 3;
          width: 46px;
          height: 46px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255,255,255,.08);
          border-radius: 15px;
          background:
            radial-gradient(
              circle at 30% 25%,
              color-mix(in srgb, var(--footer-primary) 10%, transparent),
              transparent 52%
            ),
            rgba(255,255,255,.022);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,.035),
            0 8px 24px rgba(0,0,0,.10);
          transition:
            border-color .24s ease,
            background .24s ease,
            box-shadow .24s ease;
        }

        .wolf-footer__social:hover .wolf-footer__social-core {
          border-color: color-mix(in srgb, var(--footer-primary) 45%, transparent);
          background:
            radial-gradient(
              circle at 30% 25%,
              color-mix(in srgb, var(--footer-primary) 17%, transparent),
              transparent 55%
            ),
            rgba(255,255,255,.03);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,.05),
            0 0 0 1px color-mix(in srgb, var(--footer-primary) 10%, transparent),
            0 12px 30px color-mix(in srgb, var(--footer-primary) 13%, transparent);
        }

        .wolf-footer__social-orbit {
          position: absolute;
          inset: 0;
          border-radius: 19px;
          background: conic-gradient(
            from 0deg,
            transparent 0deg,
            transparent 215deg,
            var(--footer-primary) 260deg,
            transparent 292deg,
            transparent 360deg
          );
          opacity: .7;
          mask:
            linear-gradient(#000 0 0) content-box,
            linear-gradient(#000 0 0);
          -webkit-mask:
            linear-gradient(#000 0 0) content-box,
            linear-gradient(#000 0 0);
          mask-composite: exclude;
          -webkit-mask-composite: xor;
          padding: 1px;
          animation: wolf-footer-spin 6s linear infinite;
          animation-delay: var(--social-delay);
        }

        .wolf-footer__social-sheen {
          position: absolute;
          width: 60px;
          height: 10px;
          left: -7px;
          top: -1px;
          border-radius: 999px;
          background: linear-gradient(
            90deg,
            transparent,
            color-mix(in srgb, var(--footer-primary) 72%, transparent),
            transparent
          );
          filter: blur(6px);
          opacity: .38;
          transform: rotate(-34deg);
          animation: wolf-footer-sheen 3.8s ease-in-out infinite;
          animation-delay: calc(var(--social-delay) * -1);
          pointer-events: none;
        }

        .wolf-footer__social-arrow {
          position: absolute;
          z-index: 4;
          right: -1px;
          top: -1px;
          width: 17px;
          height: 17px;
          display: grid;
          place-items: center;
          border: 1px solid color-mix(in srgb, var(--footer-primary) 24%, transparent);
          border-radius: 6px;
          color: var(--footer-primary);
          background: color-mix(in srgb, var(--footer-bg) 88%, transparent);
          opacity: .82;
        }

        .wolf-footer__social-empty {
          display: inline-block;
          color: rgba(255,255,255,.26);
          font-size: 9px;
          line-height: 1.5;
        }

        .wolf-footer__bottomline {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-top: clamp(34px, 6vw, 62px);
          padding-top: 15px;
          border-top: 1px solid rgba(255,255,255,.055);
          color: rgba(255,255,255,.22);
          font-size: 8px;
        }

        .wolf-footer__signature {
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .wolf-footer__signature i {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--footer-primary);
          box-shadow: 0 0 12px var(--footer-primary);
        }

        @keyframes wolf-footer-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes wolf-footer-sheen {
          0%, 32% {
            transform: translateX(-22px) rotate(-34deg);
            opacity: 0;
          }
          46% { opacity: .55; }
          58% {
            transform: translateX(32px) rotate(-34deg);
            opacity: 0;
          }
          100% {
            transform: translateX(32px) rotate(-34deg);
            opacity: 0;
          }
        }

        @media (max-width: 860px) {
          .wolf-footer__grid {
            grid-template-columns: 1fr 1fr;
          }

          .wolf-footer__identity {
            grid-column: 1 / -1;
          }
        }

        @media (max-width: 580px) {
          .wolf-footer {
            padding-inline: 14px;
          }

          .wolf-footer__grid {
            grid-template-columns: 1fr;
            gap: 25px;
          }

          .wolf-footer__bottomline {
            align-items: flex-start;
            flex-direction: column;
            gap: 8px;
          }

          .wolf-footer__social {
            width: 52px;
            height: 52px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .wolf-footer__social-orbit,
          .wolf-footer__social-sheen {
            animation: none !important;
          }

          .wolf-footer__social,
          .wolf-footer__contact-item--link {
            transition: none !important;
          }
        }
      `}</style>
    </footer>
  );
}
