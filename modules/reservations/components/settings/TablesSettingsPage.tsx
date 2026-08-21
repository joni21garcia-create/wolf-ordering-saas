"use client";

import { TablesSettings } from "./sections/TablesSettings";

type TablesSettingsPageProps = {
  restaurantId: string;
};

export function TablesSettingsPage({
  restaurantId,
}: TablesSettingsPageProps) {
  return (
    <TablesSettings
      restaurantId={restaurantId}
    />
  );
}