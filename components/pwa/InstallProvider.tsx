"use client";

import { useEffect } from "react";

export default function InstallProvider() {

  useEffect(() => {

    function onBeforeInstallPrompt(
      event: Event
    ) {

      event.preventDefault();

      console.log(
        "[PWA] beforeinstallprompt"
      );

    }

    window.addEventListener(
      "beforeinstallprompt",
      onBeforeInstallPrompt
    );

    return () => {

      window.removeEventListener(
        "beforeinstallprompt",
        onBeforeInstallPrompt
      );

    };

  }, []);

  return null;

}