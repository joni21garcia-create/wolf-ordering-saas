import { supabaseAdmin } from "@/lib/supabase/supabase";

type ReservationRow = {
  id: string;
  restaurant_id: string;
  confirmation_code: string;
  reservation_number?: string | null;
  customer_name: string;
  customer_email?: string | null;
  customer_phone?: string | null;
  reservation_date: string;
  start_time: string;
  end_time: string;
  start_at?: string | null;
  end_at?: string | null;
  guests: number;
  status: string;
  timezone?: string | null;
  notes?: string | null;
  internal_notes?: string | null;
  restaurant_table_assignments?: Array<{
    assigned_guests?: number | null;
    is_primary?: boolean | null;
    restaurant_tables?: {
      id: string;
      code?: string | null;
      name?: string | null;
      capacity?: number | null;
    } | null;
  }>;
};

type RestaurantRow = {
  id: string;
  name: string;
  contact_email?: string | null;
  manager_email?: string | null;
  owner_email?: string | null;
};

export interface ReservationEmailData {
  id: string;
  confirmationCode: string;
  reservationNumber?: string;
  status: string;
  restaurant: {
    id: string;
    name: string;
    email: string | null;
  };
  guest: {
    name: string;
    email: string | null;
    phone: string | null;
  };
  date: string;
  dateLabel: string;
  startTime: string;
  endTime: string;
  guests: number;
  tables: Array<{
    name: string;
    code: string;
    capacity: number | null;
  }>;
  notes: string | null;
};

