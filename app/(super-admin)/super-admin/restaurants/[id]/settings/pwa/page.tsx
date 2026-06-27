import PWASettingsForm from "@/components/settings/pwa/PWASettingsForm";
import PermissionGuard from "@/components/auth/PermissionGuard";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function PWASettingsPage({
  params,
}: Props) {
  const { id } = await params;

  return (
  <PermissionGuard permission="pwa">
    <main

      style={{
        padding: "40px",
      }}
    >
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            marginBottom: 40,
          }}
        >
          <h1
            style={{
              fontSize: 40,
              fontWeight: 800,
            }}
          >
            Aplicación móvil
          </h1>

          <p
            style={{
              color: "#999",
              marginTop: 12,
              fontSize: 16,
            }}
          >
            Configura la aplicación PWA que instalarán
            tus clientes.
          </p>
        </div>

        <PWASettingsForm
          restaurantId={id}
        />
      </div>
      </main>
    </PermissionGuard>
)
}