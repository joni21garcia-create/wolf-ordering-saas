"use client";

import { useSession } from "@/providers/SessionProvider";
import Can from "@/components/auth/Can";

export default function Page() {
  const { user, loading } = useSession();

  if (loading) {
    return (
      <main style={{ padding: "40px" }}>
        <h1>Cargando sesión...</h1>
      </main>
    );
  }

  if (!user) {
    return (
      <main style={{ padding: "40px" }}>
        <h1>No hay usuario logueado</h1>
      </main>
    );
  }

  return (
    <main
      style={{
        padding: "40px",
        color: "#fff",
      }}
    >
      <h1>🧪 Test Session Provider</h1>

      <div
        style={{
          background: "#111",
          padding: "20px",
          borderRadius: "12px",
          marginTop: "20px",
        }}
      >
        <h2>Usuario</h2>

        <p>
          <strong>Nombre:</strong>{" "}
          {user.full_name}
        </p>

        <p>
          <strong>Email:</strong>{" "}
          {user.email}
        </p>

        <p>
          <strong>Restaurant ID:</strong>{" "}
          {user.restaurant_id}
        </p>

        <p>
          <strong>Rol:</strong>{" "}
          {user.role.name}
        </p>

        <p>
          <strong>Code:</strong>{" "}
          {user.role.code}
        </p>
      </div>

      <div
        style={{
          background: "#111",
          padding: "20px",
          borderRadius: "12px",
          marginTop: "20px",
        }}
      >
        <h2>Permisos</h2>

        {user.permissions.length === 0 ? (
          <p>
            No hay permisos cargados
          </p>
        ) : (
          <ul>
            {user.permissions.map(
              (permission) => (
                <li key={permission}>
                  ✅ {permission}
                </li>
              )
            )}
          </ul>
        )}
      </div>

      <div
        style={{
          background: "#111",
          padding: "20px",
          borderRadius: "12px",
          marginTop: "20px",
        }}
      >
        <h2>JSON Completo</h2>

        <pre
          style={{
            whiteSpace:
              "pre-wrap",
          }}
        >
<Can permission="users">
  <div
    style={{
      background: "green",
      padding: "20px",
      marginTop: "20px",
    }}
  >
    ✅ Puede ver Usuarios
  </div>
</Can>

<Can permission="finance">
  <div
    style={{
      background: "blue",
      padding: "20px",
      marginTop: "20px",
    }}
  >
    ✅ Puede ver Finanzas
  </div>
</Can>

<Can permission="modulo_inexistente">
  <div>
    NO DEBERÍA VERSE
  </div>
</Can>

          {JSON.stringify(
            user,
            null,
            2
          )}
        </pre>
      </div>
    </main>
  );
}