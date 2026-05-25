import * as React from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className = "",
      type = "text",
      error,
      ...props
    },
    ref,
  ) => {
    return (
      <input
        type={type}
        ref={ref}
        className={`
          flex
          h-11
          w-full

          rounded-lg

          border
          bg-[#0a0a0a]

          px-4
          py-2

          font-sans
          text-sm
          text-foreground

          placeholder:text-muted-foreground/50

          transition-all
          duration-200

          outline-none

          disabled:cursor-not-allowed
          disabled:opacity-50

          autofill:bg-[#0a0a0a]

          ${
            error
              ? `
                border-destructive
                focus-visible:border-destructive
                focus-visible:ring-2
                focus-visible:ring-destructive/15
              `
              : `
                border-border
                hover:border-[#303030]

                focus-visible:border-primary
                focus-visible:ring-2
                focus-visible:ring-primary/20
              `
          }

          ${className}
        `}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";