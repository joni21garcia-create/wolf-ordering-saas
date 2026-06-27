import styles from "./Gallery.module.css";
import { getTheme } from "@/lib/theme/getTheme";

interface Props {
  restaurant: any;
}

export default function Gallery({
  restaurant,
}: Props) {

const theme =
  getTheme(restaurant);

  const gallery =
    restaurant.gallery?.filter(
      (image: any) => image.active
    ) || [];

    console.log(restaurant.gallery);

  if (!gallery.length) {
    return null;
  }

  return (
  
<section
  className={
    styles.gallerySection
  }
  style={{
    background:
      theme.background,
  }}
>

      <div className={styles.container}>
      <div
  className={styles.header}
>
  <span
    style={{
      color:
        theme.primary,
    }}
  >
    GALERÍA
  </span>

  <h2
    style={{
      color:
        theme.text,
    }}
  >
    Descubre Nuestro Espacio
  </h2>


</div>

        <div className={styles.grid}>
          {gallery.map(
            (image: any) => (
              <div
                key={image.id}
                className={styles.card}
              >
                <img
                  src={image.image_url}
                  alt={image.title}
                />

                <div
                  className={styles.overlay}
                >
                  <h3
  style={{
    color:
      theme.text,
  }}
>
  {image.title}
</h3>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}