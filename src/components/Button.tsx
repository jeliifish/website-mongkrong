type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  fullWidth?: boolean;
};

export default function Button({
  children,
  className = "",
  fullWidth = false,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`${fullWidth ? "flex w-full" : "inline-flex"} h-14 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#1f7a4a_0%,#2fa866_100%)] px-10 text-base font-semibold text-white shadow-[0_18px_32px_rgba(31,122,74,0.24)] transition hover:translate-y-[-1px] hover:shadow-[0_22px_36px_rgba(31,122,74,0.3)] ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
