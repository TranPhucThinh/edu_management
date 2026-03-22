import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/** Internal key for styling maps (derived from `isActive`). */
type StatusBadgeKey = "active" | "inactive";

export type StatusBadgeVariant = "chip" | "pill";

interface StatusBadgeProps {
  /** Row active flag from API (e.g. Prisma `isActive`). */
  isActive: boolean;
  /** Visible text label, already translated if needed */
  label: string;
  /** Visual style, default is compact chip style */
  variant?: StatusBadgeVariant;
  className?: string;
}

const chipStatusClasses: Record<StatusBadgeKey, string> = {
  active: "bg-status-active/10 text-status-active",
  inactive: "bg-status-inactive/40 text-status-inactive-foreground",
};

const pillStatusClasses: Record<StatusBadgeKey, string> = {
  active: "bg-status-active/10 text-status-active",
  inactive: "bg-status-inactive/10 text-status-inactive-foreground",
};

const pillDotClasses: Record<StatusBadgeKey, string> = {
  active: "bg-status-active",
  inactive: "bg-status-inactive",
};

export function StatusBadge({
  isActive,
  label,
  variant = "chip",
  className,
}: StatusBadgeProps) {
  const key: StatusBadgeKey = isActive ? "active" : "inactive";

  if (variant === "pill") {
    return (
      <Badge
        variant="outline"
        className={cn(
          "px-2.5 py-0.5 text-xs font-semibold tracking-wider uppercase flex items-center gap-1 border-none",
          pillStatusClasses[key],
          className,
        )}
      >
        <span
          className={cn("w-1.5 h-1.5 rounded-full", pillDotClasses[key])}
        />
        {label}
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className={cn(
        "px-2.5 py-0.5 text-xs font-bold tracking-wider bg-card border-none",
        chipStatusClasses[key],
        className,
      )}
    >
      • {label}
    </Badge>
  );
}
