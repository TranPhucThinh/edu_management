"use client";

import * as React from "react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";

import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

import { FormFieldLayout } from "./FormFieldLayout";

const optionListClassName =
  "rounded-md border border-input bg-muted p-2 space-y-1 max-h-[200px] overflow-y-auto";

const optionItemClassName =
  "flex items-center gap-2 rounded px-2 py-1.5 text-sm cursor-pointer hover:bg-muted/80 aria-invalid:border-destructive";

/** Default option shape when getLabel/getValue are not provided */
export type DefaultMultiSelectOption = { id: string | number; name: string };

export interface FormMultiSelectFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TOption = DefaultMultiSelectOption,
> {
  control: Control<TFieldValues>;
  name: TName;
  label: React.ReactNode;
  description?: React.ReactNode;
  labelExtra?: React.ReactNode;
  options: TOption[];
  /** Optional. Defaults to (option) => option.name when options have { id, name } */
  getLabel?: (option: TOption) => string;
  /** Optional. Defaults to (option) => option.id when options have { id, name } */
  getValue?: (option: TOption) => string | number;
  disabled?: boolean;
  /** Class name for the options container */
  optionsClassName?: string;
}

const defaultGetLabel = (o: DefaultMultiSelectOption) => o.name;
const defaultGetValue = (o: DefaultMultiSelectOption) => o.id;

export function FormMultiSelectField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TOption = DefaultMultiSelectOption,
>({
  control,
  name,
  label,
  description,
  labelExtra,
  options,
  getLabel = defaultGetLabel as (option: TOption) => string,
  getValue = defaultGetValue as (option: TOption) => string | number,
  disabled,
  optionsClassName,
}: FormMultiSelectFieldProps<TFieldValues, TName, TOption>) {
  return (
    <FormFieldLayout
      control={control}
      name={name}
      label={label}
      description={description}
      labelExtra={labelExtra}
      renderControl={({ value, onChange, onBlur, ref }) => {
        const selectedSet = new Set(
          (Array.isArray(value) ? value : [].concat(value ?? [])).map(
            String,
          ),
        );

        const toggle = (optionValue: string | number) => {
          const str = String(optionValue);
          const next = new Set(selectedSet);
          if (next.has(str)) next.delete(str);
          else next.add(str);
          onChange(Array.from(next));
          onBlur();
        };

        return (
          <div
            ref={ref as React.Ref<HTMLDivElement>}
            role="group"
            className={cn(optionListClassName, optionsClassName)}
            onBlur={onBlur}
          >
            {options.map((option, index) => {
              const val = getValue(option);
              const strVal = String(val);
              const isSelected = selectedSet.has(strVal);
              return (
                <label
                  key={index}
                  className={cn(
                    optionItemClassName,
                    disabled && "pointer-events-none opacity-50",
                  )}
                >
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => toggle(val)}
                    disabled={disabled}
                  />
                  <span>{getLabel(option)}</span>
                </label>
              );
            })}
          </div>
        );
      }}
    />
  );
}
