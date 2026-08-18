import { SecureStorage } from "@aparajita/capacitor-secure-storage";

const KEY = "wolf_biometric_user";

export interface BiometricUser {
  userId: string;
  refreshToken: string;
  enabled: boolean;
}

export async function saveBiometricUser(
  data: BiometricUser
) {
  await SecureStorage.set(
    KEY,
    JSON.stringify(data)
  );
}

export async function getBiometricUser(): Promise<
  BiometricUser | null
> {
  const value =
    await SecureStorage.get(KEY);

  if (value === null) {
    return null;
  }

  let parsed: unknown;

  try {
    parsed =
      typeof value === "string"
        ? JSON.parse(value)
        : value;
  } catch (error) {
    console.error(
      "[BIOMETRIC] Datos almacenados corruptos:",
      error
    );

    await clearBiometricUser();

    return null;
  }

  if (
    typeof parsed !== "object" ||
    parsed === null
  ) {
    return null;
  }

  const data =
    parsed as Partial<BiometricUser>;

  if (
    typeof data.userId !== "string" ||
    typeof data.refreshToken !== "string" ||
    data.refreshToken.length === 0 ||
    data.enabled !== true
  ) {
    return null;
  }

  return {
    userId: data.userId,
    refreshToken: data.refreshToken,
    enabled: true,
  };
}

export async function clearBiometricUser() {
  await SecureStorage.remove(KEY);
}