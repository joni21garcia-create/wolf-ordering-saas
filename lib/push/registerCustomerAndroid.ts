/*
==========================================================

Wolf Ordering Push V2

Registro Android Cliente

==========================================================
*/

interface RegisterCustomerAndroidInput {
  restaurantId: string;
  token: string;
  platform?: "android";
}

interface RegisterCustomerAndroidResult {
  success: boolean;
  subscriptionId?: number;
}

export async function registerCustomerAndroid({
  restaurantId,
  token,
  platform = "android",
}: RegisterCustomerAndroidInput): Promise<RegisterCustomerAndroidResult> {

  if (!restaurantId) {

    console.error(
      "[CUSTOMER ANDROID] Restaurant ID vacío."
    );

    return {
      success: false,
    };

  }

  if (!token) {

    console.error(
      "[CUSTOMER ANDROID] Token vacío."
    );

    return {
      success: false,
    };

  }

  try {

    console.log(
      "[CUSTOMER ANDROID] Registrando dispositivo..."
    );

    const response =
      await fetch("/api/push/register-customer-device", {

        method: "POST",

        headers: {

          "Content-Type": "application/json",

        },

        credentials: "include",

        body: JSON.stringify({

          restaurant_id: restaurantId,

          token,

          platform,

        }),

      });

    const result =
      await response.json();

    if (!response.ok || !result.success) {

      console.error(
        "[CUSTOMER ANDROID]",
        result
      );

      return {
        success: false,
      };

    }

    console.log(
      "[CUSTOMER ANDROID] Dispositivo registrado."
    );

    return {

      success: true,

      subscriptionId:
        result.subscription_id,

    };

  } catch (error) {

    console.error(
      "[CUSTOMER ANDROID]",
      error
    );

    return {
      success: false,
    };

  }

}