"use client";

import { useLogin } from "./hooks/useLogin";

import { LoginLogo } from "./components/LoginLogo";
import { LoginForm } from "./components/LoginForm";
import { LoginFooter } from "./components/LoginFooter";
import { LoginButtons } from "./components/LoginButtons";
import { LoginBackground } from "./components/LoginBackground";

export default function LoginPage() {
  const login = useLogin();

  if (!login.isMounted) return null;

  return (
    <LoginBackground>
      <LoginLogo />

      <LoginForm login={login} />

      <LoginButtons login={login} />

      <LoginFooter />
    </LoginBackground>
  );
}