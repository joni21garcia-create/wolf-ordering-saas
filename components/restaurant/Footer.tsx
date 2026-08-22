"use client";

import {
  Phone,
  MapPin,
  Mail,
} from "lucide-react";

import {
  FaInstagram,
  FaFacebookF,
  FaTiktok,
} from "react-icons/fa";

import { getTheme } from "@/lib/theme/getTheme";

interface Props {
  restaurant: any;
}

export default function Footer({
  restaurant,
}: Props) {
  const theme = getTheme(restaurant);

  /*
   * ============================================================
   * CONFIGURACIONES DE VISIBILIDAD
   * ============================================================
   */

  const showWhatsapp =
    restaurant.show_whatsapp === true ||
    restaurant.show_whatsapp === 1 ||
    restaurant.show_whatsapp === "true" ||
    restaurant.show_whatsapp === "1";

  const showContact =
    restaurant.show_contact === true ||
    restaurant.show_contact === 1 ||
    restaurant.show_contact === "true" ||
    restaurant.show_contact === "1";

  const showContactEmail =
    restaurant.show_contact_email === true ||
    restaurant.show_contact_email === 1 ||
    restaurant.show_contact_email === "true" ||
    restaurant.show_contact_email === "1";

  const showSocials =
    restaurant.show_socials === true ||
    restaurant.show_socials === 1 ||
    restaurant.show_socials === "true" ||
    restaurant.show_socials === "1";

  /*
   * ============================================================
   * DATOS DISPONIBLES
   * ============================================================
   */

  const hasWhatsapp =
    showWhatsapp &&
    !!restaurant.whatsapp_url;

  const hasAddress =
    showContact &&
    !!restaurant.address;

  const hasEmail =
    showContactEmail &&
    !!restaurant.contact_email;

  /*
   * ============================================================
   * CONTACTO
   *
   * El título "Contacto" aparece si existe AL MENOS
   * un dato de contacto visible.
   *
   * WhatsApp:
   *   show_whatsapp + whatsapp_url
   *
   * Dirección:
   *   show_contact + address
   *
   * Correo:
   *   show_contact_email + contact_email
   * ============================================================
   */

  const hasContactSection =
    hasWhatsapp ||
    hasAddress ||
    hasEmail;

  /*
   * ============================================================
   * REDES SOCIALES
   * ============================================================
   */

  const hasSocialLinks =
    !!restaurant.instagram ||
    !!restaurant.facebook ||
    !!restaurant.tiktok;

  /*
   * ============================================================
   * ESTILO BOTONES SOCIALES
   * ============================================================
   */

  const socialButton = {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(255,255,255,.03)",
    border: "1px solid rgba(255,255,255,.08)",
    color: theme.primary,
    textDecoration: "none",
    backdropFilter: "blur(12px)",
    transition: ".3s",
    cursor: "pointer",
  };

  return (
    <footer
      style={{
        position: "relative",
        overflow: "hidden",
        background: `linear-gradient(
          180deg,
          ${theme.background} 0%,
          #0a0a0a 100%
        )`,
        borderTop:
          "1px solid rgba(255,255,255,.06)",
        padding: "90px 30px 35px",
      }}
    >
      {/* ======================================================
          GLOW
          ====================================================== */}

      <div
        style={{
          position: "absolute",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: theme.primary,
          filter: "blur(180px)",
          opacity: 0.08,
          top: "-250px",
          right: "-150px",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: "1300px",
          margin: "0 auto",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* ====================================================
            COLUMNAS
            ==================================================== */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(280px,1fr))",
            gap: "50px",
            marginBottom: "60px",
          }}
        >
          {/* ==================================================
              RESTAURANTE
              ================================================== */}

          <div>
            <h2
              style={{
                color: theme.text,
                textShadow: theme.glow
                  ? `0 0 25px ${theme.primary}55`
                  : "none",
                fontSize: "32px",
                fontWeight: "800",
                marginBottom: "20px",
              }}
            >
              {restaurant.name}
            </h2>

            <p
              style={{
                color: theme.text,
                opacity: 0.65,
                lineHeight: 1.9,
                fontSize: "15px",
              }}
            >
              {restaurant.slogan ||
                restaurant.description}
            </p>
          </div>

          {/* ==================================================
              CONTACTO
              ================================================== */}

{hasContactSection && (
  <div id="contact">
    {hasWhatsapp && (
      <h3
        style={{
          color: theme.text,
          marginBottom: "25px",
        }}
      >
        Contacto
      </h3>
    )}

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "18px",
                }}
              >
                {/* ------------------------------------------
                    WHATSAPP / TELÉFONO
                    ------------------------------------------ */}

                {hasWhatsapp && (
                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      alignItems: "center",
                      color: theme.text,
                      opacity: 0.75,
                    }}
                  >
                    <Phone size={18} />

                    <span>
                      {restaurant.whatsapp_url}
                    </span>
                  </div>
                )}

                {/* ------------------------------------------
                    DIRECCIÓN
                    ------------------------------------------ */}

                {hasAddress && (
                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      alignItems: "center",
                      color: theme.text,
                      opacity: 0.75,
                    }}
                  >
                    <MapPin size={18} />

                    <span>
                      {restaurant.address}
                    </span>
                  </div>
                )}

                {/* ------------------------------------------
                    CORREO
                    ------------------------------------------ */}

                {hasEmail && (
                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      alignItems: "center",
                      color: theme.text,
                      opacity: 0.75,
                    }}
                  >
                    <Mail size={18} />

                    <span>
                      {restaurant.contact_email}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ==================================================
              REDES SOCIALES
              ================================================== */}

          {showSocials && hasSocialLinks && (
            <div>
              <h3
                style={{
                  color: theme.text,
                  marginBottom: "25px",
                }}
              >
                Síguenos en nuestras redes sociales
              </h3>

              <div
                style={{
                  display: "flex",
                  gap: "16px",
                  flexWrap: "wrap",
                }}
              >
                {/* Instagram */}

                {restaurant.instagram && (
                  <a
                    href={restaurant.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    style={socialButton}
                  >
                    <FaInstagram size={22} />
                  </a>
                )}

                {/* Facebook */}

                {restaurant.facebook && (
                  <a
                    href={restaurant.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    style={socialButton}
                  >
                    <FaFacebookF size={22} />
                  </a>
                )}

                {/* TikTok */}

                {restaurant.tiktok && (
                  <a
                    href={restaurant.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="TikTok"
                    style={socialButton}
                  >
                    <FaTiktok size={20} />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ====================================================
            DIVIDER
            ==================================================== */}

        <div
          style={{
            height: "1px",
            background: `linear-gradient(
              90deg,
              transparent,
              ${theme.primary}55,
              transparent
            )`,
            marginBottom: "30px",
          }}
        />

        {/* ====================================================
            COPYRIGHT
            ==================================================== */}

        {restaurant.show_footer_copyright && (
          <div
            style={{
              textAlign: "center",
              color: theme.text,
              opacity: 0.45,
              fontSize: "14px",
              marginBottom: "10px",
            }}
          >
            {restaurant.footer_text}
          </div>
        )}

        {/* ====================================================
            WOLF BRANDING
            ==================================================== */}

        {restaurant.show_wolf_branding && (
          <div
            style={{
              textAlign: "center",
              marginTop: "12px",
              color: theme.primary,
              fontSize: "12px",
            }}
          >
            Powered by Wolf Ordering™
          </div>
        )}
      </div>
    </footer>
  );
}