import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.wolfordering.app",
  appName: "Wolf Ordering",
  server: {
    url: "https://app.wolfordering.com/discover",
    cleartext: false,
  },
};

export default config;