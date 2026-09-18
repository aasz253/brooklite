import Image from "next/image";
import { GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

interface SmartImageProps {
  src?: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  sizes?: string;
  preload?: boolean;
}

export function SmartImage({
  src,
  alt,
  className,
  imgClassName,
  sizes,
  preload,
}: SmartImageProps) {
  if (!src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn(
          "flex items-center justify-center bg-gradient-to-br from-royal-100 via-royal-50 to-mint-50",
          className,
        )}
      >
        <GraduationCap
          className="h-12 w-12 text-royal-300"
          aria-hidden="true"
        />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      preload={preload}
      sizes={sizes ?? "(max-width: 768px) 100vw, 50vw"}
      className={cn("object-cover", imgClassName)}
    />
  );
}