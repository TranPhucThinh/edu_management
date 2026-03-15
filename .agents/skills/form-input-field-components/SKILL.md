---
name: form-input-field-components
description: How to create and reuse form field components (input, select, multi-select) with react-hook-form and a shared layout. Use this skill whenever the user asks to add form fields, create FormInputField/FormSelectField/FormMultiSelectField, refactor forms to reusable components, build form components with label/error/description, or wire form controls to react-hook-form. Prefer this skill for any task involving "form input component", "form field", "reusable form", or "form component with validation".
---

# Form Input Field Components

Guidelines for creating reusable, typed form field components that integrate with **react-hook-form** and a shared layout (label, control, description, error message). Use one shared layout component and separate components per control type (input, select, multi-select) so each has clear props and stays maintainable.

## When to use this skill

- Adding or refactoring form fields (text, email, password, select, multi-select).
- Creating reusable form components (e.g. `FormInputField`, `FormSelectField`, `FormMultiSelectField`).
- Wiring form controls to react-hook-form with consistent label, error, and description.
- Replacing repeated `FormField` + `FormItem` + `FormLabel` + `FormControl` + `Input`/Select blocks with a single component per field.

## Architecture overview

Use a **two-layer** setup:

1. **Shared layout** – One component (e.g. `FormFieldLayout`) that wraps react-hook-form’s `FormField` (Controller) and renders: `FormItem` → `FormLabel` (with optional `labelExtra`) → `FormControl`(children) → optional `FormDescription` → `FormMessage`. It receives `control`, `name`, `label`, optional `description`/`labelExtra`, and a **render prop** `renderControl(field)` so the actual control is injected.

2. **Per-type field components** – One component per control kind (e.g. `FormInputField`, `FormSelectField`, `FormMultiSelectField`). Each uses the shared layout and passes a `renderControl` that renders the right UI (Input, Select, checkbox list, etc.) and wires `field.value`, `field.onChange`, `field.onBlur`, `field.ref`. Do **not** put all input types in a single component with a `type` prop; that leads to messy props and weak typing.

Keep the existing **ui/form** primitives (`Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormMessage`, `FormDescription`) unchanged; the new form field components sit **on top** of them.

## Data and error flow

- **Form state**: The **page** (or parent) owns the form: it creates the form with `useForm` (or a custom hook like `useLoginForm`) and passes **`control`** and **`name`** into each field component. Field components do **not** create the form; they only bind to it.
- **Value**: react-hook-form’s **Controller** (inside `FormField`) manages the value for `name`. It passes **`field`** (`value`, `onChange`, `onBlur`, `ref`) into `renderControl`. The control (Input, Select, etc.) must be **controlled**: use `value={field.value ?? ""}` (or equivalent), `onChange={field.onChange}`, `onBlur={field.onBlur}`, and forward `ref` to the focusable element so validation focus works.
- **Errors**: Validation (e.g. zod resolver or `setError`) sets per-field errors. **FormMessage** uses **useFormField()** (which reads `getFieldState(name, formState).error`) and displays `error.message`. No extra “error map” is needed in the field component—errors appear automatically as long as the field is inside the same `FormField`/`FormItem` and the error has a `message`.

## Implementing the shared layout (FormFieldLayout)

- **Props**: `control`, `name`, `label`, optional `description`, optional `labelExtra` (e.g. “Forgot password?” link in the label row), `renderControl: (field) => ReactNode`, and optional `className` / `labelClassName` / `controlClassName`.
- **Implementation**: Render `FormField` with `control` and `name`, and a `render` prop that returns `FormItem` → label row (with `labelExtra` if provided) → `FormControl` wrapping `renderControl(field)` → optional `FormDescription` → `FormMessage`. Use the same primitives from your design system (e.g. shadcn-style `Form*` from `@/components/ui/form`).
- **Generics**: Type the layout with `TFieldValues` and `TName extends FieldPath<TFieldValues>` so `control` and `name` stay type-safe; `renderControl` receives `ControllerRenderProps<TFieldValues, TName>`.

## Implementing FormInputField

