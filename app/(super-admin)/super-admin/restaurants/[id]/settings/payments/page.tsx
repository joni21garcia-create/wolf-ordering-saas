"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import BackToSettings from "@/components/admin/BackToSettings";
import PermissionGuard from "@/components/auth/PermissionGuard";

export default function PaymentsPage() {
  const params = useParams();
  const restaurantId = params.id as string;
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [qrCount, setQrCount] = useState(0);
  const [bankAccounts, setBankAccounts] = useState<
    Array<{
      id: string;
      bank_name: string;
      account_holder: string;
      account_number: string;
      account_type: "savings" | "checking";
      active: boolean;
      sort_order: number;
    }>
  >([]);
  const [openSection, setOpenSection] = useState<string>("methods");

  const [form, setForm] = useState({
    accepts_cash: true,
    accepts_transfer: false,
    accepts_qr: false,
    accepts_delivery_payment: true,
    bank_name: "",
    account_holder: "",
    account_number: "",
    prep_time_min: 20,
    prep_time_max: 30,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data: restaurant } = await supabase
        .from("restaurants")
        .select("*")
        .eq("id", restaurantId)
        .maybeSingle();

      if (restaurant) {
        setForm({
          accepts_cash: restaurant.accepts_cash ?? true,
          accepts_transfer: restaurant.accepts_transfer ?? false,
          accepts_qr: restaurant.accepts_qr ?? false,
          accepts_delivery_payment: restaurant.accepts_delivery_payment ?? true,
          bank_name: restaurant.bank_name || "",
          account_holder: restaurant.account_holder || "",
          account_number: restaurant.account_number || "",
          prep_time_min: restaurant.prep_time_min || 20,
          prep_time_max: restaurant.prep_time_max || 30,
        });
      }

      const { count } = await supabase
        .from("restaurant_payment_qrs")
        .select("*", { count: "exact", head: true })
        .eq("restaurant_id", restaurantId);

      const { data: accounts, error: accountsError } = await supabase
        .from("restaurant_bank_accounts")
        .select(
          "id,bank_name,account_holder,account_number,account_type,active,sort_order"
        )
        .eq("restaurant_id", restaurantId)
        .order("sort_order", { ascending: true });

      if (accountsError) throw accountsError;

      setQrCount(count || 0);
      setBankAccounts(accounts || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleBankAccount = async (id: string, active: boolean) => {
    setBankAccounts((current) =>
      current.map((account) =>
        account.id === id ? { ...account, active: !active } : account
      )
    );

    const { error } = await supabase
      .from("restaurant_bank_accounts")
      .update({ active: !active })
      .eq("id", id)
      .eq("restaurant_id", restaurantId);

    if (error) {
      setBankAccounts((current) =>
        current.map((account) =>
          account.id === id ? { ...account, active } : account
        )
      );
      alert("No se pudo actualizar la cuenta.");
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      const { error } = await supabase
        .from("restaurants")
        .update({
          accepts_cash: form.accepts_cash,
          accepts_transfer: form.accepts_transfer,
          accepts_qr: form.accepts_qr,
          accepts_delivery_payment: form.accepts_delivery_payment,
          bank_name: form.bank_name,
          account_holder: form.account_holder,
          account_number: form.account_number,
          prep_time_min: form.prep_time_min,
          prep_time_max: form.prep_time_max,
        })
        .eq("id", restaurantId);

      if (error) throw error;
      alert("Configuración guardada exitosamente");
    } catch (error) {
      console.error(error);
      alert("Error al guardar la configuración");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="payments-page">
        <div className="loading">Cargando pagos...</div>
      </main>
    );
  }

  const activeMethods = [
    form.accepts_cash,
    form.accepts_transfer,
    form.accepts_qr,
  ].filter(Boolean).length;

  const activeAccounts = bankAccounts.filter((account) => account.active).length;

  const toggleSection = (section: string) => {
    setOpenSection((current) => (current === section ? "" : section));
  };

  return (
    <PermissionGuard permission="payments">
      <main className="payments-page">
        <div className="payments-shell">
          <header className="payments-header">
            <BackToSettings restaurantId={restaurantId} />

            <div className="header-row">
              <div>
                <span className="eyebrow">PAGOS PLUS</span>
                <h1>Centro de Pagos</h1>
                <p>Métodos, cuentas y QR en un solo lugar.</p>
              </div>

              <span className="status-dot" />
            </div>
          </header>

          <section className="hero">
            <div>
              <span className="hero-kicker">TODO LISTO PARA COBRAR</span>
              <h2>Configura cómo recibes tus pagos.</h2>
              <p>
                Activa métodos, administra tus cuentas bancarias y controla
                tus códigos QR.
              </p>
            </div>

            <div className="hero-icon">$</div>
          </section>

          <div className="stats">
            <div>
              <strong>{activeMethods}</strong>
              <span>Métodos activos</span>
            </div>
            <div>
              <strong>{activeAccounts}</strong>
              <span>Cuentas activas</span>
            </div>
            <div>
              <strong>{qrCount}</strong>
              <span>QR configurados</span>
            </div>
          </div>

          <div className="accordion-list">
            <section className={`accordion ${openSection === "methods" ? "open" : ""}`}>
              <button
                type="button"
                className="accordion-head"
                onClick={() => toggleSection("methods")}
              >
                <span className="section-icon">◉</span>
                <span className="section-copy">
                  <strong>Métodos de pago</strong>
                  <small>{activeMethods} activos</small>
                </span>
                <span className="chevron">
                  {openSection === "methods" ? "−" : "+"}
                </span>
              </button>

              {openSection === "methods" && (
                <div className="accordion-body">
                  <MethodRow
                    label="Pago en efectivo"
                    sub="El cliente paga al recibir o recoger."
                    value={form.accepts_cash}
                    onChange={(value: boolean) =>
                      setForm({ ...form, accepts_cash: value })
                    }
                  />

                  <MethodRow
                    label="Transferencia"
                    sub="Recibe transferencias bancarias."
                    value={form.accepts_transfer}
                    onChange={(value: boolean) =>
                      setForm({ ...form, accepts_transfer: value })
                    }
                  />

                  <MethodRow
                    label="Pago QR"
                    sub="Permite pagar con códigos QR."
                    value={form.accepts_qr}
                    onChange={(value: boolean) =>
                      setForm({ ...form, accepts_qr: value })
                    }
                  />

                </div>
              )}
            </section>

            <section className={`accordion ${openSection === "accounts" ? "open" : ""}`}>
              <button
                type="button"
                className="accordion-head"
                onClick={() => toggleSection("accounts")}
              >
                <span className="section-icon">₿</span>
                <span className="section-copy">
                  <strong>Cuentas bancarias</strong>
                  <small>
                    {bankAccounts.length} configuradas · {activeAccounts} activas
                  </small>
                </span>
                <span className="chevron">
                  {openSection === "accounts" ? "−" : "+"}
                </span>
              </button>

              {openSection === "accounts" && (
                <div className="accordion-body">
                  {bankAccounts.length === 0 ? (
                    <div className="empty">
                      <strong>No hay cuentas todavía</strong>
                      <small>
                        Agrega una cuenta para recibir transferencias.
                      </small>
                    </div>
                  ) : (
                    bankAccounts.map((account) => (
                      <div className="account-row" key={account.id}>
                        <div className="account-main">
                          <span className="account-icon">₿</span>
                          <div>
                            <strong>{account.bank_name}</strong>
                            <small>
                              {account.account_type === "checking"
                                ? "Cuenta corriente"
                                : "Cuenta de ahorros"}
                              {" · "}
                              {account.account_holder}
                            </small>
                            <span>
                              •••••••{account.account_number.slice(-4)}
                            </span>
                          </div>
                        </div>

                        <div className="row-actions">
                          <button
                            type="button"
                            className={
                              account.active ? "switch on" : "switch"
                            }
                            aria-pressed={account.active}
                            onClick={() =>
                              toggleBankAccount(
                                account.id,
                                account.active
                              )
                            }
                          >
                            <span />
                          </button>

                          <Link
                            href={`/admin/restaurant/${restaurantId}/payments/bank-accounts/${account.id}/edit`}
                            className="edit-button"
                            aria-label={`Editar ${account.bank_name}`}
                          >
                            ✎
                          </Link>
                        </div>
                      </div>
                    ))
                  )}

                  <Link
                    className="add-button"
                    href={`/admin/restaurant/${restaurantId}/payments/bank-accounts/new`}
                  >
                    <span>＋</span>
                    Agregar cuenta bancaria
                  </Link>
                </div>
              )}
            </section>

            <section className={`accordion ${openSection === "qrs" ? "open" : ""}`}>
              <button
                type="button"
                className="accordion-head"
                onClick={() => toggleSection("qrs")}
              >
                <span className="section-icon">▦</span>
                <span className="section-copy">
                  <strong>Códigos QR</strong>
                  <small>{qrCount} configurados</small>
                </span>
                <span className="chevron">
                  {openSection === "qrs" ? "−" : "+"}
                </span>
              </button>

              {openSection === "qrs" && (
                <div className="accordion-body">
                  <p className="section-note">
                    Gestiona los códigos QR que tus clientes utilizarán
                    durante el checkout.
                  </p>

                  <Link
                    className="add-button"
                    href={`/super-admin/restaurants/${restaurantId}/settings/payments/qrs`}
                  >
                    <span>▦</span>
                    Administrar QRs
                  </Link>
                </div>
              )}
            </section>

          </div>

          <button
            type="button"
            onClick={saveSettings}
            disabled={saving}
            className="save-button"
          >
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>

        <style jsx global>{`
          .payments-page {
            min-height:100dvh;
            width:100%;
            box-sizing:border-box;
            padding:14px 11px 34px;
            background:#080808;
            color:#fff;
            font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
          }

          .payments-shell {
            width:100%;
            max-width:760px;
            margin:0 auto;
          }

          .payments-header {
            margin-bottom:9px;
          }

          .header-row {
            display:flex;
            align-items:center;
            justify-content:space-between;
            gap:8px;
            margin-top:8px;
          }

          .eyebrow,
          .hero-kicker {
            color:#f97316;
            font-size:7px;
            font-weight:900;
            letter-spacing:1.25px;
          }

          .header-row h1 {
            margin:2px 0 0;
            font-size:23px;
            line-height:1.05;
            letter-spacing:-.55px;
            font-weight:900;
          }

          .header-row p {
            margin:4px 0 0;
            color:rgba(255,255,255,.34);
            font-size:8px;
          }

          .status-dot {
            width:7px;
            height:7px;
            border-radius:50%;
            background:#22c55e;
            box-shadow:0 0 0 4px rgba(34,197,94,.07);
            flex-shrink:0;
          }

          .hero {
            display:flex;
            align-items:center;
            justify-content:space-between;
            gap:10px;
            min-height:118px;
            padding:15px;
            margin:10px 0 7px;
            border:1px solid rgba(249,115,22,.12);
            border-radius:13px;
            background:linear-gradient(135deg,#17100b,#0d0d0d 62%);
            box-sizing:border-box;
          }

          .hero h2 {
            max-width:390px;
            margin:4px 0 0;
            font-size:17px;
            line-height:1.08;
            letter-spacing:-.35px;
          }

          .hero p {
            max-width:390px;
            margin:5px 0 0;
            color:rgba(255,255,255,.38);
            font-size:8px;
            line-height:1.45;
          }

          .hero-icon {
            width:43px;
            height:43px;
            display:grid;
            place-items:center;
            flex-shrink:0;
            border-radius:12px;
            background:#f97316;
            color:#fff;
            font-size:21px;
            font-weight:900;
            box-shadow:0 8px 22px rgba(249,115,22,.16);
          }

          .stats {
            display:grid;
            grid-template-columns:repeat(3,1fr);
            gap:5px;
            margin-bottom:7px;
          }

          .stats div {
            min-width:0;
            padding:8px 6px;
            border:1px solid rgba(255,255,255,.05);
            border-radius:9px;
            background:#101010;
            text-align:center;
          }

          .stats strong {
            display:block;
            color:#f97316;
            font-size:14px;
            line-height:1;
          }

          .stats span {
            display:block;
            margin-top:3px;
            overflow:hidden;
            text-overflow:ellipsis;
            white-space:nowrap;
            color:rgba(255,255,255,.28);
            font-size:6px;
            text-transform:uppercase;
            letter-spacing:.35px;
          }

          .accordion-list {
            display:flex;
            flex-direction:column;
            gap:5px;
          }

          .accordion {
            overflow:hidden;
            border:1px solid rgba(255,255,255,.055);
            border-radius:10px;
            background:#101010;
          }

          .accordion.open {
            border-color:rgba(249,115,22,.17);
          }

          .accordion-head {
            width:100%;
            min-height:51px;
            display:flex;
            align-items:center;
            gap:8px;
            padding:7px 9px;
            border:0;
            background:transparent;
            color:#fff;
            text-align:left;
            cursor:pointer;
          }

          .section-icon {
            width:29px;
            height:29px;
            display:grid;
            place-items:center;
            flex-shrink:0;
            border-radius:8px;
            background:rgba(249,115,22,.07);
            color:#f97316;
            font-size:12px;
          }

          .section-copy {
            min-width:0;
            flex:1;
          }

          .section-copy strong {
            display:block;
            font-size:9px;
            font-weight:850;
          }

          .section-copy small {
            display:block;
            margin-top:2px;
            overflow:hidden;
            text-overflow:ellipsis;
            white-space:nowrap;
            color:rgba(255,255,255,.25);
            font-size:7px;
          }

          .chevron {
            width:24px;
            height:24px;
            display:grid;
            place-items:center;
            flex-shrink:0;
            border-radius:7px;
            background:rgba(255,255,255,.035);
            color:rgba(255,255,255,.42);
            font-size:13px;
          }

          .open .chevron {
            color:#f97316;
            background:rgba(249,115,22,.07);
          }

          .accordion-body {
            padding:0 7px 7px;
            border-top:1px solid rgba(255,255,255,.045);
          }

          .method-row,
          .account-row {
            display:flex;
            align-items:center;
            justify-content:space-between;
            gap:8px;
            min-width:0;
            padding:8px 2px;
          }

          .method-row + .method-row,
          .account-row + .account-row {
            border-top:1px solid rgba(255,255,255,.045);
          }

          .method-copy,
          .account-main {
            min-width:0;
            flex:1;
          }

          .method-copy strong,
          .account-main strong {
            display:block;
            font-size:8px;
            font-weight:800;
          }

          .method-copy small,
          .account-main small {
            display:block;
            margin-top:2px;
            overflow:hidden;
            text-overflow:ellipsis;
            white-space:nowrap;
            color:rgba(255,255,255,.23);
            font-size:6.5px;
          }

          .account-main {
            display:flex;
            align-items:center;
            gap:7px;
          }

          .account-icon {
            width:29px;
            height:29px;
            display:grid;
            place-items:center;
            flex-shrink:0;
            border-radius:7px;
            background:rgba(255,255,255,.035);
            color:#f97316;
            font-size:11px;
          }

          .account-main > div {
            min-width:0;
          }

          .account-main > div > span {
            display:block;
            margin-top:2px;
            color:rgba(255,255,255,.2);
            font-size:6.5px;
          }

          .row-actions {
            display:flex;
            align-items:center;
            gap:4px;
            flex-shrink:0;
          }

          .switch {
            width:32px;
            height:18px;
            padding:2px;
            border:0;
            border-radius:999px;
            background:#292929;
            cursor:pointer;
            box-sizing:border-box;
          }

          .switch span {
            display:block;
            width:14px;
            height:14px;
            border-radius:50%;
            background:#fff;
            transition:transform .15s;
          }

          .switch.on {
            background:#16a34a;
          }

          .switch.on span {
            transform:translateX(14px);
          }

          .edit-button {
            width:27px;
            height:27px;
            display:grid;
            place-items:center;
            border:1px solid rgba(255,255,255,.055);
            border-radius:7px;
            background:rgba(255,255,255,.035);
            color:rgba(255,255,255,.58);
            text-decoration:none;
            font-size:10px;
          }

          .section-note {
            margin:9px 2px 7px;
            color:rgba(255,255,255,.3);
            font-size:7.5px;
            line-height:1.45;
          }

          .add-button {
            min-height:33px;
            display:flex;
            align-items:center;
            justify-content:center;
            gap:4px;
            margin-top:5px;
            border:1px solid rgba(249,115,22,.17);
            border-radius:7px;
            background:rgba(249,115,22,.055);
            color:#f97316;
            text-decoration:none;
            font-size:8px;
            font-weight:850;
          }

          .add-button span {
            font-size:12px;
          }

          .empty {
            padding:16px 8px;
            text-align:center;
          }

          .empty strong {
            display:block;
            color:rgba(255,255,255,.55);
            font-size:8px;
          }

          .empty small {
            display:block;
            margin-top:3px;
            color:rgba(255,255,255,.23);
            font-size:7px;
          }

          .time-grid {
            display:grid;
            grid-template-columns:1fr 1fr;
            gap:5px;
            padding-top:8px;
          }

          .time-grid label span {
            display:block;
            margin:0 0 3px 2px;
            color:rgba(255,255,255,.24);
            font-size:6px;
            font-weight:800;
            text-transform:uppercase;
          }

          .time-grid input {
            width:100%;
            height:32px;
            box-sizing:border-box;
            border:1px solid rgba(255,255,255,.06);
            border-radius:7px;
            background:#0a0e14;
            color:#fff;
            outline:none;
            padding:6px 7px;
            font:700 8px system-ui,sans-serif;
          }

          .save-button {
            width:100%;
            min-height:39px;
            margin-top:7px;
            border:0;
            border-radius:8px;
            background:#f97316;
            color:#fff;
            font:850 8px system-ui,sans-serif;
            cursor:pointer;
          }

          .save-button:disabled {
            opacity:.55;
            cursor:not-allowed;
          }

          .loading {
            min-height:100dvh;
            display:grid;
            place-items:center;
            color:rgba(255,255,255,.3);
            font-size:9px;
          }

          @media(max-width:390px) {
            .payments-page {
              padding-left:8px;
              padding-right:8px;
            }

            .hero {
              min-height:108px;
              padding:12px;
            }

            .hero h2 {
              font-size:15px;
            }

            .hero-icon {
              width:37px;
              height:37px;
              border-radius:10px;
            }
          }
        `}</style>
      </main>
    </PermissionGuard>
  );
}

function MethodRow({
  label,
  sub,
  value,
  onChange,
}: {
  label: string;
  sub: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="method-row">
      <div className="method-copy">
        <strong>{label}</strong>
        <small>{sub}</small>
      </div>

      <button
        type="button"
        className={value ? "switch on" : "switch"}
        aria-pressed={value}
        onClick={() => onChange(!value)}
      >
        <span />
      </button>
    </div>
  );
}

function StatCard({ title, value }: any) {
  return (
    <div style={{ ...cardStyle, padding: "18px 20px" }}>
      <h2 style={{ margin: 0, fontSize: "24px", fontWeight: "800", color: "#f97316" }}>{value}</h2>
      <p style={{ color: "#71717a", margin: "4px 0 0", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: "600" }}>{title}</p>
    </div>
  );
}

function Section({ title, children }: any) {
  return (
    <div style={cardStyle}>
      <h2 style={{ marginBottom: "16px", fontSize: "16px", fontWeight: "700", color: "#fff", letterSpacing: "-0.3px", marginTop: 0 }}>{title}</h2>
      {children}
    </div>
  );
}

function Switch({ label, value, onChange }: any) {
  return (
    <div style={{ 
      display: "flex", 
      justifyContent: "space-between", 
      alignItems: "center", 
      padding: "12px 14px", 
      background: "#161616", 
      border: "1px solid #262626", 
      borderRadius: "12px",
      marginBottom: "8px"
    }}>
      <span style={{ fontSize: "13.5px", fontWeight: "500", color: "#e4e4e7" }}>{label}</span>
      <div
        onClick={() => onChange(!value)}
        style={{
          width: "42px",
          height: "22px",
          background: value ? "#16a34a" : "#2d2d2d",
          borderRadius: "11px",
          position: "relative",
          cursor: "pointer",
          transition: "background-color 0.2s ease",
          flexShrink: 0
        }}
      >
        <div
          style={{
            width: "16px",
            height: "16px",
            background: "#fff",
            borderRadius: "50%",
            position: "absolute",
            top: "3px",
            left: value ? "23px" : "3px",
            transition: "left 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
          }}
        />
      </div>
    </div>
  );
}

const cardStyle = { 
  background: "#121212", 
  border: "1px solid #222", 
  borderRadius: "20px", 
  padding: "20px",
  boxSizing: "border-box" as const
};

const inputStyle = { 
  width: "100%", 
  padding: "12px 14px", 
  borderRadius: "12px", 
  background: "#161616", 
  border: "1px solid #262626", 
  color: "#fff",
  fontSize: "14px",
  outline: "none",
  boxSizing: "border-box" as const
};

const buttonBase = { 
  width: "100%", 
  padding: "16px", 
  borderRadius: "14px", 
  border: "none", 
  cursor: "pointer", 
  fontWeight: "600" as const, 
  color: "#fff",
  fontSize: "14.5px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxSizing: "border-box" as const,
  transition: "0.2s ease"
};

const buttonOrange = { ...buttonBase, background: "#f97316" };
const buttonGreen = { ...buttonBase, background: "#fff", color: "#000", fontWeight: "700" };