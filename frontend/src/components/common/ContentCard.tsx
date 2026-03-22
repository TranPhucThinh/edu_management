import * as React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ContentCardProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  footerClassName?: string;
}

export function ContentCard({
  title,
  description,
  footer,
  children,
  className,
  headerClassName,
  contentClassName,
  footerClassName,
}: ContentCardProps) {
  return (
    <Card
      className={cn("w-full shadow-xl border-border", className)}
    >
      <CardHeader className={cn("space-y-1 text-center", headerClassName)}>
        <CardTitle className="text-xl font-semibold">{title}</CardTitle>
        {description != null && (
          <CardDescription>{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className={contentClassName}>{children}</CardContent>
      {footer != null && (
        <CardFooter
          className={cn("justify-center border-t p-6", footerClassName)}
        >
          {footer}
        </CardFooter>
      )}
    </Card>
  );
}
