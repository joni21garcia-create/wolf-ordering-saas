"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

type PaymentQR = {
  id: string; name: string; qr_image_url: string;
  account_holder: string | null; account_number: string | null;
  active: boolean; sort_order: number | null;
};

type Settings = {
  cash: boolean;
  transfer: boolean;
  qr: boolean;
  min: number;
  max: number;
};

type BankAccount = {
  id: string;
  bank_name: string;
  account_type: "savings" | "checking";
  account_holder: string;
  account_number: string;
  active: boolean;
  sort_order: number | null;
};

const defaults: Settings = {
  cash: true,
  transfer: true,
  qr: true,
  min: 10,
  max: 20,
};

export default function PaymentsPlusPage() {
  const params = useParams();
  const router = useRouter();
  const restaurantId = params.restaurantId as string;
  const [qrs, setQrs] = useState<PaymentQR[]>([]);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [settings, setSettings] = useState<Settings>(defaults);
  const [open, setOpen] = useState("methods");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let alive = true;
    async function load() {
      const [
        { data: restaurantData, error: restaurantError },
        { data: qrData },
        { data: bankData },
      ] = await Promise.all([
        supabase
          .from("restaurants")
          .select("accepts_cash,accepts_transfer,accepts_qr")
          .eq("id", restaurantId)
          .maybeSingle(),
        supabase
          .from("restaurant_payment_qrs")
          .select("id,name,qr_image_url,account_holder,account_number,active,sort_order")
          .eq("restaurant_id", restaurantId)
          .order("sort_order", { ascending: true }),
        supabase
          .from("restaurant_bank_accounts")
          .select("id,bank_name,account_type,account_holder,account_number,active,sort_order")
          .eq("restaurant_id", restaurantId)
          .order("sort_order", { ascending: true }),
      ]);

      if (alive) {
        if (!restaurantError && restaurantData) {
          setSettings((current) => ({
            ...current,
            cash:
              restaurantData.accepts_cash ??
              current.cash,
            transfer:
              restaurantData.accepts_transfer ??
              current.transfer,
            qr:
              restaurantData.accepts_qr ??
              current.qr,
          }));
        }

        setQrs((qrData || []) as PaymentQR[]);
        setBankAccounts((bankData || []) as BankAccount[]);
        setLoading(false);
      }
    }
    if (restaurantId) load();
    return () => { alive = false; };
  }, [restaurantId]);

  const activeQrs = useMemo(() => qrs.filter((q) => q.active), [qrs]);
  const activeBankAccounts = useMemo(
    () => bankAccounts.filter((account) => account.active),
    [bankAccounts]
  );
  const setValue = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((s) => ({ ...s, [key]: value })); setSaved(false);
  };
  async function save() {
    setSaving(true);
    setSaved(false);

    const { error } = await supabase
      .from("restaurants")
      .update({
        accepts_cash: settings.cash,
        accepts_transfer: settings.transfer,
        accepts_qr: settings.qr,
      })
      .eq("id", restaurantId);

    setSaving(false);

    if (error) {
      console.error(
        "Error guardando métodos de pago:",
        error
      );
      alert(
        "No se pudieron guardar los métodos de pago."
      );
      return;
    }

    setSaved(true);
  }

  return (
    <main className="pp">
      <style>{styles}</style>
      <header className="bar">
        <button className="back" onClick={() => router.push(`/admin/restaurant/${restaurantId}`)}>‹</button>
        <div><small>RESTAURANTE</small><strong>Pagos</strong></div><span className="live" />
      </header>

      <section className="hero">
        <div><b>PAYMENTS PLUS</b><h1>Todo listo para cobrar.</h1><p>Métodos, cuenta y QR en un solo lugar.</p></div>
        <div className="coin">$</div>
      </section>

      <div className="stats">
        <Stat label="QR activos" value={loading ? "—" : String(activeQrs.length)} />
        <Stat label="Cuentas" value={loading ? "—" : String(activeBankAccounts.length)} />
        <Stat label="Métodos" value={String([settings.cash, settings.transfer, settings.qr].filter(Boolean).length)} />
      </div>

      <div className="stack">
        <Accordion title="Métodos de pago" sub="Lo que puede elegir tu cliente" icon="↔" open={open === "methods"} onClick={() => setOpen(open === "methods" ? "" : "methods")}>
          <Method label="Efectivo" sub="Pago al recibir" active={settings.cash} onClick={() => setValue("cash", !settings.cash)} />
          <Method label="Transferencia" sub="Depósito bancario" active={settings.transfer} onClick={() => setValue("transfer", !settings.transfer)} />
          <Method label="Código QR" sub={`${activeQrs.length} QR activos`} active={settings.qr} onClick={() => setValue("qr", !settings.qr)} />
        </Accordion>

        <Accordion
          title="Cuentas bancarias"
          sub={
            loading
              ? "Cargando..."
              : `${bankAccounts.length} configuradas · ${activeBankAccounts.length} activas`
          }
          icon="₿"
          badge={loading ? undefined : activeBankAccounts.length}
          open={open === "bank"}
          onClick={() => setOpen(open === "bank" ? "" : "bank")}
        >
          <div className="banklist">
            {!loading && bankAccounts.length === 0 ? (
              <div className="empty">
                <strong>No hay cuentas todavía</strong>
                <small>Agrega una cuenta para recibir transferencias.</small>
              </div>
            ) : (
              bankAccounts.map((account) => (
                <div className="bank" key={account.id}>
                  <div className="bank-icon">₿</div>
                  <div className="bank-info">
                    <strong>{account.bank_name}</strong>
                    <small>
                      {account.account_type === "checking"
                        ? "Cuenta corriente"
                        : "Cuenta de ahorros"}
                    </small>
                    <span>{account.account_holder}</span>
                    <b className={account.active ? "active" : ""}>
                      {account.active ? "● Activa" : "○ Inactiva"}
                    </b>
                  </div>
                  <Link
                    href={`/admin/restaurant/${restaurantId}/payments/bank-accounts/${account.id}/edit`}
                    className="bank-edit"
                    aria-label={`Editar ${account.bank_name}`}
                  >
                    ›
                  </Link>
                </div>
              ))
            )}
          </div>

          <Link
            className="add"
            href={`/admin/restaurant/${restaurantId}/payments/bank-accounts/new`}
          >
            ＋ Agregar cuenta bancaria
          </Link>
        </Accordion>

        <Accordion title="Tiempo de preparación" sub="Estimación mostrada al cliente" icon="◷" open={open === "time"} onClick={() => setOpen(open === "time" ? "" : "time")}>
          <div className="time">
            <label className="field"><span>Mínimo</span><input type="number" min="1" value={settings.min} onChange={(e) => setValue("min", Number(e.target.value))} /></label>
            <em>—</em>
            <label className="field"><span>Máximo</span><input type="number" min="1" value={settings.max} onChange={(e) => setValue("max", Number(e.target.value))} /></label>
          </div>
        </Accordion>

        <Accordion title="Códigos QR" sub={loading ? "Cargando..." : `${qrs.length} configurados · ${activeQrs.length} activos`} icon="▦" badge={loading ? undefined : activeQrs.length} open={open === "qrs"} onClick={() => setOpen(open === "qrs" ? "" : "qrs")}>
          <div className="qrlist">
            {!loading && qrs.length === 0 ? <div className="empty"><strong>No hay QRs todavía</strong><small>Agrega uno para empezar a recibir pagos.</small></div> : qrs.map((qr) => (
              <div className="qr" key={qr.id}>
                <img src={qr.qr_image_url} alt={qr.name} />
                <div><strong>{qr.name}</strong><small>{qr.account_holder || "Sin titular"}</small><b className={qr.active ? "active" : ""}>{qr.active ? "● Activo" : "○ Inactivo"}</b></div>
                <Link href={`/admin/restaurant/${restaurantId}/payments/qrs/${qr.id}/edit`}>›</Link>
              </div>
            ))}
          </div>
          <Link className="add" href={`/admin/restaurant/${restaurantId}/payments/qrs/new`}>＋ Agregar nuevo QR</Link>
        </Accordion>
      </div>

      <div className="savebar"><button className={saved ? "save saved" : "save"} disabled={saving} onClick={save}>{saving ? "Guardando..." : saved ? "✓ Cambios guardados" : "Guardar cambios"}</button></div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) { return <div className="stat"><small>{label}</small><strong>{value}</strong></div>; }
