export type RestaurantOnboardingStep =
  | "own-app"
  | "direct-orders"
  | "ecosystem"
  | "activation";

export type RestaurantPlan = "basic" | "pro";

export interface OnboardingScreen {
  id: RestaurantOnboardingStep;
  eyebrow?: string;
  title: string;
  description: string;
}

export interface RestaurantOnboardingProps {
  onComplete?: () => void;
  onClose?: () => void;
}