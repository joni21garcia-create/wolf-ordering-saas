"use client";

import LoginBackground from "./components/LoginBackground";
import LoginCard from "./components/LoginCard";
import LoginHero from "./components/LoginHero";
import LoginForm from "./components/LoginForm";

interface LoginViewProps {
  isMounted: boolean;

  email: string;
  setEmail: (value: string) => void;

  password: string;
  setPassword: (value: string) => void;

  rememberMe: boolean;
  setRememberMe: (value: boolean) => void;

  loading: boolean;

login: () => void;
resetPassword: () => void;
loginWithGoogle: () => void;
loginWithBiometric: () => void;
biometricEnabled: boolean;
}

export default function LoginView({
  isMounted,
  email,
  setEmail,
  password,
  setPassword,
  rememberMe,
  setRememberMe,
  loading,
  login,
resetPassword,
loginWithGoogle,
loginWithBiometric,
biometricEnabled,
}: LoginViewProps) {
  if (!isMounted) return null;

  return (
    <LoginBackground>
      <LoginCard>
        <LoginHero />

        <LoginForm
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          rememberMe={rememberMe}
          setRememberMe={setRememberMe}
          loading={loading}
          login={login}
          resetPassword={resetPassword}
          loginWithGoogle={loginWithGoogle}
          loginWithBiometric={loginWithBiometric}
          biometricEnabled={biometricEnabled}
        />
      </LoginCard>
    </LoginBackground>
  );
}