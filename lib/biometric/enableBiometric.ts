import { BiometricAuth } from "@aparajita/capacitor-biometric-auth";
import { supabase } from "@/lib/supabase/client";
import { saveBiometricUser } from "./storage";

export async function enableBiometric(
  userId: string
) {
  try {
    await BiometricAuth.authenticate({
      reason: "Activa el ingreso con huella",
      allowDeviceCredential: true,
    });

    const {
      data,
      error,
    } = await supabase.auth.getSession();

    if (error || !data.session) {
      console.error(
        "[BIOMETRIC] No se pudo obtener la sesión actual:",
        error
      );

      return false;
    }

    if (data.session.user.id !== userId) {
      console.error(
        "[BIOMETRIC] El usuario de la sesión no coincide."
      );

      return false;
    }

    await saveBiometricUser({
      userId,
      refreshToken: data.session.refresh_token,
      enabled: true,
    });

    console.log(
      "[BIOMETRIC] Activado correctamente."
    );

    return true;
  } catch (error) {
    console.error(
      "[BIOMETRIC] Error activando:",
      error
    );

    return false;
  }
}