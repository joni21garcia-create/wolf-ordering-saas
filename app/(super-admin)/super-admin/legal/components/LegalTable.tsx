import LegalRow from "./LegalRow";

type Props = {
  agreements: any[];
};

export default function LegalTable({
  agreements,
}: Props) {
  return (
    <table
      style={{
        width: "100%",
        borderCollapse: "separate",
        borderSpacing: 0,
        overflow: "hidden",
        borderRadius: 16,
        background: "#171717",
        border: "1px solid #2d2d2d",
      }}
    >
      <thead
        style={{
          background: "#202020",
        }}
      >
        <tr>
          <th
            style={{
              padding: 16,
              textAlign: "left",
              color: "#cfcfcf",
              borderBottom: "1px solid #303030",
            }}
          >
            Restaurante
          </th>

          <th
            style={{
              padding: 16,
              textAlign: "left",
              color: "#cfcfcf",
              borderBottom: "1px solid #303030",
            }}
          >
            Propietario
          </th>

          <th
            style={{
              padding: 16,
              textAlign: "left",
              color: "#cfcfcf",
              borderBottom: "1px solid #303030",
            }}
          >
            Email
          </th>

          <th
            style={{
              padding: 16,
              textAlign: "left",
              color: "#cfcfcf",
              borderBottom: "1px solid #303030",
            }}
          >
            Estado
          </th>

          <th
            style={{
              padding: 16,
              textAlign: "left",
              color: "#cfcfcf",
              borderBottom: "1px solid #303030",
            }}
          >
            Versión
          </th>

          <th
            style={{
              padding: 16,
              textAlign: "left",
              color: "#cfcfcf",
              borderBottom: "1px solid #303030",
            }}
          >
            Aceptado
          </th>

          <th
            style={{
              padding: 16,
              textAlign: "left",
              color: "#cfcfcf",
              borderBottom: "1px solid #303030",
            }}
          >
            PDF
          </th>

          <th
            style={{
              padding: 16,
              textAlign: "left",
              color: "#cfcfcf",
              borderBottom: "1px solid #303030",
            }}
          >
            Ver
          </th>

<th
  style={{
    padding: 16,
    textAlign: "left",
    color: "#cfcfcf",
    borderBottom: "1px solid #303030",
  }}
>
  WhatsApp
</th>


        </tr>
      </thead>

      <tbody>
        {agreements.map((item) => (
          <LegalRow
            key={item.id}
            item={item}
          />
        ))}
      </tbody>
    </table>
  );
}


