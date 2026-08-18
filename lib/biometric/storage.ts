import { SecureStorage } from "@aparajita/capacitor-secure-storage";

const KEY = "wolf_biometric_user";

export async function saveBiometricUser(data: unknown) {
  await SecureStorage.set(
    KEY,
    JSON.stringify(data)
  );
}

export async function getBiometricUser() {
  const value = await SecureStorage.get(KEY);

  if (value === null) {
    return null;
  }

  if (typeof value !== "string") {
    return value;
  }

  return JSON.parse(value);
}

export async function clearBiometricUser() {
  await SecureStorage.remove(KEY);
}
