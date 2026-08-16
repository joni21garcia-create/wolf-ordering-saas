import { createClient } from "@supabase/supabase-js";

import FinancialSettings from "@/components/super-admin/restaurants/FinancialSettings";
import BackToSettings from "@/components/admin/BackToSettings";
import PermissionGuard from "@/components/auth/PermissionGuard";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface Props {
  params: Promise<{ id: string }>;
}

export default async function FinancialPage({ params }: Props) {
  const { id } = await params;

  const { data: restaurant } = await supabase
    .from("restaurants")
    .select(
      `
        id,
        commission_percentage,
        commission_mode,
        commission_type,
        commission_active
      `
    )
    .eq("id", id)
    .maybeSingle();

  if (!restaurant) {
    return (
      <div className="financial-not-found">
        Restaurante no encontrado
      </div>
    );
  }

  const examplePrice = 10;
  const commission = restaurant.commission_active
    ? Number(restaurant.commission_percentage) || 0
    : 0;

  const customerPrice = Number(
    (examplePrice * (1 + commission / 100)).toFixed(2)
  );

  const wolfAmount = Number(
    (examplePrice * (commission / 100)).toFixed(2)
  );

  const modeLabel =
    restaurant.commission_mode === "global" ? "Global Wolf" : "Personalizado";

  const payerLabel =
    restaurant.commission_type === "customer" ? "Cliente" : "Restaurante";

  return (
    <PermissionGuard permission="financial">
      <main className="financial-page">
        <div className="financial-shell">
          <header className="page-header">
            <BackToSettings restaurantId={id} />

            <div className="header-row">
              <div className="header-copy">
                <span className="eyebrow">WOLF FINANCIAL ENGINE</span>
                <h1>Configuración Financiera</h1>
                <p>
                  Controla comisiones, quién las paga y cómo se reflejan en
                  pedidos y facturación.
                </p>
              </div>

              <span
                className={
                  restaurant.commission_active
                    ? "status-pill active"
                    : "status-pill"
                }
              >
                <i />
                {restaurant.commission_active ? "Activa" : "Desactivada"}
              </span>
            </div>
          </header>

          <div className="summary-strip">
            <div className="summary-item featured">
              <span>Comisión</span>
              <strong>
                {restaurant.commission_active
                  ? `${restaurant.commission_percentage}%`
                  : "OFF"}
              </strong>
            </div>
            <div className="summary-item">
              <span>Modo</span>
              <strong>{modeLabel}</strong>
            </div>
            <div className="summary-item">
              <span>Pagada por</span>
              <strong>{payerLabel}</strong>
            </div>
          </div>

          <section className="accordion accordion-open">
            <div className="section-head">
              <span className="section-icon">01</span>
              <div>
                <strong>Configuración</strong>
                <small>Reglas actuales de comisión.</small>
              </div>
              <span className="section-mark">●</span>
            </div>

            <div className="section-body">
              <FinancialSettings
                restaurantId={restaurant.id}
                initialMode={restaurant.commission_mode || "global"}
                initialType={restaurant.commission_type || "customer"}
                initialPercentage={restaurant.commission_percentage || 5}
                initialActive={restaurant.commission_active || false}
              />
            </div>
          </section>

          <section className="accordion">
            <details>
              <summary>
                <span className="section-icon">02</span>
                <span className="summary-copy">
                  <strong>Vista previa</strong>
                  <small>Ejemplo calculado con un producto de $10.00.</small>
                </span>
                <span className="summary-chevron">+</span>
              </summary>

              <div className="preview-body">
                <div className="preview-product">
                  <span>Producto ejemplo</span>
                  <strong>${examplePrice.toFixed(2)}</strong>
                </div>

                <div className="preview-line">
                  <span>Cliente paga comisión ({commission}%)</span>
                  <strong className="orange">${customerPrice.toFixed(2)}</strong>
                </div>

                <div className="preview-line">
                  <span>Restaurante paga comisión ({commission}%)</span>
                  <strong>${examplePrice.toFixed(2)}</strong>
                </div>

                <div className="wolf-total">
                  <span>Wolf recibiría</span>
                  <strong>${wolfAmount.toFixed(2)}</strong>
                </div>
              </div>
            </details>
          </section>

          <section className="info-card">
            <span className="info-icon">i</span>
            <div>
              <strong>Cómo funciona</strong>
              <p>
                La comisión se aplica según la configuración seleccionada.
                La vista previa utiliza $10 como ejemplo.
              </p>
            </div>
          </section>
        </div>

        <style dangerouslySetInnerHTML={{ __html: `
          .financial-page{min-height:100dvh;width:100%;box-sizing:border-box;padding:14px 10px 34px;background:linear-gradient(180deg,#080808 0%,#0d0d0d 100%);color:#fff;font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color-scheme:dark}
          .financial-shell{width:100%;max-width:720px;margin:0 auto}
          .financial-not-found{min-height:100dvh;display:grid;place-items:center;background:#0b0b0b;color:#fff;font-family:system-ui,sans-serif}
          .page-header{margin-bottom:9px}
          .header-row{display:flex;align-items:flex-end;justify-content:space-between;gap:10px;margin-top:8px}
          .header-copy{min-width:0;flex:1}
          .eyebrow{display:block;color:#f97316;font-size:7px;font-weight:900;letter-spacing:1.2px}
          .header-copy h1{margin:3px 0 0;font-size:23px;line-height:1.05;letter-spacing:-.6px;font-weight:900}
          .header-copy p{max-width:570px;margin:5px 0 0;color:rgba(255,255,255,.3);font-size:8px;line-height:1.45}
          .status-pill{display:inline-flex;align-items:center;gap:4px;flex:0 0 auto;padding:4px 7px;border-radius:999px;background:rgba(239,68,68,.07);color:#ef4444;font-size:6px;font-weight:850;text-transform:uppercase}
          .status-pill.active{background:rgba(34,197,94,.07);color:#22c55e}
          .status-pill i{width:5px;height:5px;border-radius:50%;background:currentColor}
          .summary-strip{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:5px;margin-bottom:5px}
          .summary-item{min-width:0;padding:9px;border:1px solid rgba(255,255,255,.055);border-radius:9px;background:#101010}
          .summary-item span{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:rgba(255,255,255,.25);font-size:6px}
          .summary-item strong{display:block;margin-top:3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#fff;font-size:9px;font-weight:850}
          .summary-item.featured strong{color:#f97316}
          .accordion{overflow:hidden;margin-bottom:5px;border:1px solid rgba(255,255,255,.055);border-radius:10px;background:#101010}
          .accordion-open{border-color:rgba(249,115,22,.17)}
          .section-head,.accordion summary{min-height:51px;display:flex;align-items:center;gap:8px;padding:7px 9px;box-sizing:border-box}
          .accordion summary{list-style:none;cursor:pointer}
          .accordion summary::-webkit-details-marker{display:none}
          .section-icon{width:29px;height:29px;display:grid;place-items:center;flex:0 0 29px;border-radius:8px;background:rgba(249,115,22,.07);color:#f97316;font-size:7px;font-weight:900}
          .section-head>div,.summary-copy{min-width:0;flex:1}
          .section-head strong,.summary-copy strong{display:block;font-size:9px;font-weight:850}
          .section-head small,.summary-copy small{display:block;margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:rgba(255,255,255,.24);font-size:6.5px}
          .section-mark{color:#22c55e;font-size:9px}
          .summary-chevron{width:23px;height:23px;display:grid;place-items:center;flex:0 0 23px;border-radius:7px;background:rgba(255,255,255,.035);color:rgba(255,255,255,.35);font-size:11px}
          .section-body{padding:10px;border-top:1px solid rgba(255,255,255,.045)}
          .preview-body{padding:9px;border-top:1px solid rgba(255,255,255,.045)}
          .preview-product,.preview-line,.wolf-total{display:flex;align-items:center;justify-content:space-between;gap:10px}
          .preview-product{padding:9px;border-radius:8px;background:rgba(249,115,22,.035);border:1px solid rgba(249,115,22,.08)}
          .preview-product span,.preview-line span,.wolf-total span{min-width:0;color:rgba(255,255,255,.42);font-size:7px}
          .preview-product strong,.preview-line strong,.wolf-total strong{color:#fff;font-size:9px;font-weight:850}
          .preview-line{padding:9px 2px;border-bottom:1px solid rgba(255,255,255,.045)}
          .preview-line .orange{color:#f97316}
          .wolf-total{margin-top:7px;padding:9px;border-radius:8px;background:rgba(34,197,94,.045);border:1px solid rgba(34,197,94,.10)}
          .wolf-total strong{color:#22c55e}
          .info-card{display:flex;align-items:flex-start;gap:8px;padding:9px;border:1px solid rgba(255,255,255,.045);border-radius:9px;background:rgba(255,255,255,.018)}
          .info-icon{width:18px;height:18px;display:grid;place-items:center;flex:0 0 18px;border-radius:50%;background:rgba(249,115,22,.08);color:#f97316;font-size:7px;font-weight:900}
          .info-card strong{display:block;font-size:7.5px;font-weight:850}
          .info-card p{margin:3px 0 0;color:rgba(255,255,255,.23);font-size:6.5px;line-height:1.45}
          @media(max-width:390px){.financial-page{padding-left:8px;padding-right:8px}.status-pill{display:none}.summary-strip{grid-template-columns:1fr 1fr}.summary-item.featured{grid-column:1/-1}}
        ` }} />
      </main>
    </PermissionGuard>
  );
}