import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type Props = {
  ownerName: string;
  ownerEmail: string;

  restaurantName: string;

  agreementUrl: string;

  pdfUrl: string;
};

export async function sendAgreementEmail({
  ownerName,
  ownerEmail,
  restaurantName,
  agreementUrl,
  pdfUrl,
}: Props) {
  return resend.emails.send({
    from: "Wolf Ordering <ventas@wolfordering.com>",

    to: ownerEmail,

    subject: "Acuerdo Comercial Firmado",

    html: `
      <h2>Hola ${ownerName}</h2>

      <p>
        Tu acuerdo comercial con
        <strong>Wolf Ordering</strong>
        ha sido aceptado correctamente.
      </p>

      <p>
        Restaurante:
        <strong>${restaurantName}</strong>
      </p>

      <p>
        Puedes volver a consultar el acuerdo aquí:
      </p>

      <p>
        <a href="${agreementUrl}">
          Ver acuerdo
        </a>
      </p>

      <p>
        Descargar PDF firmado:
      </p>

      <p>
        <a href="${pdfUrl}">
          Descargar PDF
        </a>
      </p>

      <br/>

      <p>
        Gracias por confiar en Wolf Ordering.
      </p>
    `,
  });
}


