import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  containerClassName?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, containerClassName, type = "text", prefix, suffix, ...props },
    ref,
  ) => {
    return (
      <div className={cn("relative w-full", containerClassName)}>
        {prefix && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
            <div className="flex h-6 w-6 items-center justify-center">
              {prefix}
            </div>
          </div>
        )}

        <input
          ref={ref}
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
            "shadow-sm transition-all",
            "placeholder:text-muted-foreground",
            "hover:border-ring/50",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            prefix && "pl-10",
            suffix && "pr-10",
            className,
          )}
          {...props}
        />

        {suffix && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground">
            <div className="flex h-6 w-6 items-center justify-center">
              {suffix}
            </div>
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
