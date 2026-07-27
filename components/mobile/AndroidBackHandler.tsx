"use client";

import { useEffect } from "react";
import { App } from "@capacitor/app";

export default function AndroidBackHandler() {

  useEffect(() => {

    const listener = App.addListener("backButton", ({ canGoBack }) => {

      console.log("Back Button", canGoBack);

    });

    return () => {

      listener.then(l => l.remove());

    };

  }, []);

  return null;

}