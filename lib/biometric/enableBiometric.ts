import { BiometricAuth } from "@aparajita/capacitor-biometric-auth";
import { saveBiometricUser } from "./storage";

export async function enableBiometric(userId: string) {
  try {
    await BiometricAuth.authenticate({
      reason: "Activa el ingreso con huella",
      allowDeviceCredential: true,
    });

    await saveBiometricUser({
      userId,
      enabled: true,
    });

    console.log(
      "[BIOMETRIC] Activado correctamente"
    );

    return true;

  } catch (error) {
    console.error(
      "[BIOMETRIC] Error activando",
      error
    );

    return false;
  }
}