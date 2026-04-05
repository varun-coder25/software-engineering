import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] transition-colors",
  {
    variants: {
      variant: {
        default:
          "bg-sky-500/12 text-sky-300",
        success:
          "bg-emerald-500/12 text-emerald-300",
        destructive:
          "bg-rose-500/12 text-rose-300",
        warning:
          "bg-amber-500/12 text-amber-300",
        secondary:
          "bg-slate-800 text-slate-300"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
