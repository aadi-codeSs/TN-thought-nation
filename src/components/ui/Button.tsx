import { forwardRef } from "react";
import type { ComponentPropsWithoutRef } from "react";

import { Loader2 } from "lucide-react";

type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  isLoading?: boolean;
  variant?: "primary" | "secondary" | "outline";
};

const baseStyles = `
  inline-flex items-center justify-center
  rounded-lg
  px-4 py-2
  h-11
  select-none
  whitespace-nowrap

  font-heading
  text-sm
  font-medium

  transition-all
  duration-200

  focus-visible:outline-none
  focus-visible:ring-2
  focus-visible:ring-primary/30

  disabled:pointer-events-none
  disabled:opacity-50

  active:scale-[0.985]
`;

const variants = {
  primary: `
    bg-primary
    text-primary-foreground
    
    border border-transparent

    hover:brightness-110
    hover:shadow-[0_0_24px_rgba(139,92,246,0.18)]

    active:brightness-95
  `,

  secondary: `
    bg-card
    text-foreground

    border border-border

    hover:bg-[#1a1a1a]
    hover:border-[#303030]

    active:bg-[#161616]
  `,

  outline: `
    bg-transparent
    text-muted-foreground

    border border-border

    hover:bg-[#1a1a1a]
    hover:text-foreground
    hover:border-[#2f2f2f]

    active:bg-[#151515]
  `,
} as const;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      disabled,
      isLoading,
      variant = "primary",
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`
          ${baseStyles}
          ${variants[variant]}
          ${className ?? ""}
        `}
        {...props}
      >
        {isLoading && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin opacity-70" />
        )}

        {children}
      </button>
    );
  },
);

Button.displayName = "Button";