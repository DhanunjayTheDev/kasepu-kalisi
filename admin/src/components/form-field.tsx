import {
  forwardRef,
  type InputHTMLAttributes,
  type ReactNode,
  type TextareaHTMLAttributes,
} from "react";
import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Select, type SelectOption } from "@/components/select";

const fieldClasses =
  "min-h-10 rounded-lg border border-teal/20 bg-white px-3.5 py-2 font-sans text-sm text-teal placeholder:text-slate/50 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/15";

interface WrapperProps {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}

function FieldWrapper({ label, htmlFor, error, hint, children }: WrapperProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="font-sans text-sm font-medium text-teal">
        {label}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-slate">{hint}</p>}
      {error && <p className="text-xs font-medium text-terracotta">{error}</p>}
    </div>
  );
}

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  hint?: string;
};

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { label, error, hint, id, className, name, ...props },
  ref
) {
  const fieldId = id ?? name;
  return (
    <FieldWrapper label={label} htmlFor={fieldId ?? label} error={error} hint={hint}>
      <input
        ref={ref}
        id={fieldId}
        name={name}
        className={cn(fieldClasses, error && "border-terracotta focus:border-terracotta focus:ring-terracotta/15", className)}
        {...props}
      />
    </FieldWrapper>
  );
});

type TextareaFieldProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  error?: string;
  hint?: string;
};

export const TextareaField = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(function TextareaField(
  { label, error, hint, id, className, name, ...props },
  ref
) {
  const fieldId = id ?? name;
  return (
    <FieldWrapper label={label} htmlFor={fieldId ?? label} error={error} hint={hint}>
      <textarea
        ref={ref}
        id={fieldId}
        name={name}
        rows={4}
        className={cn(fieldClasses, "min-h-24 resize-y", error && "border-terracotta focus:border-terracotta focus:ring-terracotta/15", className)}
        {...props}
      />
    </FieldWrapper>
  );
});

interface SelectFieldProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  control: Control<T>;
  options: SelectOption[];
  placeholder?: string;
  hint?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

/**
 * Form-bound wrapper around the brand <Select>. Uses Controller rather than
 * register() because the listbox is a custom control, not a native input.
 */
export function SelectField<T extends FieldValues>({
  label,
  name,
  control,
  options,
  placeholder,
  hint,
  required,
  disabled,
  className,
}: SelectFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      rules={required ? { required: "This field is required" } : undefined}
      render={({ field, fieldState }) => (
        <FieldWrapper label={label} htmlFor={name} error={fieldState.error?.message} hint={hint}>
          <Select
            id={name}
            value={(field.value as string | undefined) ?? ""}
            onChange={field.onChange}
            onBlur={field.onBlur}
            options={options}
            placeholder={placeholder}
            disabled={disabled}
            invalid={Boolean(fieldState.error)}
            className={className}
          />
        </FieldWrapper>
      )}
    />
  );
}
