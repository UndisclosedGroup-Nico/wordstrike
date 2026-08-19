import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "ghost" | "danger" | "gold";

const variants: Record<Variant, string> = {
  primary:
    "bg-mint text-ink hover:bg-mint-bright shadow-[0_0_24px_color-mix(in_oklab,var(--mint)_30%,transparent)]",
  ghost:
    "border border-line bg-transparent text-fog hover:text-paper hover:border-mint/50",
  danger: "bg-rose text-paper hover:bg-rose-bright",
  gold: "bg-gold text-ink hover:bg-gold-bright",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export function Button({
  variant = "primary",
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold tracking-wide uppercase transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
