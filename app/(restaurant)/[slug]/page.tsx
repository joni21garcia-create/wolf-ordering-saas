import { getRestaurant } from "@/lib/restaurants/getRestaurant";

import ThemeProvider from "@/components/restaurant/ThemeProvider";
import Hero from "@/components/restaurant/Hero";
import FeaturedMenu from "@/components/restaurant/FeaturedMenu";
import Services from "@/components/restaurant/Services";
import Gallery from "@/components/restaurant/Gallery";
import About from "@/components/restaurant/About";

import Menu from "@/components/restaurant/Menu";
import CTA from "@/components/restaurant/sections/CTA";
import Navbar from "@/components/restaurant/Navbar";
import Footer from "@/components/restaurant/Footer";
import PushProvider from "@/components/push/PushProvider";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

/*
|--------------------------------------------------------------------------
| Página del restaurante
|--------------------------------------------------------------------------
*/

export default async function RestaurantPage({
  params,
}: Props) {
  const { slug } = await params;

  // Asegúrate de que getRestaurant incluya el filtro .eq("active", true) 
  // para que retorne null si el restaurante ha sido desactivado.
  const restaurant = await getRestaurant(slug);

  if (!restaurant) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#fff",
          background: "#121212",
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
          padding: "0 20px",
        }}
      >
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
            Restaurante no disponible
          </h1>
          <p style={{ color: "#8f8f8f", fontSize: 14 }}>
            Este establecimiento se encuentra inactivo temporalmente o no existe.
          </p>
        </div>
      </main>
    );
  }

  return (
    <>
<PushProvider

/>

      <ThemeProvider
        theme={restaurant.themeSettings}
      />

      <Navbar
        restaurant={restaurant}
      />

      <Hero
        restaurant={restaurant}
      />

      <Services
        restaurant={restaurant}
      />

      <FeaturedMenu
        restaurant={restaurant}
      />

      <Menu
        restaurant={restaurant}
      />

      <Gallery
        restaurant={restaurant}
      />

      <About
        restaurant={restaurant}
      />

      <CTA
        restaurant={restaurant}
      />

      <Footer
        restaurant={restaurant}
      />
    </>
  );
}