- Use **FormFieldLayout** and pass a **renderControl** that renders your design system’s **Input** (e.g. shadcn `Input`), not a raw `<input>`.
- **Props**: `control`, `name`, `label`, optional `description`, `labelExtra`, `placeholder`, `type` (default `"text"`), `disabled`, `inputClassName`, optional `leftIcon` and `rightSlot` (e.g. password visibility toggle) as ReactNode. In `renderControl`, wrap the Input in a `div` with `position: relative` and absolutely position `leftIcon`/`rightSlot`; add `pl-9` / `pr-9` when those slots exist so the input text doesn’t overlap.
- Wire **field**: `value={field.value ?? ""}`, `onChange={field.onChange}`, `onBlur={field.onBlur}`, `ref={field.ref}`, and pass `disabled` through. Use a single root element inside `FormControl` (e.g. one `div`) so Radix Slot can merge accessibility props onto it.

## Implementing FormSelectField

- Use **FormFieldLayout** and **renderControl** that renders your design system’s **Select** (e.g. shadcn/Radix Select: `Select`, `SelectTrigger`, `SelectValue`, `SelectContent`, `SelectItem`), not a native `<select>`.
- **Props**: `control`, `name`, `label`, optional `description`, `labelExtra`, `options`, optional `getLabel` and `getValue` (default to `(o) => o.name` and `(o) => o.id` so options can be `{ id, name }` by default), `placeholder`, `disabled`, `triggerClassName`.
- **Value**: Select expects a string; use `value={field.value ?? ""}` and `onValueChange={(next) => { field.onChange(next === "" ? undefined : next); field.onBlur(); }}`. Map `options` to `SelectItem` with `value={String(getValue(option))}` and children `{getLabel(option)}`.

## Implementing FormMultiSelectField

- Use **FormFieldLayout** and **renderControl** that renders a list of options with **checkboxes** (use your design system’s Checkbox, e.g. shadcn/Radix Checkbox), not native `<input type="checkbox">`. Value is an **array** of selected values (e.g. string[]).
- **Props**: Same as select for label/description/options/getLabel/getValue; default `getLabel`/`getValue` to `name`/`id`. Optional `optionsClassName` for the list container.
- **Value**: `field.value` is an array; maintain a `Set` of selected ids and on toggle add/remove from the set, then call `field.onChange(Array.from(set))` and `field.onBlur()`. Each option is a label wrapping a Checkbox with `checked={selectedSet.has(strValue)}`, `onCheckedChange={() => toggle(optionValue)}`, and `disabled`.

## Optional getLabel / getValue (select and multi-select)

- Make **getLabel** and **getValue** **optional**. When omitted, default to `(option) => option.name` and `(option) => option.id` so the default option shape is `{ id: string | number; name: string }`. Export a type like `DefaultSelectOption` for that shape. This keeps the API simple when options already have `id` and `name`; when they don’t, the caller passes custom getters.

## Where to put components and exports

- Put the shared layout and per-type field components in a **form** folder (e.g. `components/form/FormFieldLayout.tsx`, `FormInputField.tsx`, `FormSelectField.tsx`, `FormMultiSelectField.tsx`).
- Export them from `components/form/index.ts` so pages can `import { FormInputField, FormSelectField, FormMultiSelectField } from "@/components/form"`. The page still imports `Form` from `@/components/ui/form` and wraps the form with `<Form {...form}>`; field components only need `control` and `name` from the same form instance.

## Usage on a page

- The page creates the form (e.g. `const { form, ... } = useLoginForm(...)`), then renders `<Form {...form}>` and `<form onSubmit={form.handleSubmit(onSubmit)}>`. Inside the form it uses e.g. `<FormInputField control={form.control} name="email" label={t("email")} placeholder={...} leftIcon={<User className="h-4 w-4" />} disabled={isLoading} />`. For password with visibility toggle, pass `type={showPassword ? "text" : "password"}` and `rightSlot={<button type="button" onClick={() => setShowPassword(!showPassword)}>...</button>`. Root-level or server errors can be shown above the fields and set with `form.setError("root", { message })`; field-level errors appear automatically under each field via FormMessage.

## Summary checklist

- One **FormFieldLayout** (shared label, control slot, description, FormMessage).
- **FormInputField**: FormFieldLayout + Input, support leftIcon/rightSlot and disabled.
- **FormSelectField**: FormFieldLayout + Select (shadcn/Radix), options + optional getLabel/getValue (default id/name).
- **FormMultiSelectField**: FormFieldLayout + checkbox list, array value, optional getLabel/getValue.
- Use **react-hook-form** `control` and `name` from the page; wire **field** (value, onChange, onBlur, ref) into the control; use design system primitives (Input, Select, Checkbox), not native elements.
- Export from `components/form` and keep `components/ui/form` primitives unchanged.
