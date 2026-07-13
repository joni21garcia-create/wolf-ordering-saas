"use client";

type Props = {
  acceptance: any;
  document: any;
};

export default function ViewAgreementClient({
  acceptance,
  document,
}: Props) {
  return (
    <main
      style={{
        padding: 40,
        color: "#fff",
        background: "#111",
        minHeight: "100vh",
      }}
    >
      <h1>Acuerdo Firmado</h1>

      <p>
        Restaurante:
        {" "}
        {acceptance.restaurant_id}
      </p>

      <p>
        Propietario:
        {" "}
        {acceptance.owner_name}
      </p>

      <p>
        Estado:
        {" "}
        {acceptance.status}
      </p>

      <hr />

      <pre
        style={{
          whiteSpace: "pre-wrap",
        }}
      >
        {document.content}
      </pre>
    </main>
  );
}