export interface Coordinates {
  latitude: number | null | undefined;
  longitude: number | null | undefined;
}

function isValidCoordinate(value: number | null | undefined): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

export function calculateDistanceKm(
  from: Coordinates,
  to: Coordinates,
): number | null {
  if (
    !isValidCoordinate(from.latitude) ||
    !isValidCoordinate(from.longitude) ||
    !isValidCoordinate(to.latitude) ||
    !isValidCoordinate(to.longitude)
  ) {
    return null;
  }

  const earthRadiusKm = 6371;
  const toRadians = (value: number) => (value * Math.PI) / 180;

  const latitudeDelta = toRadians(
    to.latitude - from.latitude,
  );
  const longitudeDelta = toRadians(
    to.longitude - from.longitude,
  );

  const latitude1 = toRadians(from.latitude);
  const latitude2 = toRadians(to.latitude);

  const a =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(latitude1) *
      Math.cos(latitude2) *
      Math.sin(longitudeDelta / 2) ** 2;

  const c =
    2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadiusKm * c;
}

export function formatDistance(distanceKm: number | null): string | null {
  if (distanceKm === null || !Number.isFinite(distanceKm)) {
    return null;
  }

  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m`;
  }

  return `${distanceKm.toFixed(distanceKm < 10 ? 1 : 0)} km`;
}