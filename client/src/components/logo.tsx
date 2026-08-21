import { cn } from "@/lib/utils";

const LOGO_SRC = "/kasepu_kalisi_logo.png";

interface LogoProps {
  /** Renders the wordmark as a flat ivory silhouette, for use on teal/terracotta panels. */
  mono?: boolean;
  className?: string;
}

/**
 * The Kasepu Kalisi script wordmark. Always use this instead of typing the brand
 * name — the logo is the brand's primary identity asset.
 */
export function Logo({ mono = false, className }: LogoProps) {
  return (
    <img
      src={LOGO_SRC}
      alt="Kasepu Kalisi"
      className={cn("h-10 w-auto object-contain", mono && "brightness-0 invert", className)}
    />
  );
}
