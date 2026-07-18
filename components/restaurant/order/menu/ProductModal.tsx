"use client";

interface Product {
  id: string;
  restaurant_id: string;
  category: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

interface Props {
  product: Product | null;
  finalPrice: number;
 primaryColor: string;
  onClose: () => void;
  onAdd: () => void;
}

export default function ProductModal({
  product,
  finalPrice,
  primaryColor,
  onClose,
  onAdd,
}: Props) {
  if (!product) return null;

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,.75)",
          zIndex: 999,
        }}
      />

      <div
        style={{
          position: "fixed",
          left: "50%",
          top: "50%",
          transform: "translate(-50%,-50%)",
          width: "92%",
          maxWidth: 420,
          background: "#181818",
          borderRadius: 20,
          overflow: "hidden",
          zIndex: 1000,
        }}
      >
        <img
          src={product.image}
          alt={product.name}
          style={{
            width: "100%",
            height: 250,
            objectFit: "cover",
          }}
        />

        <div
          style={{
            padding: 20,
          }}
        >
          <h2
            style={{
              color: "#fff",
              marginBottom: 10,
            }}
          >
            {product.name}
          </h2>

          <p
            style={{
              color: "#ccc",
              lineHeight: 1.6,
            }}
          >
            {product.description}
          </p>

          <h3
            style={{
              color: primaryColor,
              marginTop: 20,
            }}
          >
            ${finalPrice.toFixed(2)}
          </h3>

          <button
            onClick={onAdd}
            style={{
              width: "100%",
              marginTop: 20,
              padding: 14,
              border: "none",
              borderRadius: 12,
              background: primaryColor,
              color: "#fff",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            Agregar al carrito
          </button>
        </div>
      </div>
    </>
  );
}