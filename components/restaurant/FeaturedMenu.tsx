import { getTheme } from "@/lib/theme/getTheme";
import Link from "next/link";



interface Props {
  restaurant: any;
}

function getDisplayPrice(
  product: any,
  restaurant: any
) {
  const basePrice =
    Number(product.price) || 0;

  if (
    !restaurant?.commission_active
  ) {
    return basePrice;
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
      basePrice +
      (basePrice * percentage) / 100
    );
  }

  return basePrice;
}

export default function FeaturedMenu({
  restaurant,
}: Props) {

const theme =
  getTheme(restaurant);

    console.log("PRODUCTS:", restaurant.products);


 const featuredProducts =
  restaurant.featuredProducts || [];

  if (featuredProducts.length === 0) {
    return null;
  }

  console.log(restaurant.products);
  return (

    <section
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "80px 20px",
      }}
    >
<h2
  style={{
    fontSize: "40px",
    fontWeight: "bold",
    color: theme.text,
    marginBottom: "40px",
  }}
>
        Menú Destacado
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(280px,1fr))",
          gap: "24px",
        }}
      >
        {featuredProducts.map(
          (product: any) => (
            <div
              key={product.id}
              style={{
                background:
  theme.cardStyle ===
  "glass"
    ? "rgba(255,255,255,.06)"
    : theme.background,
                borderRadius: "20px",
                overflow: "hidden",
                boxShadow:
  theme.glow
    ? `0 0 30px ${theme.primary}20`
    : "0 10px 30px rgba(0,0,0,.08)",
              }}
            >
              <img
                src={product.image_url}
                alt={product.name}
                style={{
                  width: "100%",
                  height: "220px",
                  objectFit: "cover",
                }}
              />

              <div
                style={{
                  padding: "20px",
                }}
              >
                <h3
                  style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    color: theme.text,
                    marginBottom: "10px",
                  }}
                >
                  {product.name}
                </h3>

<p
  style={{
    color: theme.text,
    opacity: 0.70,
    marginBottom: "20px",
  }}
>
                  {product.description}
                </p>

                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    alignItems: "center",
                  }}
                >
                  <strong
                    style={{
                      fontSize: "24px",
                      color: theme.primary,
                    }}
                  >
                    $
                    {getDisplayPrice(product, restaurant).toFixed(2)}
                  </strong>

                  {restaurant.is_open && (
                    <Link href={`/${restaurant.slug}/order`}>
                      <button
                        style={{
                          background: theme.primary,
                          color: theme.text,
                          border: "none",
                          padding: "12px 20px",
                          borderRadius:
                            theme.buttonStyle === "rounded"
                              ? "999px"
                              : "12px",
                          cursor: "pointer",
                          fontWeight: "700",
                          boxShadow: theme.glow
                            ? `0 0 20px ${theme.primary}55`
                            : "none",
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
    </section>
  );
}