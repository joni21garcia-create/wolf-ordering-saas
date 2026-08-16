 "use client";

import { useState } from "react";
import RestaurantActions from "./RestaurantActions";
import RestaurantStatus from "./RestaurantStatus";
import { WolfSheet } from "@/lib/wolf-ui";

type Props = {
  restaurant: any;
  onToggleStatus?: () => void;
  onDelete?: () => void;
};

export default function RestaurantCard({
  restaurant,
  onToggleStatus,
  onDelete,
}: Props) {
  const [sheetOpen, setSheetOpen] = useState(false);

  const initials = (restaurant?.name || "R")
    .split(" ")
    .map((word: string) => word[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const dateValue =
    restaurant.updated_at || restaurant.created_at;

  return (
    <>
      <article className="restaurant-card">
        <button
          type="button"
          className="card-trigger"
          onClick={() => setSheetOpen(true)}
          aria-label={`Abrir ${restaurant.name}`}
        >
          <div className="identity">
            {restaurant.logo_url ? (
              <img
                src={restaurant.logo_url}
                alt=""
                className="logo"
              />
            ) : (
              <div className="logo initials">{initials}</div>
            )}

            <div className="identity-copy">
              <strong>{restaurant.name}</strong>
              <span>/{restaurant.slug}</span>
            </div>
          </div>

          <div className="trigger-right">
            <RestaurantStatus active={restaurant.active} />

            <span className="open-icon" aria-hidden="true">
              →
            </span>
          </div>
        </button>

        <style jsx>{`
          .restaurant-card {
            min-width: 0;
            overflow: hidden;
            border: 1px solid rgba(255, 255, 255, 0.07);
            border-radius: 15px;
            background: #151515;
            transition:
              border-color 0.18s ease,
              background 0.18s ease,
              transform 0.18s ease;
          }

          .restaurant-card:hover {
            border-color: rgba(249, 115, 22, 0.18);
            background: #171717;
            transform: translateY(-1px);
          }

          .card-trigger {
            width: 100%;
            min-height: 72px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            padding: 10px 11px;
            border: 0;
            background: transparent;
            color: #fff;
            text-align: left;
            cursor: pointer;
            -webkit-tap-highlight-color: transparent;
          }

          .identity {
            min-width: 0;
            display: flex;
            align-items: center;
            gap: 10px;
          }

          .logo {
            width: 45px;
            height: 45px;
            flex: 0 0 45px;
            display: block;
            border: 2px solid rgba(255, 255, 255, 0.08);
            border-radius: 12px;
            background: #222;
            object-fit: cover;
          }

          .initials {
            display: grid;
            place-items: center;
            color: #fff;
            background: linear-gradient(135deg, #ff8a1f, #ff6200);
            font-size: 13px;
            font-weight: 850;
          }

          .identity-copy {
            min-width: 0;
            display: flex;
            flex-direction: column;
            gap: 3px;
          }

          .identity-copy strong {
            overflow: hidden;
            color: #f4f4f4;
            font-size: 13px;
            font-weight: 750;
            line-height: 1.2;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .identity-copy span {
            overflow: hidden;
            color: #626262;
            font-size: 9px;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .trigger-right {
            flex: 0 0 auto;
            display: flex;
            align-items: center;
            gap: 7px;
          }

          .open-icon {
            width: 28px;
            height: 28px;
            display: grid;
            place-items: center;
            border: 1px solid rgba(255, 255, 255, 0.07);
            border-radius: 9px;
            color: #888;
            font-size: 15px;
            background: rgba(255, 255, 255, 0.035);
          }

          @media (max-width: 430px) {
            .card-trigger {
              min-height: 68px;
              padding: 9px 10px;
              gap: 8px;
            }

            .logo {
              width: 42px;
              height: 42px;
              flex-basis: 42px;
              border-radius: 11px;
            }

            .identity {
              gap: 9px;
            }

            .identity-copy strong {
              font-size: 12px;
            }
          }
        `}</style>
      </article>

      <WolfSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title={restaurant.name}
        subtitle={`/${restaurant.slug}`}
        ariaLabel={`Información de ${restaurant.name}`}
        dismissible
        showCloseButton
        maxWidth={520}
      >
        <div className="sheet-content">
          <div className="sheet-hero">
            <div
              className="banner"
              style={{
                background: restaurant.banner_url
                  ? `url(${restaurant.banner_url}) center / cover`
                  : "linear-gradient(135deg,#ff8a1f,#ff6200)",
              }}
            >
              <div className="banner-overlay" />
            </div>

            <div className="sheet-logo-wrap">
              {restaurant.logo_url ? (
                <img
                  src={restaurant.logo_url}
                  alt=""
                  className="sheet-logo"
                />
              ) : (
                <div className="sheet-logo sheet-initials">
                  {initials}
                </div>
              )}
            </div>
          </div>

          <div className="sheet-body">
            <div className="sheet-heading">
              <div>
                <h2>{restaurant.name}</h2>
                <p>/{restaurant.slug}</p>
              </div>

              <RestaurantStatus active={restaurant.active} />
            </div>

            <div className="info-list">
              <InfoRow
                icon="📱"
                label="Teléfono"
                value={
                  restaurant.whatsapp ||
                  restaurant.owner_phone ||
                  restaurant.phone ||
                  "No registrado"
                }
              />

              <InfoRow
                icon="✉️"
                label="Correo"
                value={
                  restaurant.contact_email ||
                  restaurant.email ||
                  "No registrado"
                }
              />

              <InfoRow
                icon="🍽️"
                label="Productos"
                value={`${restaurant.products_count ?? 0}`}
              />

              <InfoRow
                icon="🕒"
                label="Actualizado"
                value={
                  dateValue
                    ? new Date(dateValue).toLocaleDateString(
                        "es-EC",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )
                    : "Sin actualizar"
                }
              />
            </div>

            <div className="sheet-divider" />

            <RestaurantActions
              restaurantId={restaurant.id}
              active={restaurant.active}
              onToggleStatus={onToggleStatus}
              onDelete={onDelete}
            />
          </div>
        </div>

        <style jsx>{`
          .sheet-content {
            min-height: 100%;
            background: #0d0d0f;
          }

          .sheet-hero {
            position: relative;
          }

          .banner {
            position: relative;
            height: 108px;
            background-color: #202020;
          }

          .banner-overlay {
            position: absolute;
            inset: 0;
            background: linear-gradient(
              180deg,
              rgba(0, 0, 0, 0.05),
              rgba(0, 0, 0, 0.6)
            );
          }

          .sheet-logo-wrap {
            position: absolute;
            left: 18px;
            bottom: -27px;
          }

          .sheet-logo {
            width: 58px;
            height: 58px;
            display: block;
            border: 3px solid #0d0d0f;
            border-radius: 16px;
            background: #222;
            object-fit: cover;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
          }

          .sheet-initials {
            display: grid;
            place-items: center;
            color: #fff;
            background: linear-gradient(135deg, #ff8a1f, #ff6200);
            font-size: 18px;
            font-weight: 850;
          }

          .sheet-body {
            padding: 39px 18px 24px;
          }

          .sheet-heading {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
          }

          .sheet-heading h2 {
            margin: 0;
            color: #fff;
            font-size: 20px;
            font-weight: 800;
            letter-spacing: -0.3px;
          }

          .sheet-heading p {
            margin: 3px 0 0;
            color: #666;
            font-size: 11px;
          }

          .info-list {
            display: grid;
            gap: 8px;
            margin-top: 20px;
          }

          .sheet-divider {
            width: 100%;
            height: 1px;
            margin: 18px 0;
            background: rgba(255, 255, 255, 0.07);
          }

          @media (max-width: 430px) {
            .banner {
              height: 96px;
            }

            .sheet-body {
              padding-left: 15px;
              padding-right: 15px;
            }

            .sheet-heading h2 {
              font-size: 18px;
            }
          }
        `}</style>
      </WolfSheet>
    </>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div className="info-row">
      <div className="info-icon">{icon}</div>

      <div className="info-copy">
        <span>{label}</span>
        <strong>{value}</strong>
      </div>

      <style jsx>{`
        .info-row {
          min-height: 44px;
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 7px 9px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 11px;
          background: rgba(255, 255, 255, 0.025);
        }

        .info-icon {
          width: 29px;
          height: 29px;
          flex: 0 0 29px;
          display: grid;
          place-items: center;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.04);
          font-size: 11px;
        }

        .info-copy {
          min-width: 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .info-copy span {
          color: #555;
          font-size: 9px;
        }

        .info-copy strong {
          overflow: hidden;
          color: #d1d1d1;
          font-size: 11px;
          font-weight: 600;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      `}</style>
    </div>
  );
}