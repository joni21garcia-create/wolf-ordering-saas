"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

import BackToSettings from "@/components/admin/BackToSettings";

import GoogleReviewsTabs, {
  GoogleReviewsSection,
} from "./GoogleReviewsTabs";

import GoogleReviewsForm from "./GoogleReviewsForm";
import GoogleReviewsQR from "./GoogleReviewsQR";
import GoogleReviewsPreview from "./GoogleReviewsPreview";
import GoogleReviewsPoster from "./GoogleReviewsPoster";


interface Props {
  restaurantId: string;
}


interface RestaurantData {
  id: string;
  name: string | null;
  logo_url: string | null;
  google_reviews_url: string | null;
}



export default function GoogleReviewsSettings({
  restaurantId,
}: Props) {

  const [restaurant, setRestaurant] =
    useState<RestaurantData | null>(null);


  const [activeSection, setActiveSection] =
    useState<GoogleReviewsSection>("link");


  const [loading, setLoading] =
    useState(true);


  const [error, setError] =
    useState("");



  useEffect(() => {
    loadRestaurant();
  }, [restaurantId]);



  async function loadRestaurant() {

    setLoading(true);
    setError("");


    const {
      data,
      error: loadError,
    } = await supabase
      .from("restaurants")
      .select(
        `
        id,
        name,
        logo_url,
        google_reviews_url
        `
      )
      .eq("id", restaurantId)
      .maybeSingle();



    if (loadError) {

      console.error(
        "Google Reviews:",
        loadError
      );


      setError(
        "No se pudo cargar la configuración."
      );


      setLoading(false);

      return;
    }



    if (!data) {

      setError(
        "Restaurante no encontrado."
      );


      setLoading(false);

      return;
    }



    setRestaurant(data);

    setLoading(false);

  }





  async function saveReviewsUrl(
    url:string
  ) {


    const {
      error: saveError,
    } = await supabase
      .from("restaurants")
      .update({

        google_reviews_url:
          url || null,

      })
      .eq(
        "id",
        restaurantId
      );



    if (saveError) {

      console.error(
        saveError
      );


      throw new Error(
        "No se pudo guardar."
      );

    }



    setRestaurant(
      current =>
        current
          ? {
              ...current,

              google_reviews_url:
                url || null,
            }

          : current
    );

  }






  if (loading) {

    return (

      <main className="state">

        Cargando Google Reviews...

      </main>

    );

  }





  if (!restaurant) {

    return (

      <main className="state error">

        {error}

      </main>

    );

  }





  const reviewsUrl =
    restaurant.google_reviews_url ?? "";





  return (

    <main className="page">


      <style jsx>{`

        .page {

          min-height:100vh;

          background:
          radial-gradient(
            circle at top right,
            rgba(249,115,22,.08),
            transparent 35%
          ),
          #080808;

          color:white;

        }



        .shell {

          width:min(1200px,100%);

          margin:auto;

          padding:
          18px
          clamp(12px,3vw,28px)
          40px;

          box-sizing:border-box;

        }



        .header {

          margin-bottom:16px;

        }



        .title {

          display:flex;

          justify-content:space-between;

          gap:15px;

          align-items:flex-start;

        }



        .eyebrow {

          margin-top:14px;

          color:#f97316;

          font-size:9px;

          font-weight:900;

          letter-spacing:.13em;

          text-transform:uppercase;

        }



        h1 {

          margin:6px 0;

          font-size:
          clamp(26px,4vw,38px);

          letter-spacing:-.03em;

        }



        .subtitle {

          margin:0;

          color:#777;

          font-size:12px;

        }



        .restaurant {

          padding:7px 12px;

          border-radius:999px;

          border:1px solid rgba(255,255,255,.08);

          color:#aaa;

          font-size:10px;

          font-weight:800;

        }



        .tabs {

          margin-top:18px;

        }



        .layout {

          margin-top:14px;

          display:grid;

          grid-template-columns:
          minmax(0,1fr)
          minmax(280px,.75fr);

          gap:14px;

          align-items:start;

        }



        .preview {

          position:sticky;

          top:15px;

        }



        .qr-card {

          padding:18px;

          border-radius:18px;

          border:
          1px solid rgba(255,255,255,.07);

          background:
          rgba(255,255,255,.025);

        }



        .qr-title {

          font-size:12px;

          font-weight:900;

          text-transform:uppercase;

        }



        .qr-subtitle {

          margin-top:5px;

          color:#777;

          font-size:11px;

        }



        .state {

          min-height:300px;

          display:grid;

          place-items:center;

          background:#080808;

          color:#777;

          font-size:12px;

        }



        .error {

          color:#f87171;

        }



        @media(max-width:820px){

          .layout {

            grid-template-columns:1fr;

          }


          .preview {

            position:relative;

            top:auto;

          }


        }



        @media(max-width:560px){

          .title {

            display:block;

          }


          .restaurant {

            display:inline-block;

            margin-top:10px;

          }


        }

      `}</style>





      <div className="shell">



        <header className="header">


          <BackToSettings
            restaurantId={restaurantId}
          />



          <div className="eyebrow">

            Marketing · Restaurante

          </div>



          <div className="title">


            <div>

              <h1>

                Google Reviews ⭐

              </h1>


              <p className="subtitle">

                Gestiona reseñas, QR y material
                promocional.

              </p>

            </div>



            <div className="restaurant">

              {restaurant.name}

            </div>



          </div>



          <div className="tabs">


            <GoogleReviewsTabs

              active={activeSection}

              onChange={
                setActiveSection
              }

            />


          </div>



        </header>







        <div className="layout">



          <section>



            {
              activeSection === "link" && (

                <GoogleReviewsForm

                  initialUrl={reviewsUrl}

                  onSave={
                    saveReviewsUrl
                  }

                />

              )

            }






            {
              activeSection === "qr" && (

                <section className="qr-card">


                  <div className="qr-title">

                    Código QR

                  </div>


                  <div className="qr-subtitle">

                    QR directo a Google Reviews.

                  </div>



                  <GoogleReviewsQR

                    url={reviewsUrl}

                    restaurantName={
                      restaurant.name ?? ""
                    }

                  />



                </section>

              )

            }







            {
              activeSection === "poster" && (

                <GoogleReviewsPoster

                  restaurantName={
                    restaurant.name ?? ""
                  }

                  logoUrl={
                    restaurant.logo_url
                  }

                  reviewsUrl={
                    reviewsUrl
                  }

                />

              )

            }



          </section>






          <aside className="preview">


            <GoogleReviewsPreview

              restaurantName={
                restaurant.name ?? ""
              }

              logoUrl={
                restaurant.logo_url
              }

              reviewsUrl={
                reviewsUrl
              }

            />



          </aside>




        </div>




      </div>




    </main>


  );

}