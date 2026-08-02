/*
==========================================================

Wolf Ordering

Tracking Order Items

==========================================================
*/

import Image from "next/image";

import {
  ShoppingBag,
  UtensilsCrossed,
} from "lucide-react";

interface Props {
  order: any;
  items: any[];
}

export default function TrackingOrderItems({
  order,
  items,
}: Props) {

  const orderItems =
    items ?? [];

  if (
    orderItems.length === 0
  ) {
    return null;
  }

  return (

    <>
      <style>{`

        .tracking-items{

          transition:.25s;

        }

        .tracking-item{

          transition:.25s;

        }

        .tracking-item:hover{

          background:rgba(255,255,255,.025);

        }

        @media (max-width:768px){

          .tracking-items{

            padding:20px !important;

            border-radius:20px !important;

          }

          .tracking-title{

            font-size:20px !important;

          }

          .tracking-total{

            font-size:24px !important;

          }

          .tracking-name{

            font-size:15px !important;

          }

        }

      `}</style>

      <section

        className="tracking-items"

        style={{

          background:
            "linear-gradient(180deg,#171717,#101010)",

          border:
            "1px solid rgba(255,255,255,.06)",

          borderRadius:24,

          padding:28,

          boxShadow:
            "0 18px 40px rgba(0,0,0,.35)",

        }}

      >

        {/* Header */}

        <div

          style={{

            display:"flex",

            justifyContent:"space-between",

            alignItems:"center",

            paddingBottom:20,

            marginBottom:8,

            borderBottom:
              "1px solid rgba(255,255,255,.06)",

          }}

        >

          <div

            style={{

              display:"flex",

              alignItems:"center",

              gap:12,

            }}

          >

            <ShoppingBag

              size={22}

              color="#fb923c"

            />

            <span

              className="tracking-title"

              style={{

                color:"#fff",

                fontSize:22,

                fontWeight:800,

              }}

            >

              Tu pedido

            </span>

          </div>

          <div

            className="tracking-total"

            style={{

              color:"#fb923c",

fontSize:20,
fontWeight:700,
letterSpacing:".3px",

            }}

          >

            ${Number(
              order.total ?? 0
            ).toFixed(2)}

          </div>

        </div>

        {/* Productos */}

        <div
          style={{
            display:"flex",
            flexDirection:"column",
          }}
        >
                    {orderItems.map((item: any, index: number) => (

          <div

            key={item.id}

            className="tracking-item"

            style={{

              display:"flex",

              justifyContent:"space-between",

              alignItems:"center",

              padding:"18px 8px",

              borderBottom:

                index !== orderItems.length - 1

                  ? "1px solid rgba(255,255,255,.05)"

                  : "none",

              borderRadius:16,

            }}

          >

            <div

              style={{

                display:"flex",

                alignItems:"center",

                gap:14,

                flex:1,

              }}

            >

<div
  style={{
    width: 56,
    height: 56,
    borderRadius: 14,
    overflow: "hidden",
    background: "#242424",
    border: "1px solid rgba(255,255,255,.06)",
    flexShrink: 0,
  }}
>
  {item.products?.image_url ? (
    <Image
      src={item.products.image_url}
      alt={item.products.name}
      width={56}
      height={56}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
      }}
    />
  ) : (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <UtensilsCrossed
        size={18}
        color="#fb923c"
      />
    </div>
  )}
</div>

              <div
                style={{
                  flex:1,
                }}
              >

                <div

                  className="tracking-name"

                  style={{

                    color:"#fff",

                    fontSize:16,

                    fontWeight:700,

                    lineHeight:1.45,

                  }}

                >

                 
                {item.products?.name ?? "Producto"}
                </div>

              </div>

            </div>

            <div

              style={{

                padding:"5px 12px",

                borderRadius:999,

                background:"#242424",

                border:
                  "1px solid rgba(255,255,255,.06)",

                color:"#d1d5db",

                fontSize:13,

                fontWeight:700,

                flexShrink:0,

              }}

            >

              × {item.quantity}

            </div>

          </div>

        ))}

      </div>

    </section>

    </>

  );

}