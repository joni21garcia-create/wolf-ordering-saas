import * as React from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={[
          "w-full",
          "rounded-2xl",
          "border",
          "border-gray-200",
          "bg-white",
          "px-4",
          "py-3",
          "text-sm",
          "text-gray-900",
          "placeholder:text-gray-400",
          "shadow-sm",
          "transition-all",
          "outline-none",
          "focus:border-orange-500",
          "focus:ring-2",
          "focus:ring-orange-200",
          "disabled:cursor-not-allowed",
          "disabled:opacity-60",
          "file:border-0",
          "file:bg-transparent",
          "file:text-sm",
          "aria-invalid:border-red-500",
          "aria-invalid:ring-red-200",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export default Input;