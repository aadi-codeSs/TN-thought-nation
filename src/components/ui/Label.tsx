import { forwardRef } from "react";
import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

type LabelProps = ComponentPropsWithoutRef<"label">;

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          `
            font-heading
            text-[11px]
            font-semibold
            uppercase
            tracking-[0.08em]

            text-muted-foreground

            select-none
          `,
          className,
        )}
        {...props}
      />
    );
  },
);

Label.displayName = "Label";
