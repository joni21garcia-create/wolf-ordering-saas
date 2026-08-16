import nextEnv from "@next/env";

const { loadEnvConfig } = nextEnv;

loadEnvConfig(process.cwd());

const PAYPAL_API =
  process.env.PAYPAL_API_BASE || "https://api-m.sandbox.paypal.com";

const CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;

if (!CLIENT_ID || !CLIENT_SECRET) {
  throw new Error(
    "Faltan PAYPAL_CLIENT_ID o PAYPAL_CLIENT_SECRET en .env.local"
  );
}

async function getAccessToken() {
  const credentials = Buffer.from(
    `${CLIENT_ID}:${CLIENT_SECRET}`
  ).toString("base64");

  const response = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    throw new Error(
      `PayPal OAuth falló: ${response.status} ${await response.text()}`
    );
  }

  const data = await response.json();
  return data.access_token;
}

async function paypalRequest(path, token, body) {
  const response = await fetch(`${PAYPAL_API}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify(body),
  });

  const text = await response.text();

  let data;

  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text };
  }

  if (!response.ok) {
    throw new Error(
      `PayPal ${path} falló: ${response.status}\n${JSON.stringify(
        data,
        null,
        2
      )}`
    );
  }

  return data;
}

async function main() {
  console.log("🔐 Conectando con PayPal Sandbox...");

  const token = await getAccessToken();

  console.log("✅ Autenticación correcta.");

  console.log("📦 Creando producto Wolf Ordering...");

  const product = await paypalRequest(
    "/v1/catalogs/products",
    token,
    {
      name: "Wolf Ordering",
      description: "Planes de suscripción para restaurantes",
      type: "SERVICE",
      category: "SOFTWARE",
    }
  );

  console.log(`✅ Producto creado: ${product.id}`);

  async function createPlan(name, description, price) {
    console.log(`💳 Creando plan ${name} - $${price}/mes...`);

    const plan = await paypalRequest(
      "/v1/billing/plans",
      token,
      {
        product_id: product.id,
        name,
        description,

        status: "ACTIVE",

        billing_cycles: [
          {
            frequency: {
              interval_unit: "MONTH",
              interval_count: 1,
            },

            tenure_type: "REGULAR",
            sequence: 1,
            total_cycles: 0,

            pricing_scheme: {
              fixed_price: {
                value: price,
                currency_code: "USD",
              },
            },
          },
        ],

        payment_preferences: {
          auto_bill_outstanding: true,
          payment_failure_threshold: 3,
        },
      }
    );

    console.log(`✅ ${name}: ${plan.id}`);

    return plan.id;
  }

  const basicId = await createPlan(
    "Wolf Ordering Básico",
    "Plan Básico para restaurantes",
    "35.00"
  );

  const proId = await createPlan(
    "Wolf Ordering Pro",
    "Plan Pro para restaurantes que quieren crecer",
    "46.00"
  );

  console.log("\n========================================");
  console.log("🎉 PLANES CREADOS CORRECTAMENTE");
  console.log("========================================\n");

  console.log(`PAYPAL_PLAN_BASIC_ID=${basicId}`);
  console.log(`PAYPAL_PLAN_PRO_ID=${proId}`);

  console.log("\n⚠️ Guarda estos dos IDs en .env.local");
}

main().catch((error) => {
  console.error("\n❌ ERROR");
  console.error(error.message);
  process.exit(1);
});