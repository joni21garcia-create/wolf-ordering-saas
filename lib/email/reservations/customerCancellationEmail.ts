import { supabaseAdmin } from "@/lib/supabase/supabase";
import { getCustomerCancellationUrl } from "@/lib/reservations/customer-cancellation-token";

export async function buildCustomerCancellationHtml(
  reservationId: string,
  restaurantId: string,
): Promise<string> {
  const { data: settings, error } =
    await supabaseAdmin
      .from("restaurant_reservation_settings")
      .select(
        "allow_cancellations, cancellation_limit_hours",
      )
      .eq("restaurant_id", restaurantId)
      .maybeSingle();

  if (error) {
    console.error(
      "RESERVATION CANCELLATION SETTINGS EMAIL ERROR",
      error,
    );
    return "";
  }

  if (settings?.allow_cancellations !== true) {
    return "";
  }

  const configuredHours = Number(
    settings.cancellation_limit_hours ?? 0,
  );

  const hours =
    Number.isFinite(configuredHours) &&
    configuredHours > 0
      ? configuredHours
      : 0;

  if (hours <= 0) {
    console.error(
      "RESERVATION CANCELLATION CONFIGURATION ERROR",
      {
        reservationId,
        restaurantId,
        cancellation_limit_hours:
          settings.cancellation_limit_hours,
      },
    );
    return "";
  }

  let cancellationUrl: string;

  try {
    cancellationUrl = getCustomerCancellationUrl(
      reservationId,
    );
  } catch (error) {
    console.error(
      "RESERVATION CANCELLATION URL ERROR",
      error,
    );
    return "";
  }

  const cancellationTimeText =
    hours === 1
      ? "1 hora antes"
      : `${hours} horas antes`;

  return `
    <div
      style="
        margin-top: 28px;
        padding: 20px;
        border-radius: 16px;
        background: #f5f5f5;
        border: 1px solid #e5e5e5;
      "
    >
      <p
        style="
          margin: 0 0 8px;
          font-size: 16px;
          line-height: 24px;
          font-weight: 700;
          color: #111111;
        "
      >
        ¿Necesitas cancelar tu reserva?
      </p>

      <p
        style="
          margin: 0 0 16px;
          font-size: 14px;
          line-height: 22px;
          color: #555555;
        "
      >
        Puedes cancelar esta reserva hasta
        <strong>${cancellationTimeText}</strong> antes de la hora reservada.
      </p>

      <a
        href="${cancellationUrl}"
        style="
          display: inline-block;
          padding: 12px 18px;
          border-radius: 10px;
          background: #111111;
          color: #ffffff;
          text-decoration: none;
          font-size: 14px;
          line-height: 20px;
          font-weight: 700;
        "
      >
        Gestionar / cancelar mi reserva
      </a>

      <p
        style="
          margin: 14px 0 0;
          font-size: 12px;
          line-height: 18px;
          color: #777777;
        "
      >
        El enlace no expira por sí mismo. La cancelación está disponible únicamente hasta el límite establecido por el restaurante.
      </p>
    </div>
  `;
}
