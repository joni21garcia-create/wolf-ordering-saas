"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export interface ReservationWizardData {
  date?: string;
  time?: string;
  guests?: number;
  type?: string;
  typeName?: string;
  customerName?: string;
  phone?: string;
  email?: string;
  service?: string;
  serviceName?: string;
  services?: string[];
  notes?: string;
  customerNotes?: string;
}

export interface ReservationWizardContextValue {
  currentStep: number;
  totalSteps: number;
  data: ReservationWizardData;
  next: () => void;
  previous: () => void;
  goTo: (step: number) => void;
  update: (values: Partial<ReservationWizardData>) => void;
  reset: () => void;
}

const ReservationWizardContext =
  createContext<ReservationWizardContextValue | null>(null);

interface Props {
  children: ReactNode;
  totalSteps: number;
}

export function ReservationWizardProvider({
  children,
  totalSteps,
}: Props) {
  const safeTotalSteps = Math.max(1, totalSteps);

  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] =
    useState<ReservationWizardData>({});

  const next = useCallback(() => {
    setCurrentStep((step) =>
      Math.min(step + 1, safeTotalSteps - 1)
    );
  }, [safeTotalSteps]);

  const previous = useCallback(() => {
    setCurrentStep((step) =>
      Math.max(step - 1, 0)
    );
  }, []);

  const goTo = useCallback(
    (step: number) => {
      if (!Number.isFinite(step)) return;

      setCurrentStep(
        Math.min(
          Math.max(Math.trunc(step), 0),
          safeTotalSteps - 1
        )
      );
    },
    [safeTotalSteps]
  );

  const update = useCallback(
    (values: Partial<ReservationWizardData>) => {
      setData((previous) => ({
        ...previous,
        ...values,
      }));
    },
    []
  );

  const reset = useCallback(() => {
    setCurrentStep(0);
    setData({});
  }, []);

  const value = useMemo(
    () => ({
      currentStep,
      totalSteps: safeTotalSteps,
      data,
      next,
      previous,
      goTo,
      update,
      reset,
    }),
    [
      currentStep,
      safeTotalSteps,
      data,
      next,
      previous,
      goTo,
      update,
      reset,
    ]
  );

  return (
    <ReservationWizardContext.Provider value={value}>
      {children}
    </ReservationWizardContext.Provider>
  );
}

export function useReservationWizard() {
  const context = useContext(
    ReservationWizardContext
  );

  if (!context) {
    throw new Error(
      "useReservationWizard must be used inside ReservationWizardProvider"
    );
  }

  return context;
}