import {
  BiometricAuth,
} from "@aparajita/capacitor-biometric-auth";

export async function testBiometric() {
  try {
    const result =
      await BiometricAuth.checkBiometry();

    console.log(
      "[BIOMETRIC CHECK]",
      result
    );

    if (!result.isAvailable) {
      alert(
        "Este dispositivo no tiene huella configurada."
      );
      return false;
    }

    alert(
      "Biometría disponible correctamente."
    );

    return true;

  } catch (error) {
    console.error(
      "[BIOMETRIC ERROR]",
      error
    );

    return false;
  }
}