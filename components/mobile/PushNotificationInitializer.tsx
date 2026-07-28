"use client";

import { useEffect } from "react";
import { initializePushNotifications } from "@/modules/reservations/services/pushNotifications";

export default function PushNotificationInitializer() {
  useEffect(() => {
    console.log("🔥 PushNotificationInitializer montado");
    initializePushNotifications();
  }, []);

  return null;
}