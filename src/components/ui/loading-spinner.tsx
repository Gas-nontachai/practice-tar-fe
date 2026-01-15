import type { HTMLAttributes } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type LoadingSpinnerProps = HTMLAttributes<HTMLDivElement> & {
  label?: string;
};

const LoadingSpinner = ({
  label = "Loading...",
  className,
  ...props
}: LoadingSpinnerProps) => {
  return (
    <div
      className={cn(
        "flex items-center gap-2 text-sm text-slate-500",
        className,
      )}
      {...props}
    >
      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
};

export default LoadingSpinner;
