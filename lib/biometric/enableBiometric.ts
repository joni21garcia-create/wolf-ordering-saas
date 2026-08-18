import { BiometricAuth } from "@aparajita/capacitor-biometric-auth";
import { saveBiometricUser } from "./storage";

export async function enableBiometric(
  userId: string,
  refreshToken: string
) {
  try {
    await BiometricAuth.authenticate({
      reason: "Activa el ingreso con huella",
      allowDeviceCredential: true,
    });

    await saveBiometricUser({
      userId,
      refreshToken,
      enabled: true,
    });

    console.log("[BIOMETRIC] Guardado:", {
      userId,
      hasRefreshToken: !!refreshToken,
      enabled: true,
    });

    return true;
  } catch (error) {
    console.error(
      "[BIOMETRIC] Error activando",
      error
    );

    return false;
  }
}