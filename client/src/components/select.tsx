import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
  id?: string;
  className?: string;
  "aria-label"?: string;
}

/**
 * Brand listbox replacing the native <select>, whose dropdown can't be styled.
 * Keyboard: Enter/Space/Arrows open, Arrows move, Enter picks, Escape closes.
 */
export function Select({
  value,
  onChange,
  onBlur,
  options,
  placeholder = "Select…",
  disabled,
  invalid,
  id,
  className,
  "aria-label": ariaLabel,
}: SelectProps) {
  const generatedId = useId();
  const listboxId = `${id ?? generatedId}-listbox`;
  const containerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const selectedIndex = options.findIndex((o) => o.value === value);
  const selected = selectedIndex >= 0 ? options[selectedIndex] : undefined;

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
        onBlur?.();
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open, onBlur]);

  function openList() {
    if (disabled) return;
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
    setOpen(true);
  }

  function pick(index: number) {
    const option = options[index];
    if (!option) return;
    onChange(option.value);
    setOpen(false);
    onBlur?.();
  }

  function onKeyDown(event: React.KeyboardEvent) {
    if (disabled) return;

    if (!open) {
      if (["Enter", " ", "ArrowDown", "ArrowUp"].includes(event.key)) {
        event.preventDefault();
        openList();
      }
      return;
    }

    switch (event.key) {
      case "Escape":
        event.preventDefault();
        setOpen(false);
        break;
      case "Tab":
        setOpen(false);
        break;
      case "ArrowDown":
        event.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, options.length - 1));
        break;
      case "ArrowUp":
        event.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
        break;
      case "Home":
        event.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        event.preventDefault();
        setActiveIndex(options.length - 1);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        pick(activeIndex);
        break;
    }
  }

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        type="button"
        id={id}
        disabled={disabled}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        aria-label={ariaLabel}
        className={cn(
          "flex min-h-11 w-full cursor-pointer items-center justify-between gap-2 rounded-lg border bg-white px-3.5 py-2.5 text-left font-sans text-sm transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-teal/20",
          invalid ? "border-terracotta focus:border-terracotta focus:ring-terracotta/20" : "border-slate/25 focus:border-teal",
          disabled ? "cursor-not-allowed bg-ivory text-slate/60" : "text-teal hover:border-teal/40"
        )}
      >
        <span className={cn("truncate", !selected && "text-slate/60")}>{selected?.label ?? placeholder}</span>
        <ChevronDown
          size={15}
          className={cn("shrink-0 text-slate transition-transform duration-200", open && "rotate-180")}
        />
      </button>

      {open && (
        <ul
          id={listboxId}
          role="listbox"
          aria-activedescendant={activeIndex >= 0 ? `${listboxId}-${activeIndex}` : undefined}
          tabIndex={-1}
          className="absolute z-50 mt-1.5 max-h-64 w-full overflow-y-auto rounded-lg border border-slate/20 bg-white py-1 shadow-lg"
        >
          {options.length === 0 && <li className="px-3.5 py-2 text-sm text-slate">No options</li>}

          {options.map((option, index) => {
            const isSelected = option.value === value;
            return (
              <li
                key={option.value}
                id={`${listboxId}-${index}`}
                role="option"
                aria-selected={isSelected}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => pick(index)}
                className={cn(
                  "flex cursor-pointer items-center justify-between gap-2 px-3.5 py-2 font-sans text-sm",
                  index === activeIndex ? "bg-teal/8 text-teal" : "text-teal/80",
                  isSelected && "font-semibold text-teal"
                )}
              >
                <span className="truncate">{option.label}</span>
                {isSelected && <Check size={14} className="shrink-0 text-terracotta" />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
