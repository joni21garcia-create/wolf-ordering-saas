import { getTheme } from "@/lib/theme/getTheme";
import Link from "next/link";
import {
  getFinalPrice,
  getCommissionConfig,
} from "@/lib/configuration/pricing";

interface Props {
  restaurant: any;
}

export default function FeaturedMenu({ restaurant }: Props) {
  const theme = getTheme(restaurant);
  const commissionConfig = getCommissionConfig(restaurant);

  const featuredProducts = restaurant.featuredProducts || [];

  if (featuredProducts.length === 0) {
    return null;
  }

  return (
    <section
      id="featured-menu"
      style={{
        position: "relative",
        overflow: "hidden",
        padding: "60px 16px",
        background: "radial-gradient(circle at 50% 0%, #141414 0%, #080808 60%, #030303 100%)",
      }}
    >
      {/* Glows ambientales idénticos */}
      <div
        style={{
          position: "absolute",
          width: "450px",
          height: "450px",
          background: theme.primary,
          filter: "blur(180px)",
          opacity: 0.07,
          top: "-100px",
          left: "-150px",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: "400px",
          height: "400px",
          background: theme.secondary || theme.primary,
          filter: "blur(160px)",
          opacity: 0.04,
          bottom: "-100px",
          right: "-150px",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div style={{ marginBottom: "25px", textAlign: "left" }}>
          <span style={{ color: theme.primary, textTransform: "uppercase", letterSpacing: "2.5px", fontSize: "11px", fontWeight: "800", display: "block", marginBottom: "6px" }}>
            Selección Especial
          </span>
          <h2
            style={{
              fontSize: "clamp(1.8rem, 3vw, 2.8rem)",
              fontWeight: "800",
              color: "#ffffff",
              letterSpacing: "-1px",
              margin: 0,
            }}
          >
            Menú Destacado
          </h2>
        </div>

        {/* CONTENEDOR EN FILA CON SCROLL HORIZONTAL ESTILO APP */}
        <div
          style={{
            display: "flex",
            gap: "14px",
            overflowX: "auto",
            paddingBottom: "10px",
            scrollbarWidth: "none",
            WebkitOverflowScrolling: "touch",
            scrollBehavior: "smooth",
          }}
        >
          {featuredProducts.map((product: any) => (
            <div
              key={product.id}
              style={{
                flex: "0 0 210px",
                background: theme.cardStyle === "glass" ? "rgba(20,20,20,0.6)" : "#111111",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "16px",
                overflow: "hidden",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxShadow: theme.glow ? `0 0 20px ${theme.primary}20` : "0 10px 30px rgba(0,0,0,0.6)",
                transition: "border-color 0.3s ease",
              }}
            >
              {/* IMAGEN COMPACTA */}
              <div style={{ position: "relative", overflow: "hidden", height: "130px", background: "#000" }}>
                <img
                  src={product.image_url}
                  alt={product.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    opacity: 0.95,
                  }}
                />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 60%, rgba(0,0,0,0.5))" }} />
              </div>

              {/* CONTENIDO INTERNO */}
              <div style={{ padding: "12px", display: "flex", flexDirection: "column", flex: 1, justifyContent: "space-between" }}>
                <div>
                  <h3
                    style={{
                      color: "#fff",
                      fontSize: "14px",
                      fontWeight: "700",
                      marginBottom: "4px",
                      letterSpacing: "-0.2px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {product.name}
                  </h3>

                  <p
                    style={{
                      color: "rgba(255,255,255,0.6)",
                      fontSize: "11px",
                      lineHeight: 1.4,
                      marginBottom: "12px",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {product.description}
                  </p>
                </div>

                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "8px", borderTop: "1px solid rgba(255,255,255,0.06)", marginBottom: "8px" }}>
                    <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)", fontWeight: "600", textTransform: "uppercase" }}>Precio</span>
                    <strong
                      style={{
                        fontSize: "16px",
                        fontWeight: "800",
                        color: theme.primary,
                        letterSpacing: "-0.5px",
                      }}
                    >
                      ${getFinalPrice(Number(product.price), commissionConfig).toFixed(2)}
                    </strong>
                  </div>

                  {restaurant.is_open && (
                    <Link href={`/${restaurant.slug}/order`} style={{ display: "block" }}>
                      <button
                        style={{
                          width: "100%",
                          background: theme.primary,
                          color: theme.text,
                          border: "none",
                          padding: "8px 12px",
                          borderRadius: theme.buttonStyle === "rounded" ? "999px" : "8px",
                          cursor: "pointer",
                          fontWeight: "700",
                          fontSize: "12px",
                          boxShadow: theme.glow ? `0 0 15px ${theme.primary}55` : "none",
                        }}
                      >
                        {restaurant.navbar_button_text || "Ordenar"}
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


