import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type StatusBadgeStatus = "active" | "archived" | "upcoming";

export type StatusBadgeVariant = "chip" | "pill";

interface StatusBadgeProps {
  /** Semantic status key – can be reused across domains (classes, courses, etc.) */
  status: StatusBadgeStatus;
  /** Visible text label, already translated if needed */
  label: string;
  /** Visual style, default is compact chip style */
  variant?: StatusBadgeVariant;
  className?: string;
}

const chipStatusClasses: Record<StatusBadgeStatus, string> = {
  active: "bg-status-active/10 text-status-active",
  archived: "bg-status-archived/40 text-status-archived-foreground",
  upcoming: "bg-status-upcoming/10 text-status-upcoming-foreground",
};

const pillStatusClasses: Record<StatusBadgeStatus, string> = {
  active: "bg-status-active/10 text-status-active",
  archived: "bg-status-archived/10 text-status-archived-foreground",
  upcoming: "bg-status-upcoming/10 text-status-upcoming-foreground",
};

const pillDotClasses: Record<StatusBadgeStatus, string> = {
  active: "bg-status-active",
  archived: "bg-status-archived",
  upcoming: "bg-status-upcoming",
};

export function StatusBadge({
  status,
  label,
  variant = "chip",
  className,
}: StatusBadgeProps) {
  if (variant === "pill") {
    return (
      <Badge
        variant="outline"
        className={cn(
          "px-2.5 py-0.5 text-xs font-semibold tracking-wider uppercase flex items-center gap-1 border-none",
          pillStatusClasses[status],
          className,
        )}
      >
        <span
          className={cn("w-1.5 h-1.5 rounded-full", pillDotClasses[status])}
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
        chipStatusClasses[status],
        className,
      )}
    >
      • {label}
    </Badge>
  );
}

