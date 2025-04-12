// components/ui/typography/heading.tsx
import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@repo/ui/lib";

// Define the heading variants using CVA
const headingVariants = cva("font-heading tracking-tight", {
  variants: {
    size: {
      h1: "text-4xl lg:text-5xl",
      h2: "text-3xl lg:text-4xl",
      h3: "text-2xl lg:text-3xl",
      h4: "text-xl lg:text-2xl",
      h5: "text-lg lg:text-xl",
      h6: "text-base lg:text-lg",
    },
    weight: {
      thin: "font-[var(--font-weight-thin)]",
      extraLight: "font-[var(--font-weight-extra-light)]",
      light: "font-[var(--font-weight-light)]",
      normal: "font-[var(--font-weight-normal)]",
      medium: "font-[var(--font-weight-medium)]",
      semibold: "font-[var(--font-weight-semibold)]",
      bold: "font-[var(--font-weight-bold)]",
      extraBold: "font-[var(--font-weight-extra-bold)]",
      black: "font-[var(--font-weight-black)]",
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    },
    variant: {
      default: "text-card-foreground",
      primary: "text-primary",
      secondary: "text-secondary",
      muted: "text-muted-foreground",
      accent: "text-accent",
    },
  },
  defaultVariants: {
    size: "h2",
    weight: "bold",
    align: "left",
    variant: "default",
  },
});

// Define the component props with VariantProps from CVA
export interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  (
    {
      className,
      children,
      size,
      weight,
      align,
      variant,
      as: Component = "h2",
      ...props
    },
    ref
  ) => {
    return (
      <Component
        className={cn(headingVariants({ size, weight, align, variant }), className)}
        ref={ref}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Heading.displayName = "Heading";
