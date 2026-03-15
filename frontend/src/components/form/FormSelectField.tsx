"use client";

import * as React from "react";
import type { FieldPath, FieldValues } from "react-hook-form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { FormFieldLayoutProps } from "./FormFieldLayout";
import { FormFieldLayout } from "./FormFieldLayout";

/** Default option shape when getLabel/getValue are not provided */
export type DefaultSelectOption = { id: string | number; name: string };

export interface FormSelectFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TOption = DefaultSelectOption,
> {
  control: FormFieldLayoutProps<TFieldValues, TName>["control"];
  name: TName;
  label: React.ReactNode;
  description?: React.ReactNode;
  labelExtra?: React.ReactNode;
  options: TOption[];
  /** Optional. Defaults to (option) => option.name when options have { id, name } */
  getLabel?: (option: TOption) => string;
  /** Optional. Defaults to (option) => option.id when options have { id, name } */
  getValue?: (option: TOption) => string | number;
  placeholder?: string;
  disabled?: boolean;
  triggerClassName?: string;
}

const defaultGetLabel = (o: DefaultSelectOption) => o.name;
const defaultGetValue = (o: DefaultSelectOption) => o.id;

export function FormSelectField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TOption = DefaultSelectOption,
>({
  control,
  name,
  label,
  description,
  labelExtra,
  options,
  getLabel = defaultGetLabel as (option: TOption) => string,
  getValue = defaultGetValue as (option: TOption) => string | number,
  placeholder,
  disabled,
  triggerClassName,
}: FormSelectFieldProps<TFieldValues, TName, TOption>) {
  return (
    <FormFieldLayout
      control={control}
      name={name}
      label={label}
      description={description}
      labelExtra={labelExtra}
      renderControl={({ value, onChange, onBlur, ref }) => (
        <Select
          disabled={disabled}
          value={value ?? ""}
          onValueChange={(next) => {
            onChange(next === "" ? undefined : next);
            onBlur();
          }}
        >
          <SelectTrigger
            ref={ref as React.Ref<HTMLButtonElement>}
            className={triggerClassName}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option, index) => (
              <SelectItem key={index} value={String(getValue(option))}>
                {getLabel(option)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    />
  );
}
