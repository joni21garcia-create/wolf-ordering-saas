"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

type AccountType = "savings" | "checking";

type BankAccount = {
  id: string;
  bank_name: string;
  account_type: AccountType;
  account_holder: string;
  account_number: string;
  active: boolean;
};

export default function EditBankAccountPage() {
  const params = useParams();
  const router = useRouter();

  const restaurantId = params.restaurantId as string;
  const accountId = params.accountId as string;

  const [account, setAccount] =
    useState<BankAccount | null>(null);

  const [bankName, setBankName] = useState("");
  const [accountType, setAccountType] =
    useState<AccountType>("savings");
  const [accountHolder, setAccountHolder] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [active, setActive] = useState(true);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAccount() {
      if (!restaurantId || !accountId) return;

      setLoading(true);
      setError("");

      const { data, error: fetchError } =
        await supabase
          .from("restaurant_bank_accounts")
          .select(
            "id,bank_name,account_type,account_holder,account_number,active"
          )
          .eq("id", accountId)
          .eq("restaurant_id", restaurantId)
          .single();

      if (fetchError) {
        console.error(fetchError);
        setError(
          "No se pudo cargar la cuenta bancaria."
        );
        setLoading(false);
        return;
      }

      const bankAccount = data as BankAccount;

      setAccount(bankAccount);
      setBankName(bankAccount.bank_name);
      setAccountType(bankAccount.account_type);
      setAccountHolder(bankAccount.account_holder);
      setAccountNumber(bankAccount.account_number);
      setActive(bankAccount.active);

      setLoading(false);
    }

    loadAccount();
  }, [restaurantId, accountId]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setError("");

    if (!bankName.trim()) {
      setError("Escribe el nombre del banco.");
      return;
    }

    if (!accountHolder.trim()) {
      setError("Escribe el titular de la cuenta.");
      return;
    }

    if (!accountNumber.trim()) {
      setError("Escribe el número de cuenta.");
      return;
    }

    try {
      setSaving(true);

      const { error: updateError } =
        await supabase
          .from("restaurant_bank_accounts")
          .update({
            bank_name: bankName.trim(),
            account_type: accountType,
            account_holder: accountHolder.trim(),
            account_number: accountNumber.trim(),
            active,
          })
          .eq("id", accountId)
          .eq("restaurant_id", restaurantId);

      if (updateError) {
        throw updateError;
      }

      router.push(
        `/admin/restaurant/${restaurantId}/payments`
      );

      router.refresh();
    } catch (err) {
      console.error(
        "Error actualizando cuenta bancaria:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "No se pudo actualizar la cuenta."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="loading-page">
        <style>{loadingStyles}</style>

        <div className="loader" />

        <span>Cargando cuenta...</span>
      </main>
    );
  }

  if (!account && error) {
    return (
      <main className="loading-page">
        <style>{loadingStyles}</style>

        <strong>No se encontró la cuenta.</strong>

        <button
          className="back-error"
          onClick={() =>
            router.push(
              `/admin/restaurant/${restaurantId}/payments`
            )
          }
        >
          Volver a pagos
        </button>
      </main>
    );
  }

  return (
    <main className="bank-page">
      <style>{styles}</style>

      <header className="topbar">
        <button
          type="button"
          className="back"
          onClick={() =>
            router.push(
              `/admin/restaurant/${restaurantId}/payments`
            )
          }
          aria-label="Volver a pagos"
        >
          ‹
        </button>

        <div className="title">
          <small>PAGOS PLUS</small>
          <strong>Editar cuenta</strong>
        </div>

        <span className="dot" />
      </header>

      <section className="hero">
        <div className="hero-copy">
          <span className="kicker">
            CUENTA BANCARIA
          </span>

          <h1>Edita tu cuenta.</h1>

          <p>
            Actualiza los datos de esta cuenta de
            transferencia.
          </p>
        </div>

        <div className="hero-icon">
          ₿
        </div>
      </section>

      <form onSubmit={handleSubmit}>
        <section className="card">
          <div className="section-head">
            <span className="icon">
              ₿
            </span>

            <div>
              <strong>Datos de la cuenta</strong>

              <small>
                Información asociada a este método.
              </small>
            </div>
          </div>

          <label className="field">
            <span>Banco</span>

            <input
              value={bankName}
              onChange={(event) =>
                setBankName(event.target.value)
              }
              placeholder="Ej. Banco Pichincha"
              autoComplete="organization"
            />
          </label>

          <div className="field">
            <span>Tipo de cuenta</span>

            <div className="type-grid">
              <button
                type="button"
                className={
                  accountType === "savings"
                    ? "type active"
                    : "type"
                }
                onClick={() =>
                  setAccountType("savings")
                }
              >
                <span className="radio">
                  {accountType === "savings"
                    ? "✓"
                    : ""}
                </span>

                <span>
                  <strong>Ahorros</strong>

                  <small>
                    Cuenta de ahorros
                  </small>
                </span>
              </button>

              <button
                type="button"
                className={
                  accountType === "checking"
                    ? "type active"
                    : "type"
                }
                onClick={() =>
                  setAccountType("checking")
                }
              >
                <span className="radio">
                  {accountType === "checking"
                    ? "✓"
                    : ""}
                </span>

                <span>
                  <strong>Corriente</strong>

                  <small>
                    Cuenta corriente
                  </small>
                </span>
              </button>
            </div>
          </div>

          <label className="field">
            <span>Titular</span>

            <input
              value={accountHolder}
              onChange={(event) =>
                setAccountHolder(event.target.value)
              }
              placeholder="Nombre del titular"
              autoComplete="name"
            />
          </label>

          <label className="field">
            <span>Número de cuenta</span>

            <input
              value={accountNumber}
              onChange={(event) =>
                setAccountNumber(event.target.value)
              }
              placeholder="Número de cuenta"
              inputMode="numeric"
            />
          </label>
        </section>

        <section className="card compact">
          <div className="active-row">
            <div>
              <strong>Cuenta activa</strong>

              <small>
                Disponible para transferencias.
              </small>
            </div>

            <button
              type="button"
              className={
                active
                  ? "switch on"
                  : "switch"
              }
              aria-pressed={active}
              onClick={() =>
                setActive((value) => !value)
              }
            >
              <span />
            </button>
          </div>
        </section>

        {error ? (
          <div className="error">
            {error}
          </div>
        ) : null}

        <div className="actions">
          <button
            type="button"
            className="cancel"
            disabled={saving}
            onClick={() =>
              router.push(
                `/admin/restaurant/${restaurantId}/payments`
              )
            }
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="save"
            disabled={saving}
          >
            {saving
              ? "Guardando..."
              : "Guardar cambios"}
          </button>
        </div>
      </form>
    </main>
  );
}

