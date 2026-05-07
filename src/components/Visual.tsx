import { cn } from "@/lib/utils";

type Props = {
  variant?: "walnut" | "cafe" | "lounge" | "hotel" | "dining" | "ink" | "warm";
  className?: string;
  children?: React.ReactNode;
  label?: string;
};

const palettes: Record<NonNullable<Props["variant"]>, string> = {
  walnut:
    "radial-gradient(120% 80% at 30% 20%, #8b6244 0%, #5a3b2c 45%, #1f1612 100%)",
  cafe:
    "radial-gradient(110% 80% at 70% 30%, #c7a66a 0%, #6e4b3a 40%, #1a1411 100%)",
  lounge:
    "radial-gradient(120% 90% at 20% 80%, #2c2c2c 0%, #181818 55%, #0b0b0b 100%)",
  hotel:
    "radial-gradient(120% 80% at 50% 30%, #d8c39a 0%, #6e4b3a 50%, #111 100%)",
  dining:
    "radial-gradient(120% 80% at 80% 20%, #c7a66a 0%, #2c2c2c 50%, #0d0d0d 100%)",
  ink: "linear-gradient(160deg, #1a1a1a, #0a0a0a)",
  warm: "linear-gradient(160deg, #f6f2ec, #e6dfd2)",
};

export function Visual({ variant = "walnut", className, children, label }: Props) {
  return (
    <div
      className={cn(
        "relative overflow-hidden grain isolate",
        className,
      )}
      style={{ backgroundImage: palettes[variant] }}
      aria-label={label}
      role="img"
    >
      {/* light streak */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-y-10 -left-10 w-1/2 opacity-20"
        style={{
          background:
            "linear-gradient(115deg, transparent 30%, rgba(246,242,236,.6) 50%, transparent 70%)",
          mixBlendMode: "screen",
          filter: "blur(20px)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,.45) 100%)",
        }}
      />
      {children}
    </div>
  );
}
