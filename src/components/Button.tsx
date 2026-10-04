import type { ReactNode } from "react";
import { Magnetic } from "./Magnetic";

interface Props {
  children: ReactNode;
  variant?: "primary" | "ghost";
  href?: string;
  onClick?: () => void;
  icon?: ReactNode;
  external?: boolean;
  className?: string;
  ariaLabel?: string;
}

const base =
  "inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-full px-6 text-[15px] font-semibold transition-[background-color,box-shadow,transform] duration-300 ease-out-expo active:scale-[0.97]";

const variants = {
  primary:
    "bg-sun text-deep shadow-[0_12px_32px_-12px_rgba(255,106,43,0.9)] hover:bg-[#ffd24d] hover:shadow-[0_16px_40px_-10px_rgba(240,40,110,0.8)]",
  ghost: "border border-cream/45 text-cream hover:border-cream hover:bg-cream/10",
};

export function Button({ children, variant = "primary", href, onClick, icon, external, className = "", ariaLabel }: Props) {
  const cls = `${base} ${variants[variant]} ${className}`;
  const content = (
    <>
      {children}
      {icon}
    </>
  );
  return (
    <Magnetic>
      {href ? (
        <a
          href={href}
          className={cls}
          aria-label={ariaLabel}
          onClick={onClick}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {content}
        </a>
      ) : (
        <button type="button" onClick={onClick} className={cls} aria-label={ariaLabel}>
          {content}
        </button>
      )}
    </Magnetic>
  );
}
