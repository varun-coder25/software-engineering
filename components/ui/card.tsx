import * as React from "react";
import { cn } from "@/lib/utils";

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      className={cn(
        "rounded-3xl border border-slate-200/80 bg-white/95 shadow-[0_24px_48px_-36px_rgba(15,23,42,0.28)] backdrop-blur dark:border-slate-800 dark:bg-slate-950/72",
        className
      )}
      ref={ref}
      {...props}
    />
  )
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div className={cn("flex flex-col space-y-1.5 p-6", className)} ref={ref} {...props} />
  )
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      className={cn("text-xl font-semibold tracking-tight text-slate-950 dark:text-white", className)}
      ref={ref}
      {...props}
    />
  )
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    className={cn("text-sm leading-6 text-slate-600 dark:text-slate-400", className)}
    ref={ref}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div className={cn("p-6 pt-0", className)} ref={ref} {...props} />
);
CardContent.displayName = "CardContent";

export { Card, CardContent, CardDescription, CardHeader, CardTitle };
