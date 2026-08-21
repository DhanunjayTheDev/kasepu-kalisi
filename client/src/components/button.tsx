import { Link } from "react-router-dom";
import type { ComponentPropsWithoutRef, ElementType } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "outline" | "ghost" | "danger";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-terracotta text-ivory hover:bg-terracotta/90 focus-visible:outline-terracotta",
  outline:
    "border border-teal text-teal hover:bg-teal hover:text-ivory focus-visible:outline-teal",
  ghost: "text-teal hover:bg-teal/10 focus-visible:outline-teal",
  danger: "bg-terracotta text-ivory hover:bg-terracotta/90 focus-visible:outline-terracotta",
};

interface ButtonBaseProps {
  variant?: ButtonVariant;
  href?: string;
}

type ButtonProps = ButtonBaseProps &
  (
    | ({ href: string } & Omit<ComponentPropsWithoutRef<typeof Link>, "to" | "href">)
    | ({ href?: undefined } & ComponentPropsWithoutRef<"button">)
  );

export function Button({
  variant = "primary",
  className,
  href,
  ...props
}: ButtonProps) {
  const classes = cn(
    "inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full px-6 py-3 font-sans text-sm font-semibold transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
    variantClasses[variant],
    className
  );

  if (href) {
    return (
      <Link
        to={href}
        className={classes}
        {...(props as Omit<ComponentPropsWithoutRef<typeof Link>, "to">)}
      />
    );
  }

  const Comp: ElementType = "button";
  return (
    <Comp className={classes} {...(props as ComponentPropsWithoutRef<"button">)} />
  );
}
