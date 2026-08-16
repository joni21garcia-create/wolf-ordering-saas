"use client";

import { useParams } from "next/navigation";
import ProductForm from "@/components/super-admin/products/ProductForm";
import BackToSettings from "@/components/admin/BackToSettings";

export default function NewProductPage() {
  const params = useParams();
  const restaurantId = params.id as string;

  return (
    <main className="product-page">
      <div className="product-page-inner">
        <header className="product-header">
          <BackToSettings restaurantId={restaurantId} />
          <div className="header-copy">
            <span className="eyebrow">Productos</span>
            <h1>Nuevo producto</h1>
            <p>Crea un producto rápido y continúa con el siguiente.</p>
          </div>
        </header>

        <section className="form-card">
          <ProductForm mode="create" restaurantId={restaurantId} />
        </section>
      </div>

      <style jsx global>{`
        .product-page {
          min-height:100vh;
          width:100%;
          box-sizing:border-box;
          padding:14px 10px 36px;
          background:#050505;
          color:#fff;
          font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
        }
        .product-page-inner {
          width:100%;
          max-width:620px;
          margin:0 auto;
        }
        .product-header {
          margin-bottom:8px;
        }
        .header-copy {
          margin-top:8px;
        }
        .eyebrow {
          display:block;
          color:#f97316;
          font-size:8px;
          font-weight:850;
          letter-spacing:1.15px;
          text-transform:uppercase;
          margin-bottom:3px;
        }
        h1 {
          margin:0;
          font-size:24px;
          line-height:1.05;
          letter-spacing:-.65px;
          font-weight:900;
        }
        .header-copy p {
          margin:4px 0 0;
          color:rgba(255,255,255,.34);
          font-size:9px;
          line-height:1.4;
        }
        .form-card {
          width:100%;
          box-sizing:border-box;
          padding:11px;
          border:1px solid rgba(255,255,255,.06);
          border-radius:13px;
          background:rgba(13,17,24,.72);
          box-shadow:0 14px 40px rgba(0,0,0,.22);
        }
        @media(max-width:390px) {
          .product-page {
            padding-left:8px;
            padding-right:8px;
          }
          .form-card {
            padding:9px;
            border-radius:11px;
          }
          h1 {
            font-size:22px;
          }
        }
      `}</style>
    </main>
  );
}