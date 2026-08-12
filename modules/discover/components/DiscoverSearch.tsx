"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
} from "react";
import { Search, X, SlidersHorizontal } from "lucide-react";

interface DiscoverSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

const wrapperStyle: CSSProperties = {
  width: "100%",
};

const formStyle: CSSProperties = {
  position: "relative",
  width: "100%",
};

const inputStyle: CSSProperties = {
  width: "100%",
  height: "52px",
  boxSizing: "border-box",
  padding: "0 48px 0 47px",
  border: "1px solid rgba(255,255,255,0.085)",
  borderRadius: "16px",
  outline: "none",
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.062), rgba(255,255,255,0.045))",
  color: "#ffffff",
  fontSize: "14px",
  fontWeight: 520,
  lineHeight: 1,
  letterSpacing: "-0.01em",
  boxShadow:
    "inset 0 1px 0 rgba(255,255,255,0.035), 0 8px 24px rgba(0,0,0,0.10)",
  WebkitAppearance: "none",
};

const searchIconStyle: CSSProperties = {
  position: "absolute",
  left: "16px",
  top: "50%",
  transform: "translateY(-50%)",
  color: "rgba(255,255,255,0.48)",
  pointerEvents: "none",
  transition: "color 180ms ease, transform 180ms ease",
};

const clearButtonStyle: CSSProperties = {
  position: "absolute",
  right: "9px",
  top: "50%",
  transform: "translateY(-50%)",
  width: "34px",
  height: "34px",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  border: "1px solid rgba(255,255,255,0.07)",
  borderRadius: "11px",
  background: "rgba(255,255,255,0.055)",
  color: "rgba(255,255,255,0.76)",
  cursor: "pointer",
  WebkitTapHighlightColor: "transparent",
  transition: "transform 160ms ease, background 160ms ease",
};

const styles = `
.discover-search-input::placeholder {
  color: rgba(255,255,255,0.38);
}

.discover-search-input:focus {
  border-color: rgba(249,115,22,0.30) !important;
  background:
    linear-gradient(180deg, rgba(255,255,255,0.07), rgba(255,255,255,0.045)) !important;
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.04),
    0 0 0 3px rgba(249,115,22,0.055),
    0 10px 28px rgba(0,0,0,0.13) !important;
}

.discover-search-input:focus + .discover-search-icon {
  color: rgba(249,115,22,0.88);
  transform: translateY(-50%) scale(1.04);
}

.discover-search-clear:active {
  transform: translateY(-50%) scale(.93);
}

.discover-search-input::-webkit-search-cancel-button {
  -webkit-appearance: none;
  appearance: none;
}

@media (prefers-reduced-motion: reduce) {
  .discover-search-input,
  .discover-search-icon,
  .discover-search-clear {
    transition: none !important;
  }
}
`;

export default function DiscoverSearch({
  value,
  onChange,
  placeholder = "Buscar restaurantes o comida",
  autoFocus = false,
}: DiscoverSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (autoFocus) {
      inputRef.current?.focus();
    }
  }, [autoFocus]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    inputRef.current?.blur();
  };

  const handleClear = () => {
    onChange("");
    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  };

  return (
    <>
      <style>{styles}</style>

      <div style={wrapperStyle}>
        <form
          role="search"
          onSubmit={handleSubmit}
          style={formStyle}
        >
          <Search
            size={19}
            strokeWidth={1.85}
            aria-hidden="true"
            className="discover-search-icon"
            style={{
              ...searchIconStyle,
              color: focused
                ? "rgba(249,115,22,0.88)"
                : searchIconStyle.color,
            }}
          />

          <input
            ref={inputRef}
            type="search"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={placeholder}
            autoFocus={autoFocus}
            aria-label="Buscar restaurantes o comida"
            enterKeyHint="search"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            className="discover-search-input"
            style={inputStyle}
          />

          {value.trim() ? (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Limpiar búsqueda"
              className="discover-search-clear"
              style={clearButtonStyle}
            >
              <X
                size={16}
                strokeWidth={2.15}
                aria-hidden="true"
              />
            </button>
          ) : null}
        </form>
      </div>
    </>
  );
}