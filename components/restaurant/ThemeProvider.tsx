"use client";

interface Props {
  theme: any;
}

export default function ThemeProvider({
  theme,
}: Props) {
  if (!theme) return null;

  return (
    <style jsx global>{`
      :root {
        --primary-color: ${theme.primary_color};
        --secondary-color: ${theme.secondary_color};
        --background-color: ${theme.background_color};
        --text-color: ${theme.text_color};
      }
    `}</style>
  );
}