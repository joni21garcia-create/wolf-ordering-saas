"use client";

import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({
  value,
  onChange,
}: SearchBarProps) {
  return (
    <div className="relative mb-6 w-full">
      <Search
        className="
          pointer-events-none
          absolute
          left-5
          top-1/2
          h-5
          w-5
          -translate-y-1/2
          text-zinc-500
          transition-colors
        "
      />

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="¿Qué deseas comer hoy?"
        className="
          h-14
          w-full
          rounded-2xl
          border
          border-zinc-800
          bg-zinc-900
          pl-14
          pr-5
          text-[15px]
          font-medium
          text-white
          placeholder:text-zinc-500
          shadow-lg
          outline-none
          transition-all
          duration-300

          hover:border-zinc-700

          focus:border-orange-500
          focus:bg-zinc-950
          focus:ring-4
          focus:ring-orange-500/10
        "
      />
    </div>
  );
}