import { Suspense } from "react";
import LoginClient from "./LoginClient";

export default function Page() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <LoginClient />
    </Suspense>
  );
}