function Method({ label, sub, active, onClick }: { label: string; sub: string; active: boolean; onClick: () => void }) {
  return <button className="method" onClick={onClick}><span><strong>{label}</strong><small>{sub}</small></span><i className={active ? "switch on" : "switch"}><b /></i></button>;
}
function Accordion({ title, sub, icon, badge, open, onClick, children }: { title: string; sub: string; icon: string; badge?: number; open: boolean; onClick: () => void; children: React.ReactNode }) {
  return <section className={open ? "acc open" : "acc"}><button className="acchead" onClick={onClick}><i>{icon}</i><span><strong>{title}</strong><small>{sub}</small></span>{badge !== undefined && <em>{badge}</em>}<b>{open ? "−" : "+"}</b></button>{open && <div className="body">{children}</div>}</section>;
}

const styles = `
.pp{min-height:100dvh;max-width:760px;margin:auto;padding:14px 13px 82px;background:#080808;color:#fff;box-sizing:border-box;font-family:inherit}.bar{height:40px;display:flex;align-items:center;gap:9px}.back{width:34px;height:34px;border:1px solid #202020;border-radius:10px;background:#101010;color:#fff;font-size:25px;line-height:1;cursor:pointer}.bar div{flex:1}.bar small{display:block;color:#555;font-size:7px;font-weight:900;letter-spacing:1.4px}.bar strong{display:block;margin-top:2px;font-size:14px}.live{width:7px;height:7px;border-radius:50%;background:#22c55e;box-shadow:0 0 0 4px rgba(34,197,94,.08)}
.hero{min-height:124px;margin:13px 0 9px;padding:18px;display:flex;align-items:center;position:relative;overflow:hidden;border:1px solid rgba(249,115,22,.13);border-radius:17px;background:radial-gradient(circle at 90% 20%,rgba(249,115,22,.14),transparent 38%),linear-gradient(145deg,#17110d,#0d0d0d);box-sizing:border-box}.hero b{color:#f97316;font-size:8px;letter-spacing:1.5px}.hero h1{margin:6px 0 0;font-size:22px;line-height:1.08;letter-spacing:-.6px}.hero p{margin:7px 0 0;color:#707070;font-size:10px}.coin{position:absolute;right:23px;width:48px;height:48px;display:grid;place-items:center;border:1px solid rgba(249,115,22,.3);border-radius:15px;background:#f97316;font-size:19px;font-weight:900;box-shadow:0 12px 35px rgba(249,115,22,.18)}
.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin-bottom:9px}.stat{padding:11px 12px;border:1px solid #191919;border-radius:12px;background:#111}.stat small{display:block;color:#606060;font-size:9px}.stat strong{display:block;margin-top:4px;font-size:19px;line-height:1;color:#f97316}.stack{display:grid;gap:8px}.acc{border:1px solid #1a1a1a;border-radius:14px;background:#111;overflow:hidden}.acc.open{border-color:rgba(249,115,22,.22)}.acchead{width:100%;min-height:64px;display:flex;align-items:center;gap:10px;padding:10px 11px;border:0;background:none;color:#fff;text-align:left;cursor:pointer}.acchead>i{width:36px;height:36px;display:grid;place-items:center;flex:0 0 36px;border-radius:10px;background:rgba(249,115,22,.09);color:#f97316;font-style:normal;font-size:15px}.acchead>span{min-width:0;flex:1}.acchead strong{display:block;font-size:12px}.acchead small{display:block;margin-top:3px;color:#666;overflow:hidden;font-size:9px;text-overflow:ellipsis;white-space:nowrap}.acchead em{min-width:21px;height:21px;display:grid;place-items:center;padding:0 5px;border-radius:999px;background:rgba(249,115,22,.1);color:#f97316;font-style:normal;font-size:9px}.acchead>b{width:24px;height:24px;display:grid;place-items:center;border-radius:7px;background:#181818;color:#888;font-size:15px}.open .acchead>b{background:rgba(249,115,22,.1);color:#f97316}.body{padding:0 11px 12px;border-top:1px solid #191919}
.method{width:100%;min-height:50px;display:flex;align-items:center;justify-content:space-between;padding:8px 10px;margin-top:6px;border:1px solid #181818;border-radius:10px;background:#0d0d0d;color:#fff;text-align:left;cursor:pointer}.method span strong,.method span small{display:block}.method span strong{font-size:11px}.method span small{margin-top:3px;color:#666;font-size:9px}.switch{width:34px;height:20px;padding:2px;display:block;flex:0 0 34px;border-radius:999px;background:#292929;box-sizing:border-box}.switch b{display:block;width:16px;height:16px;border-radius:50%;background:#fff;transition:transform .15s}.switch.on{background:#16a34a}.switch.on b{transform:translateX(14px)}
.field{display:block;margin-top:10px}.field span{display:block;margin-bottom:5px;color:#777;font-size:9px;font-weight:800}.field input{width:100%;height:39px;padding:0 10px;border:1px solid #1b1b1b;border-radius:9px;background:#0d0d0d;color:#fff;outline:none;font-size:11px;box-sizing:border-box}.field input:focus{border-color:rgba(249,115,22,.45)}.field input::placeholder{color:#3d3d3d}.time{display:grid;grid-template-columns:1fr 18px 1fr;align-items:end;gap:5px}.time>em{padding-bottom:12px;color:#555;text-align:center;font-style:normal}
.banklist{display:grid;gap:6px;padding-top:10px}.bank{min-height:72px;display:flex;align-items:center;gap:9px;padding:8px;border:1px solid #181818;border-radius:11px;background:#0d0d0d}.bank-icon{width:40px;height:40px;display:grid;place-items:center;flex:0 0 40px;border-radius:10px;background:rgba(249,115,22,.09);color:#f97316;font-size:14px;font-weight:900}.bank-info{min-width:0;flex:1}.bank-info strong,.bank-info small,.bank-info span,.bank-info b{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.bank-info strong{font-size:11px}.bank-info small{margin-top:2px;color:#f97316;font-size:8px;font-weight:800}.bank-info span{margin-top:3px;color:#666;font-size:8px}.bank-info b{margin-top:3px;color:#777;font-size:8px}.bank-info b.active{color:#22c55e}.bank-edit{width:27px;height:27px;display:grid;place-items:center;flex:0 0 27px;border-radius:8px;background:#181818;color:#aaa;text-decoration:none;font-size:17px}
.qrlist{display:grid;gap:6px;padding-top:10px}.qr{min-height:64px;display:flex;align-items:center;gap:9px;padding:7px;border:1px solid #181818;border-radius:11px;background:#0d0d0d}.qr>img{width:48px;height:48px;object-fit:contain;flex:0 0 48px;border-radius:8px;background:#fff}.qr>div{min-width:0;flex:1}.qr strong,.qr small,.qr b{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.qr strong{font-size:11px}.qr small{margin-top:3px;color:#666;font-size:9px}.qr b{margin-top:4px;color:#777;font-size:8px}.qr b.active{color:#22c55e}.qr>a{width:27px;height:27px;display:grid;place-items:center;border-radius:8px;background:#181818;color:#aaa;text-decoration:none;font-size:17px}.add{min-height:39px;display:flex;align-items:center;justify-content:center;margin-top:9px;border:1px dashed rgba(249,115,22,.28);border-radius:9px;background:rgba(249,115,22,.035);color:#f97316;text-decoration:none;font-size:10px;font-weight:850}.empty{min-height:90px;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#666}.empty strong{font-size:10px}.empty small{margin-top:4px;font-size:8px}
.savebar{position:fixed;left:50%;bottom:0;width:min(760px,100%);padding:9px 13px calc(9px + env(safe-area-inset-bottom));transform:translateX(-50%);background:linear-gradient(to top,#080808 72%,transparent);box-sizing:border-box;z-index:20}.save{width:100%;height:43px;border:0;border-radius:10px;background:#f97316;color:#fff;font-size:11px;font-weight:900;cursor:pointer}.save.saved{background:#16a34a}.save:disabled{opacity:.6}@media(min-width:700px){.pp{padding-top:25px}.hero{min-height:145px}.hero h1{font-size:25px}}
`;