import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type CenteredContainerProps = {
  children: ReactNode;
  className?: string;
};

const CenteredContainer = ({ children, className }: CenteredContainerProps) => {
  return (
    <div className="h-screen overflow-hidden bg-slate-50 px-6 py-10">
      <div
        className={cn(
          "mx-auto flex w-full max-w-4xl flex-col gap-6",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default CenteredContainer;
