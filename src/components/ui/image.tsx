import * as React from "react";
import { cn } from "@/lib/utils";

type ImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  containerClassName?: string;
  aspectRatio?: number;
  fill?: boolean;
  fallbackSrc?: string;
};

const Image = React.forwardRef<HTMLImageElement, ImageProps>(
  (
    {
      className,
      containerClassName,
      aspectRatio,
      fill = false,
      fallbackSrc,
      loading = "lazy",
      decoding = "async",
      onLoad,
      onError,
      ...props
    },
    ref,
  ) => {
    const [loaded, setLoaded] = React.useState(false);
    const [failed, setFailed] = React.useState(false);

    const widthValue =
      typeof props.width === "number" ? props.width : undefined;
    const heightValue =
      typeof props.height === "number" ? props.height : undefined;
    const computedAspect =
      aspectRatio ?? (widthValue && heightValue ? widthValue / heightValue : 0);

    const resolvedSrc = failed && fallbackSrc ? fallbackSrc : props.src;

    return (
      <div
        className={cn(
          "relative overflow-hidden rounded-md bg-muted",
          fill ? "h-full w-full" : "inline-block",
          containerClassName,
        )}
        style={computedAspect ? { aspectRatio: String(computedAspect) } : undefined}
      >
        <img
          ref={ref}
          {...props}
          src={resolvedSrc}
          loading={loading}
          decoding={decoding}
          className={cn(
            "h-full w-full object-cover transition-opacity duration-300",
            fill && "absolute inset-0",
            !loaded && "opacity-0",
            className,
          )}
          onLoad={(event) => {
            setLoaded(true);
            onLoad?.(event);
          }}
          onError={(event) => {
            if (fallbackSrc && resolvedSrc !== fallbackSrc) {
              setFailed(true);
            }
            onError?.(event);
          }}
        />
        {!loaded && <div className="absolute inset-0 animate-pulse bg-muted" />}
      </div>
    );
  },
);

Image.displayName = "Image";

export { Image };