function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatTime(value: string): string {
  const [hour, minute] = value.slice(0, 5).split(":").map(Number);

  if (!Number.isFinite(hour) || !Number.isFinite(minute)) {
    return value;
  }

  const date = new Date();
  date.setHours(hour, minute, 0, 0);

  return new Intl.DateTimeFormat("es-EC", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

function formatDate(date: string, timezone = "America/Guayaquil"): string {
  const parsed = new Date(`${date}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;

  return new Intl.DateTimeFormat("es-EC", {
    timeZone: timezone,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(parsed);
}

function statusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending: "Pendiente de confirmación",
    confirmed: "Confirmada",
    cancelled: "Cancelada",
    checked_in: "Check-in realizado",
    completed: "Completada",
    no_show: "No se presentó",
    rejected: "Rechazada",
    expired: "Expirada",
  };

  return labels[status] ?? status;
}

export async function getReservationEmailData(
  reservationId: string
): Promise<ReservationEmailData> {
  const [{ data: reservation, error: reservationError }, { data: restaurant, error: restaurantError }] =
    await Promise.all([
      supabaseAdmin
        .from("restaurant_reservations")
        .select(`
          id,
          restaurant_id,
          confirmation_code,
          reservation_number,
          customer_name,
          customer_email,
          customer_phone,
          reservation_date,
          start_time,
          end_time,
          start_at,
          end_at,
          guests,
          status,
          timezone,
          notes,
          internal_notes,
          restaurant_table_assignments(
            assigned_guests,
            is_primary,
            restaurant_tables(
              id,
              code,
              name,
              capacity
            )
          )
        `)
        .eq("id", reservationId)
        .single(),
      // El correo de reservas usa el contact_email configurado
      // en la pantalla "Contacto y redes".
      supabaseAdmin
        .from("restaurants")
        .select("id, name, contact_email, manager_email, owner_email")
        .eq(
          "id",
          (
            await supabaseAdmin
              .from("restaurant_reservations")
              .select("restaurant_id")
              .eq("id", reservationId)
              .single()
          ).data?.restaurant_id ?? ""
        )
        .maybeSingle(),
    ]);

  if (reservationError) throw reservationError;
  if (restaurantError) throw restaurantError;
  if (!reservation) throw new Error("RESERVATION_NOT_FOUND");
  if (!restaurant) throw new Error("RESTAURANT_NOT_FOUND");

  const row = reservation as ReservationRow;
  const restaurantRow = restaurant as RestaurantRow;

  const tables = (row.restaurant_table_assignments ?? [])
    .map((assignment) => assignment.restaurant_tables)
    .filter(
      (
        table
      ): table is {
        id: string;
        code?: string | null;
        name?: string | null;
        capacity?: number | null;
      } => Boolean(table)
    )
    .map((table) => ({
      name: table.name || "Mesa",
      code: table.code || "",
      capacity: table.capacity ?? null,
    }));

  return {
    id: row.id,
    confirmationCode: row.confirmation_code,
    reservationNumber: row.reservation_number ?? undefined,
    status: row.status,
    restaurant: {
      id: restaurantRow.id,
      name: restaurantRow.name,
      email:
        restaurantRow.contact_email?.trim() ||
        restaurantRow.manager_email?.trim() ||
        restaurantRow.owner_email?.trim() ||
        null,
    },
    guest: {
      name: row.customer_name,
      email: row.customer_email?.trim() || null,
      phone: row.customer_phone?.trim() || null,
    },
    date: row.reservation_date,
    dateLabel: formatDate(
      row.reservation_date,
      row.timezone || "America/Guayaquil"
    ),
    startTime: formatTime(row.start_time),
    endTime: formatTime(row.end_time),
    guests: Number(row.guests ?? 0),
    tables,
    notes: row.notes?.trim() || null,
  };
}

export function buildReservationDetailsHtml(
  data: ReservationEmailData,
  options: {
    intro: string;
    title: string;
    showCustomerContact?: boolean;
    showStatus?: boolean;
    cancellationReason?: string | null;
  }
): string {
  const tableLabel =
    data.tables.length > 0
      ? data.tables
          .map(
            (table) =>
              `${escapeHtml(table.name)}${
                table.code
                  ? ` (${escapeHtml(table.code)})`
                  : ""
              }`
          )
          .join(", ")
      : "Pendiente de asignación";

  return `
    <!doctype html>
    <html lang="es">
      <body style="margin:0;background:#f6f7f8;font-family:Arial,Helvetica,sans-serif;color:#171717;">
        <div style="max-width:620px;margin:0 auto;padding:28px 16px;">
          <div style="background:#ffffff;border:1px solid #e7e7e7;border-radius:20px;overflow:hidden;">
            <div style="padding:24px 24px 18px;border-bottom:1px solid #eeeeee;">
              <div style="font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#f97316;">
                Wolf Ordering · Reservas
              </div>
              <h1 style="margin:8px 0 6px;font-size:24px;line-height:1.2;color:#111111;">
                ${escapeHtml(options.title)}
              </h1>
              <p style="margin:0;color:#666666;font-size:14px;line-height:1.6;">
                ${escapeHtml(options.intro)}
              </p>
            </div>

            <div style="padding:22px 24px;">
              <div style="font-size:13px;color:#777777;margin-bottom:6px;">Restaurante</div>
              <div style="font-size:18px;font-weight:700;margin-bottom:20px;">
                ${escapeHtml(data.restaurant.name)}
              </div>

              ${
                options.showStatus
                  ? `
                    <div style="display:inline-block;padding:7px 11px;border-radius:999px;background:#fff7ed;color:#c2410c;font-size:12px;font-weight:700;margin-bottom:20px;">
                      ${escapeHtml(statusLabel(data.status))}
                    </div>
                  `
                  : ""
              }

              <div style="border:1px solid #eeeeee;border-radius:14px;padding:16px;">
                <div style="font-size:12px;font-weight:700;color:#777777;text-transform:uppercase;letter-spacing:.05em;margin-bottom:12px;">
                  Detalles de la reserva
                </div>

                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="font-size:14px;line-height:1.7;">
                  <tr>
                    <td style="color:#777;padding:4px 0;">Fecha</td>
                    <td align="right" style="font-weight:600;padding:4px 0;">${escapeHtml(data.dateLabel)}</td>
                  </tr>
                  <tr>
                    <td style="color:#777;padding:4px 0;">Hora</td>
                    <td align="right" style="font-weight:600;padding:4px 0;">${escapeHtml(data.startTime)} – ${escapeHtml(data.endTime)}</td>
                  </tr>
                  <tr>
                    <td style="color:#777;padding:4px 0;">Personas</td>
                    <td align="right" style="font-weight:600;padding:4px 0;">${data.guests}</td>
                  </tr>
                  <tr>
                    <td style="color:#777;padding:4px 0;">Mesa</td>
                    <td align="right" style="font-weight:600;padding:4px 0;">${tableLabel}</td>
                  </tr>
                  <tr>
                    <td style="color:#777;padding:4px 0;">Código</td>
                    <td align="right" style="font-weight:700;padding:4px 0;">${escapeHtml(data.confirmationCode)}</td>
                  </tr>
                </table>
              </div>

              <div style="margin-top:16px;">
                <div style="font-size:12px;font-weight:700;color:#777777;text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px;">
                  Cliente
                </div>
                <div style="font-size:15px;font-weight:700;">${escapeHtml(data.guest.name)}</div>

                ${
                  options.showCustomerContact
                    ? `
                      ${
                        data.guest.email
                          ? `<div style="font-size:13px;color:#666;margin-top:3px;">${escapeHtml(data.guest.email)}</div>`
                          : ""
                      }
                      ${
                        data.guest.phone
                          ? `<div style="font-size:13px;color:#666;margin-top:3px;">${escapeHtml(data.guest.phone)}</div>`
                          : ""
                      }
                    `
                    : ""
                }
              </div>

              ${
                data.notes
                  ? `
                    <div style="margin-top:16px;padding:14px;border-radius:12px;background:#fafafa;">
                      <div style="font-size:12px;font-weight:700;color:#777777;text-transform:uppercase;letter-spacing:.05em;margin-bottom:5px;">
                        Notas
                      </div>
                      <div style="font-size:14px;line-height:1.6;color:#444;">
                        ${escapeHtml(data.notes)}
                      </div>
                    </div>
                  `
                  : ""
              }

              ${
                options.cancellationReason
                  ? `
                    <div style="margin-top:16px;padding:14px;border-radius:12px;background:#fef2f2;color:#991b1b;">
                      <div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;margin-bottom:5px;">
                        Motivo de cancelación
                      </div>
                      <div style="font-size:14px;line-height:1.6;">
                        ${escapeHtml(options.cancellationReason)}
                      </div>
                    </div>
                  `
                  : ""
              }
            </div>

            <div style="padding:18px 24px;background:#fafafa;border-top:1px solid #eeeeee;color:#888;font-size:12px;line-height:1.6;">
              Este correo fue enviado automáticamente por Wolf Ordering.
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}
