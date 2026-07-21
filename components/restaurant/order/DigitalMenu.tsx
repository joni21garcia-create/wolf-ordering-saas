"use client";

import {
  useState,
  useEffect,
  useMemo,
} from "react";

import CategoryTabs from "./menu/CategoryTabs";
import MenuSection from "./menu/MenuSection";
import useMenuScroll from "./menu/useMenuScroll";
import ProductModal from "./menu/ProductModal";
import RestaurantMap from "./RestaurantMap";
import FloatingActions from "./menu/FloatingActions";

import { styles } from "./menu/menu.styles";

import { supabase } from "@/lib/supabase/client";
import {
  getFinalPrice,
  getCommissionConfig,
} from "@/lib/configuration/pricing";

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
  restaurant: any;

  addToCart: (
    product: Product
  ) => void;

  cartCount: number;

  onCart: () => void;
}

export default function DigitalMenu({
  restaurant,
  addToCart,
  cartCount,
  onCart,
}: Props) {
  const [
    products,
    setProducts,
  ] = useState<Product[]>(
    []
  );

  const [
    categories,
    setCategories,
  ] = useState<string[]>([]);

  
const [
  loading,
  setLoading,
] = useState(true);

const [showMap, setShowMap] =
  useState(false);

const [
  selectedProduct,
  setSelectedProduct,
] = useState<Product | null>(null);

const {
  activeCategory,
  registerSection,
  scrollToCategory,
} = useMenuScroll();

  useEffect(() => {
    if (
      restaurant?.id
    ) {
      loadProducts();
    }
  }, [restaurant?.id]);

  const loadProducts =
    async () => {
      setLoading(true);

      const {
        data,
        error,
      } = await supabase
        .from("products")
        .select(`
          *,
          categories(name)
        `)
        .eq(
          "restaurant_id",
          restaurant.id
        )
        .eq(
          "available",
          true
        );

      if (error) {
        console.error(
          "Error cargando productos:",
          error
        );

        setLoading(false);

        return;
      }

      const formattedProducts =
        (data || []).map(
          (
            product: any
          ) => ({
            id: product.id,

            restaurant_id:
              product.restaurant_id,

            name:
              product.name,

            description:
              product.description ||
              "",

            price:
              Number(
                product.price
              ) || 0,

            image:
              product.image_url ||
              "/placeholder-product.jpg",

            category:
              product
                .categories
                ?.name ||
              "Disponibles",
          })
        );

      setProducts(
        formattedProducts
      );

      const uniqueCategories =
        [
          ...new Set(
            formattedProducts.map(
              (p) =>
                p.category
            )
          ),
        ];

      setCategories(
        uniqueCategories
      );

      setLoading(false);
    };

  const productsByCategory =
    useMemo(() => {
      return products.reduce(
        (
          acc,
          product
        ) => {
          (
            acc[
              product.category
            ] ||= []
          ).push(product);

          return acc;
        },
        {} as Record<
          string,
          Product[]
        >
      );
    }, [products]);

  const primaryColor =
    restaurant
      ?.primary_color ??
    "#f97316";

const commissionConfig = useMemo(
  () => getCommissionConfig(restaurant),
  [restaurant]
);

  if (loading) {
    return (
      <section
        style={
          styles.container
        }
      >
        <h2
          style={
            styles.title
          }
        >
          Menú Digital
        </h2>

<FloatingActions
  cartCount={cartCount}
  onMap={() => setShowMap(true)}
  onCart={onCart}
/>

        <p
          style={{
            color:
              "rgba(255,255,255,.6)",
          }}
        >
          Cargando menú...
        </p>
      </section>
    );
  }

if (!products.length) {
  return (
    <section
      style={styles.container}
    >
      <h2
        style={styles.title}
      >
        Menú Digital
      </h2>

      <FloatingActions
        cartCount={cartCount}
        onMap={() => setShowMap(true)}
        onCart={onCart}
      />

      <p
        style={{
          color: "rgba(255,255,255,.6)",
        }}
      >
        No hay productos
        disponibles por el
        momento.
      </p>
    </section>
  );
}

return (
  <section style={styles.container}>

    <h2 style={styles.title}>
      Menú Digital
    </h2>

<FloatingActions
  cartCount={cartCount}
  onMap={() => setShowMap(true)}
  onCart={onCart}
/>
    <CategoryTabs
      categories={categories}
      activeCategory={activeCategory}
      onSelect={scrollToCategory}
      primaryColor={primaryColor}
    />

    <div style={styles.sections}>
      {categories.map((category) => (
        <MenuSection
          key={category}
          title={category}
          products={
            productsByCategory[category] || []
          }
          commissionConfig={commissionConfig}
          addToCart={addToCart}
          onOpen={setSelectedProduct}
          primaryColor={primaryColor}
          sectionRef={(el) =>
            registerSection(category, el)
          }
        />
      ))}
    </div>

    <ProductModal
      product={selectedProduct}
      finalPrice={
        selectedProduct
          ? getFinalPrice(
              selectedProduct.price,
              commissionConfig
            )
          : 0
      }
      primaryColor={primaryColor}
      onClose={() =>
        setSelectedProduct(null)
      }
      onAdd={() => {
        if (!selectedProduct) return;

        addToCart(selectedProduct);
        setSelectedProduct(null);
      }}
    />

    {/* AQUÍ PEGAS EL MAPA */}

    {showMap && (
      <div
        onClick={() => setShowMap(false)}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,.65)",
          zIndex: 1000,
          padding: 20,
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            maxWidth: 700,
            margin: "40px auto",
          }}
        >
          <RestaurantMap
            restaurant={restaurant}
          />
        </div>
      </div>
    )}

  </section>
);
}


