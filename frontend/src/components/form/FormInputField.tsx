"use client";

import * as React from "react";
import type { FieldPath, FieldValues } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import type { FormFieldLayoutProps } from "./FormFieldLayout";
import { FormFieldLayout } from "./FormFieldLayout";

const defaultInputClassName =
  "h-11 border-input focus:bg-background transition-all";

export interface FormInputFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  control: FormFieldLayoutProps<TFieldValues, TName>["control"];
  name: TName;
  label: React.ReactNode;
  description?: React.ReactNode;
  labelExtra?: React.ReactNode;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
  disabled?: boolean;
  inputClassName?: string;
  /** Left-side icon (e.g. User, Mail, Lock) - absolutely positioned */
  leftIcon?: React.ReactNode;
  /** Right-side slot (e.g. password visibility toggle button) - absolutely positioned */
  rightSlot?: React.ReactNode;
}

export function FormInputField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  labelExtra,
  placeholder,
  type = "text",
  disabled,
  inputClassName,
  leftIcon,
  rightSlot,
}: FormInputFieldProps<TFieldValues, TName>) {
  return (
    <FormFieldLayout
      control={control}
      name={name}
      label={label}
      description={description}
      labelExtra={labelExtra}
      renderControl={({ value, onChange, onBlur, ref }) => (
        <div className="relative">
          {leftIcon != null && (
            <div className="pointer-events-none absolute left-3 top-3 text-muted-foreground">
              {leftIcon}
            </div>
          )}
          <Input
            ref={ref}
            type={type}
            placeholder={placeholder}
            value={value ?? ""}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled}
            className={cn(
              defaultInputClassName,
              disabled && "bg-muted",
              leftIcon != null && "pl-9",
              rightSlot != null && "pr-9",
              inputClassName,
            )}
          />
          {rightSlot != null && (
            <div className="absolute right-3 top-3 text-muted-foreground [&_button]:hover:text-foreground">
              {rightSlot}
            </div>
          )}
        </div>
      )}
    />
  );
}
