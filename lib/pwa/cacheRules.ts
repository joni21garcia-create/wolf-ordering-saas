export const CACHE_NAMES = {
  STATIC: "wolf-static",
  DYNAMIC: "wolf-dynamic",
  IMAGES: "wolf-images",
};

export const NEVER_CACHE = [
  "/api/",
  "/login",
  "/logout",
  "/auth",
  "/_next/webpack-hmr",
];

export function shouldNeverCache(url: string) {
  return NEVER_CACHE.some((path) =>
    url.includes(path)
  );
}