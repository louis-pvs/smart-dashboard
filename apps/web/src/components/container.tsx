import React, { forwardRef } from "react";
import { ScrollArea } from "@repo/ui/components/scroll-area";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@repo/ui/lib";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
  children?: React.ReactNode;
}

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, asChild, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";

    return (
      <ScrollArea className="w-full">
        <Comp
          className={cn("min-w-fit", className)}
          {...props}
          ref={ref}>
          {children}
        </Comp>
      </ScrollArea>
    );
  }
);

Container.displayName = "Container";

export default Container;
