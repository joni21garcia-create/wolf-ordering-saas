import { getRestaurant } from "@/lib/restaurants/getRestaurant";

import ThemeProvider from "@/components/restaurant/ThemeProvider";
import Hero from "@/components/restaurant/Hero";
import FeaturedMenu from "@/components/restaurant/FeaturedMenu";
import Services from "@/components/restaurant/Services";
import Gallery from "@/components/restaurant/Gallery";
import About from "@/components/restaurant/About";
import FloatingWhatsApp from "@/components/restaurant/FloatingWhatsApp";
import Menu from "@/components/restaurant/Menu";
import CTA from "@/components/restaurant/sections/CTA";
import Navbar from "@/components/restaurant/Navbar";
import Footer from "@/components/restaurant/Footer";

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

  const restaurant =
    await getRestaurant(slug);

  if (!restaurant) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#fff",
        }}
      >
        <h1>
          Restaurante no encontrado
        </h1>
      </main>
    );
  }

  return (
    <>
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

      <FloatingWhatsApp
        restaurant={restaurant}
      />
    </>
  );
}