"use client";

import * as React from "react";
import type { ControllerRenderProps, FieldPath, FieldValues } from "react-hook-form";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export interface FormFieldLayoutProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  control: React.ComponentProps<typeof FormField<TFieldValues, TName>>["control"];
  name: TName;
  label: React.ReactNode;
  description?: React.ReactNode;
  /** Optional content in the label row (e.g. "Forgot password?" link) */
  labelExtra?: React.ReactNode;
  renderControl: (field: ControllerRenderProps<TFieldValues, TName>) => React.ReactNode;
  className?: string;
  labelClassName?: string;
  controlClassName?: string;
}

export function FormFieldLayout<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  labelExtra,
  renderControl,
  className,
  labelClassName,
  controlClassName,
}: FormFieldLayoutProps<TFieldValues, TName>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {labelExtra != null ? (
            <div className="flex items-center justify-between">
              <FormLabel className={labelClassName}>{label}</FormLabel>
              {labelExtra}
            </div>
          ) : (
            <FormLabel className={labelClassName}>{label}</FormLabel>
          )}
          <FormControl className={controlClassName}>
            {renderControl(field)}
          </FormControl>
          {description != null && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
