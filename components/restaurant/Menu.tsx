"use client";

import { motion } from "framer-motion";
import { getTheme } from "@/lib/theme/getTheme";


function getDisplayPrice(
  price: number,
  restaurant: any
) {
  if (
    !restaurant?.commission_active
  ) {
    return price;
  }

  const percentage =
    Number(
      restaurant.commission_percentage
    ) || 0;

  if (
    restaurant.commission_type ===
    "customer"
  ) {
    return (
      price +
      (price * percentage) / 100
    );
  }

  return price;
}

interface Props {
  restaurant: any;
}

export default function Menu({
  restaurant,
}: Props) {

const theme =
  getTheme(restaurant);

  const categories =
    restaurant.categories || [];

  const products =
    restaurant.products || [];

  return (
    <section
      id="menu"
      style={{
        position: "relative",
        overflow: "hidden",
        padding: "120px 20px",
        background:
          "linear-gradient(180deg,#0a0a0a 0%,#050505 100%)",
      }}
    >
      {/* Glow izquierda */}
      <div
        style={{
          position: "absolute",
          width: "500px",
          height: "500px",
         background:
  theme.primary,
          filter: "blur(200px)",
          opacity: 0.12,
          top: "-150px",
          left: "-150px",
        }}
      />

      {/* Glow derecha */}
      <div
        style={{
          position: "absolute",
          width: "450px",
          height: "450px",
         background:
  theme.secondary,
          filter: "blur(180px)",
          opacity: 0.08,
          bottom: "-150px",
          right: "-150px",
        }}
      />

      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          position: "relative",
          zIndex: 2,
        }}
      >
        <h2
          style={{
            fontSize:
              "clamp(3rem,5vw,4.5rem)",
            fontWeight: "700",
            marginBottom: "80px",
             color:
      theme.primary
          }}
        >
           Menú Completo
        </h2>

        {categories.map(
          (category: any) => {
            const categoryProducts =
  products.filter(
    (product: any) =>
      product.category_id ===
        category.id &&
      product.available === true
  );

            if (
              categoryProducts.length === 0
            ) {
              return null;
            }

            return (
              <motion.div
                key={category.id}
                initial={{
                  opacity: 0,
                  y: 30,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 0.6,
                }}
                style={{
                  marginBottom: "90px",
                }}
              >
                <h3
                  style={{
                    fontSize: "36px",
                    marginBottom: "30px",
                    color:
                     theme.primary
                  }}
                >
                  {category.name}
                </h3>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit,minmax(320px,1fr))",
                    gap: "30px",
                  }}
                >
                  {categoryProducts.map(
                    (product: any) => (
                      <motion.div
                        key={product.id}
                        initial={{
                          opacity: 0,
                          y: 40,
                        }}
                        whileInView={{
                          opacity: 1,
                          y: 0,
                        }}
                        viewport={{
                          once: true,
                        }}
                        transition={{
                          duration: 0.5,
                        }}
                        whileHover={{
                          y: -12,
                          scale: 1.03,
                          rotateX: 2,
                          rotateY: 2,
                          boxShadow: `0 25px 60px ${theme.primary}50`,
                        }}
                        style={{
                          background:
  theme.cardStyle === "glass"
    ? "rgba(255,255,255,.05)"
    : "#111111",
                          backdropFilter:
                            "blur(20px)",
                          border:
                            "1px solid rgba(255,255,255,.08)",
                          borderRadius:
                            "28px",
                          overflow: "hidden",
                          cursor: "pointer",
                         boxShadow:
  theme.glow
    ? `0 0 20px ${theme.primary}20`
    : "none",
                        }}
                      >
                        <div
                          style={{
                            overflow:
                              "hidden",
                          }}
                        >
                          <motion.img
                            src={
                              product.image_url
                            }
                            alt={
                              product.name
                            }
                            whileHover={{
                              scale: 1.1,
                            }}
                            transition={{
                              duration: 0.4,
                            }}
                            style={{
                              width: "100%",
                              height:
                                "260px",
                              objectFit:
                                "cover",
                            }}
                          />
                        </div>

                        <div
                          style={{
                            padding:
                              "24px",
                          }}
                        >
                          <h4
                            style={{
                              color:
                                "#fff",
                              fontSize:
                                "24px",
                              fontWeight:
                                "700",
                              marginBottom:
                                "12px",
                            }}
                          >
                            {product.name}
                          </h4>

                          <p
                            style={{
                              color:
                                "rgba(255,255,255,.7)",
                              lineHeight:
                                1.6,
                              marginBottom:
                                "24px",
                            }}
                          >
                            {
                              product.description
                            }
                          </p>

                         <strong
  style={{
    display:
      "block",
    fontSize:
      "32px",
    color:
      theme.primary,
  }}
>
  $
  {getDisplayPrice(
    Number(product.price),
    restaurant
  ).toFixed(2)}
</strong>

                        </div>
                      </motion.div>
                    )
                  )}
                </div>
              </motion.div>
            );
          }
        )}
      </div>
    </section>
  );
}