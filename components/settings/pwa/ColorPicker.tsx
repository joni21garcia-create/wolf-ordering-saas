"use client";

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
}

export default function ColorPicker({
  label,
  value,
  onChange,
}: ColorPickerProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <label
        style={{
          fontWeight: 600,
          fontSize: 14,
        }}
      >
       {label && (
  <label
    style={{
      fontWeight: 600,
      fontSize: 14,
      color: "#fff",
    }}
  >
    {label}
  </label>
)}
      </label>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
<input
  key={value}
  type="color"
  value={value}
  onChange={(e) =>
    onChange(e.target.value)
  }
  style={{
    width: 55,
    height: 55,
    border: "none",
    cursor: "pointer",
    background: "transparent",
  }}
/>

        <input
          type="text"
          value={value}
          onChange={(e) =>
            onChange(e.target.value)
          }
          placeholder="#000000"
          style={{
            flex: 1,
            height: 45,
            borderRadius: 10,
            border: "1px solid #ddd",
            padding: "0 14px",
            fontSize: 15,
          }}
        />

        <div
          style={{
            width: 45,
            height: 45,
            borderRadius: 10,
            border: "1px solid #ddd",
            background: value,
          }}
        />
      </div>
    </div>
  );
}