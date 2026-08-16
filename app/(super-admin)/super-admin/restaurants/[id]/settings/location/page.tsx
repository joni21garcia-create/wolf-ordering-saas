"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import BackToSettings from "@/components/admin/BackToSettings";
import PermissionGuard from "@/components/auth/PermissionGuard";

export default function LocationPage() {
  const params = useParams();
  const restaurantId = params.id as string;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [location, setLocation] = useState<any>(null);

  useEffect(() => { loadLocation(); }, []);

  const loadLocation = async () => {
    const { data } = await supabase.from("restaurants").select("id, address, latitude, longitude, google_maps_url, name").eq("id", restaurantId).maybeSingle();
    setLocation(data);
    loading_false();
  };

  const loading_false = () => {
    setLoading(false);
  };

  const saveLocation = async () => {
    setSaving(true);
    const { error } = await supabase.from("restaurants").update({
      address: location.address,
      latitude: location.latitude,
      longitude: location.longitude,
      google_maps_url: location.google_maps_url,
    }).eq("id", restaurantId);

    if (error) alert("Error guardando ubicación");
    else alert("Ubicación guardada correctamente");
    setSaving(false);
  };

  if (loading || !location) {
    return (
      <PermissionGuard permission="location">
        <main className="location-page">
          <div className="location-wrap">
            <div className="loading-state">Cargando ubicación...</div>
          </div>
        </main>
      </PermissionGuard>
    );
  }

  const mapsUrl =
    location.google_maps_url ||
    (location.latitude && location.longitude
      ? `https://www.google.com/maps?q=${location.latitude},${location.longitude}`
      : "https://www.google.com/maps");

  return (
    <PermissionGuard permission="location">
      <main className="location-page">
        <div className="location-wrap">
          <header className="location-header">
            <BackToSettings restaurantId={restaurantId} />
            <div className="eyebrow">Configuración · Local</div>
            <div className="title-line">
              <div>
                <h1>Ubicación</h1>
                <p>Configura dónde está tu restaurante.</p>
              </div>
              <span className="pin-badge">⌖</span>
            </div>
          </header>

          <section className="location-section">
            <div className="section-title">
              <span>📍</span>
              <div>
                <strong>Datos de ubicación</strong>
                <small>Información que usarán clientes y repartidores.</small>
              </div>
            </div>

            <div className="fields">
              <TextCard
                label="Dirección"
                value={location.address}
                onChange={(v: string) =>
                  setLocation({ ...location, address: v })
                }
              />

              <div className="coordinates">
                <TextCard
                  label="Latitud"
                  value={location.latitude}
                  onChange={(v: string) =>
                    setLocation({ ...location, latitude: v })
                  }
                />

                <TextCard
                  label="Longitud"
                  value={location.longitude}
                  onChange={(v: string) =>
                    setLocation({ ...location, longitude: v })
                  }
                />
              </div>

              <TextCard
                label="Google Maps · opcional"
                value={location.google_maps_url}
                onChange={(v: string) =>
                  setLocation({ ...location, google_maps_url: v })
                }
              />
            </div>
          </section>

          <section className="map-section">
            <div className="section-title">
              <span>⌖</span>
              <div>
                <strong>Mapa</strong>
                <small>Vista previa de la ubicación.</small>
              </div>
            </div>

            {location.latitude && location.longitude ? (
              <div className="map-container">
                <iframe
                  src={`https://maps.google.com/maps?q=${location.latitude},${location.longitude}&z=15&output=embed`}
                  width="100%"
                  height="220"
                  style={{
                    border: "none",
                    filter: "invert(90%) hue-rotate(180deg) grayscale(10%)",
                    opacity: 0.88,
                  }}
                  loading="lazy"
                />
              </div>
            ) : (
              <div className="map-empty">
                <span>⌖</span>
                <strong>Sin ubicación</strong>
                <small>Ingresa latitud y longitud para mostrar el mapa.</small>
              </div>
            )}

            <div className="map-actions">
              <a href={mapsUrl} target="_blank" rel="noreferrer">
                Abrir Maps
              </a>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${location.latitude}, ${location.longitude}`
                  );
                  alert("Copiado");
                }}
              >
                Copiar coordenadas
              </button>
            </div>
          </section>

          <button
            onClick={saveLocation}
            disabled={saving}
            className="save-button"
          >
            {saving ? "Guardando..." : "Guardar ubicación"}
          </button>
        </div>

        <style jsx global>{`
          .location-page {
            min-height:100vh;
            width:100%;
            box-sizing:border-box;
            padding:16px 12px 36px;
            background:#050505;
            color:#fff;
            font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
          }

          .location-wrap {
            width:100%;
            max-width:650px;
            margin:0 auto;
          }

          .loading-state {
            padding:32px 12px;
            text-align:center;
            color:rgba(255,255,255,.3);
            font-size:9px;
          }

          .location-header {
            margin-bottom:11px;
          }

          .eyebrow {
            margin-top:8px;
            color:#f97316;
            font-size:8px;
            font-weight:800;
            letter-spacing:1px;
            text-transform:uppercase;
          }

          .title-line {
            display:flex;
            align-items:center;
            justify-content:space-between;
            gap:8px;
            margin-top:3px;
          }

          .title-line h1 {
            margin:0;
            font-size:23px;
            line-height:1.1;
            letter-spacing:-.5px;
            font-weight:850;
          }

          .title-line p {
            margin:4px 0 0;
            color:rgba(255,255,255,.35);
            font-size:9px;
          }

          .pin-badge {
            width:29px;
            height:29px;
            display:grid;
            place-items:center;
            flex-shrink:0;
            border:1px solid rgba(249,115,22,.2);
            border-radius:8px;
            background:rgba(249,115,22,.07);
            color:#f97316;
            font-size:16px;
          }

          .location-section,
          .map-section {
            padding:11px;
            margin-bottom:6px;
            border:1px solid rgba(255,255,255,.055);
            border-radius:10px;
            background:rgba(17,24,39,.58);
          }

          .section-title {
            display:flex;
            align-items:center;
            gap:7px;
            margin-bottom:10px;
          }

          .section-title > span {
            width:27px;
            height:27px;
            display:grid;
            place-items:center;
            flex-shrink:0;
            border-radius:7px;
            background:rgba(249,115,22,.07);
            color:#f97316;
            font-size:12px;
          }

          .section-title strong {
            display:block;
            font-size:9px;
            font-weight:800;
          }

          .section-title small {
            display:block;
            margin-top:2px;
            color:rgba(255,255,255,.22);
            font-size:7px;
          }

          .fields {
            display:flex;
            flex-direction:column;
            gap:8px;
          }

          .coordinates {
            display:grid;
            grid-template-columns:1fr 1fr;
            gap:6px;
          }

          .field-label {
            display:block;
            margin-bottom:4px;
            color:rgba(255,255,255,.38);
            font-size:7px;
            font-weight:700;
          }

          .field-input {
            width:100%;
            height:34px;
            box-sizing:border-box;
            padding:7px 8px;
            border:1px solid rgba(255,255,255,.06);
            border-radius:7px;
            background:#0b0f16;
            color:#fff;
            outline:none;
            font:500 9px system-ui,sans-serif;
          }

          .field-input:focus {
            border-color:rgba(249,115,22,.4);
            box-shadow:0 0 0 3px rgba(249,115,22,.05);
          }

          .map-container {
            overflow:hidden;
            height:220px;
            border:1px solid rgba(255,255,255,.06);
            border-radius:8px;
            background:#0b0b0b;
          }

          .map-empty {
            min-height:130px;
            display:flex;
            flex-direction:column;
            align-items:center;
            justify-content:center;
            border:1px dashed rgba(255,255,255,.07);
            border-radius:8px;
            color:rgba(255,255,255,.28);
            text-align:center;
          }

          .map-empty span {
            margin-bottom:5px;
            color:#f97316;
            font-size:20px;
          }

          .map-empty strong {
            color:rgba(255,255,255,.52);
            font-size:9px;
          }

          .map-empty small {
            margin-top:3px;
            font-size:7px;
          }

          .map-actions {
            display:grid;
            grid-template-columns:1fr 1fr;
            gap:5px;
            margin-top:6px;
          }

          .map-actions a,
          .map-actions button {
            min-height:31px;
            display:flex;
            align-items:center;
            justify-content:center;
            box-sizing:border-box;
            padding:5px 7px;
            border-radius:7px;
            text-decoration:none;
            font:800 8px system-ui,sans-serif;
            cursor:pointer;
          }

          .map-actions a {
            border:1px solid rgba(249,115,22,.16);
            background:rgba(249,115,22,.07);
            color:#f97316;
          }

          .map-actions button {
            border:1px solid rgba(255,255,255,.06);
            background:rgba(255,255,255,.025);
            color:rgba(255,255,255,.48);
          }

          .save-button {
            width:100%;
            min-height:38px;
            margin-top:1px;
            border:0;
            border-radius:8px;
            background:#f97316;
            color:#fff;
            font:800 9px system-ui,sans-serif;
            cursor:pointer;
          }

          .save-button:disabled {
            opacity:.5;
            cursor:not-allowed;
          }

          @media(max-width:390px) {
            .location-page {
              padding-left:9px;
              padding-right:9px;
            }

            .coordinates {
              grid-template-columns:1fr;
            }

            .map-actions {
              grid-template-columns:1fr;
            }
          }
        `}</style>
      </main>
    </PermissionGuard>
  );
}

function TextCard({ label, value, onChange }: any) {
  return (
    <div>
      <label className="field-label">{label}</label>
      <input
        className="field-input"
        type="text"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}