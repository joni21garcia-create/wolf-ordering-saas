"use client";

import { Search } from "lucide-react";
import ReservationInput from "../common/inputs/ReservationInput";

export interface ReservationSearchProps {
  value?: string;

  onChange?: (
    value: string
  ) => void;

  placeholder?: string;
}

export default function ReservationSearch({
  value = "",
  onChange,
  placeholder = "Buscar reserva...",
}: ReservationSearchProps) {
  return (
    <div className="relative w-full md:max-w-sm">
      <Search
        className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
      />

      <ReservationInput
        value={value}
        onChange={(e) =>
          onChange?.(e.target.value)
        }
        placeholder={placeholder}
        className="pl-10"
      />
    </div>
  );
}

