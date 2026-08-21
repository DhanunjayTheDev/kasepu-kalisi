import { Link } from "react-router-dom";
import type { ComponentPropsWithoutRef, ElementType } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "outline" | "ghost" | "danger";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-teal text-ivory hover:bg-teal/90",
  outline: "border border-teal/25 text-teal hover:bg-teal/5",
  ghost: "text-teal hover:bg-teal/5",
  danger: "bg-terracotta text-ivory hover:bg-terracotta/90",
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

export function Button({ variant = "primary", className, href, ...props }: ButtonProps) {
  const classes = cn(
    "inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-2 font-sans text-sm font-semibold transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50",
    variantClasses[variant],
    className
  );

  if (href) {
    return (
      <Link to={href} className={classes} {...(props as Omit<ComponentPropsWithoutRef<typeof Link>, "to">)} />
    );
  }

  const Comp: ElementType = "button";
  return <Comp className={classes} {...(props as ComponentPropsWithoutRef<"button">)} />;
}