const loadingStyles = `
.loading-page {
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 10px;
  background: #080808;
  color: #555;
  font-size: 9px;
}

.loader {
  width: 22px;
  height: 22px;
  border: 2px solid #222;
  border-top-color: #f97316;
  border-radius: 50%;
  animation: spin .7s linear infinite;
}

.back-error {
  margin-top: 8px;
  height: 36px;
  padding: 0 14px;
  border: 1px solid #222;
  border-radius: 9px;
  background: #111;
  color: #aaa;
  font-size: 9px;
  cursor: pointer;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
`;

const styles = `
.bank-page {
  min-height: 100dvh;
  max-width: 760px;
  margin: auto;
  padding: 14px 13px 34px;
  background: #080808;
  color: #fff;
  box-sizing: border-box;
}

.topbar {
  height: 40px;
  display: flex;
  align-items: center;
  gap: 9px;
}

.back {
  width: 34px;
  height: 34px;
  border: 1px solid #202020;
  border-radius: 10px;
  background: #101010;
  color: #fff;
  font-size: 25px;
  line-height: 1;
  cursor: pointer;
}

.title {
  flex: 1;
}

.title small {
  display: block;
  color: #555;
  font-size: 7px;
  font-weight: 900;
  letter-spacing: 1.4px;
}

.title strong {
  display: block;
  margin-top: 2px;
  font-size: 14px;
}

.dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #22c55e;
  box-shadow:
    0 0 0 4px rgba(34,197,94,.08);
}

.hero {
  min-height: 124px;
  margin: 13px 0 9px;
  padding: 18px;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(249,115,22,.13);
  border-radius: 17px;
  background:
    radial-gradient(
      circle at 90% 20%,
      rgba(249,115,22,.14),
      transparent 38%
    ),
    linear-gradient(
      145deg,
      #17110d,
      #0d0d0d
    );
  box-sizing: border-box;
}

.hero-copy {
  position: relative;
  z-index: 2;
}

.kicker {
  color: #f97316;
  font-size: 8px;
  font-weight: 900;
  letter-spacing: 1.5px;
}

.hero h1 {
  margin: 6px 0 0;
  font-size: 22px;
  line-height: 1.08;
  letter-spacing: -.6px;
}

.hero p {
  max-width: 235px;
  margin: 7px 0 0;
  color: #707070;
  font-size: 10px;
  line-height: 1.4;
}

.hero-icon {
  position: absolute;
  right: 23px;
  width: 48px;
  height: 48px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(249,115,22,.3);
  border-radius: 15px;
  background: #f97316;
  color: #fff;
  font-size: 19px;
  font-weight: 900;
  box-shadow:
    0 12px 35px rgba(249,115,22,.18);
}

.card {
  margin-top: 9px;
  padding: 13px 11px;
  border: 1px solid #1a1a1a;
  border-radius: 14px;
  background: #111;
  box-sizing: border-box;
}

.section-head {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 13px;
}

.section-head > .icon {
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  flex: 0 0 36px;
  border-radius: 10px;
  background: rgba(249,115,22,.09);
  color: #f97316;
  font-size: 15px;
}

.section-head strong,
.section-head small {
  display: block;
}

.section-head strong {
  font-size: 12px;
}

.section-head small {
  margin-top: 3px;
  color: #666;
  font-size: 9px;
  line-height: 1.3;
}

.field {
  display: block;
  margin-top: 11px;
}

.field:first-of-type {
  margin-top: 0;
}

.field > span {
  display: block;
  margin-bottom: 5px;
  color: #777;
  font-size: 9px;
  font-weight: 800;
}

.field input {
  width: 100%;
  height: 40px;
  padding: 0 10px;
  border: 1px solid #1b1b1b;
  border-radius: 9px;
  outline: none;
  background: #0d0d0d;
  color: #fff;
  font-size: 11px;
  box-sizing: border-box;
}

.field input:focus {
  border-color: rgba(249,115,22,.45);
}

.field input::placeholder {
  color: #3d3d3d;
}

.type-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 7px;
}

.type {
  min-height: 56px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border: 1px solid #1b1b1b;
  border-radius: 10px;
  background: #0d0d0d;
  color: #fff;
  text-align: left;
  cursor: pointer;
  box-sizing: border-box;
}

.type.active {
  border-color: rgba(249,115,22,.42);
  background: rgba(249,115,22,.055);
}

.radio {
  width: 19px;
  height: 19px;
  display: grid;
  place-items: center;
  flex: 0 0 19px;
  border: 1px solid #383838;
  border-radius: 50%;
  color: #fff;
  font-size: 9px;
  font-weight: 900;
  box-sizing: border-box;
}

.type.active .radio {
  border-color: #f97316;
  background: #f97316;
}

.type strong,
.type small {
  display: block;
}

.type strong {
  font-size: 10px;
}

.type small {
  margin-top: 3px;
  color: #666;
  font-size: 8px;
}

.compact {
  padding: 13px 11px;
}

.active-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.active-row strong,
.active-row small {
  display: block;
}

.active-row strong {
  font-size: 11px;
}

.active-row small {
  margin-top: 3px;
  color: #666;
  font-size: 9px;
}

.switch {
  width: 34px;
  height: 20px;
  padding: 2px;
  flex: 0 0 34px;
  border: 0;
  border-radius: 999px;
  background: #292929;
  cursor: pointer;
  box-sizing: border-box;
}

.switch span {
  display: block;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #fff;
  transition: transform .15s;
}

.switch.on {
  background: #16a34a;
}

.switch.on span {
  transform: translateX(14px);
}

.error {
  margin-top: 9px;
  padding: 10px 11px;
  border: 1px solid rgba(239,68,68,.2);
  border-radius: 10px;
  background: rgba(239,68,68,.06);
  color: #fca5a5;
  font-size: 9px;
  line-height: 1.4;
}

.actions {
  display: grid;
  grid-template-columns: 1fr 1.4fr;
  gap: 7px;
  margin-top: 12px;
}

.cancel,
.save {
  height: 43px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 900;
  cursor: pointer;
}

.cancel {
  border: 1px solid #1d1d1d;
  background: #111;
  color: #aaa;
}

.save {
  border: 0;
  background: #f97316;
  color: #fff;
}

.cancel:disabled,
.save:disabled {
  opacity: .6;
  cursor: wait;
}

@media (max-width: 480px) {
  .type-grid {
    grid-template-columns: 1fr;
  }
}

@media (min-width: 700px) {
  .bank-page {
    padding-top: 25px;
  }

  .hero {
    min-height: 145px;
  }

  .hero h1 {
    font-size: 25px;
  }
}
`;