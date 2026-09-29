"use client";

import { ChevronDown } from "lucide-react";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

export type SearchableSelectProps = {
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
  icon?: ReactNode;
  emptyMessage?: string;
  className?: string;
  "aria-label"?: string;
};

type PanelRect = {
  top: number;
  left: number;
  width: number;
  placement: "up" | "down";
};

export function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = "Select",
  disabled = false,
  invalid = false,
  icon,
  emptyMessage = "No matches",
  className,
  "aria-label": ariaLabel,
}: SearchableSelectProps) {
  const listboxId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const [highlight, setHighlight] = useState(0);
  const [panel, setPanel] = useState<PanelRect | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q || q === value.toLowerCase()) return [...options];
    return options.filter((opt) => opt.toLowerCase().includes(q));
  }, [options, query, value]);

  const updatePanel = useCallback(() => {
    const el = rootRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const placement =
      spaceBelow < 200 && rect.top > spaceBelow ? "up" : "down";
    setPanel({
      top: placement === "up" ? rect.top - 6 : rect.bottom + 6,
      left: rect.left,
      width: rect.width,
      placement,
    });
  }, []);

  const openList = useCallback(() => {
    if (disabled) return;
    setOpen(true);
    setHighlight(0);
    updatePanel();
  }, [disabled, updatePanel]);

  const closeList = useCallback(() => {
    setOpen(false);
    setQuery(value);
    setHighlight(0);
  }, [value]);

  const selectOption = useCallback(
    (next: string) => {
      onChange(next);
      setQuery(next);
      setOpen(false);
      setHighlight(0);
      inputRef.current?.blur();
    },
    [onChange],
  );

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (rootRef.current?.contains(target)) return;
      if (listRef.current?.contains(target)) return;
      closeList();
    };

    const onScrollOrResize = () => updatePanel();

    window.addEventListener("mousedown", onPointerDown);
    window.addEventListener("resize", onScrollOrResize);
    window.addEventListener("scroll", onScrollOrResize, true);

    return () => {
      window.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("resize", onScrollOrResize);
      window.removeEventListener("scroll", onScrollOrResize, true);
    };
  }, [open, closeList, updatePanel]);

  useEffect(() => {
    if (!open || !listRef.current) return;
    const item = listRef.current.children[highlight] as HTMLElement | undefined;
    item?.scrollIntoView({ block: "nearest" });
  }, [highlight, open]);

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!open) {
        openList();
        return;
      }
      setHighlight((i) => Math.min(i + 1, Math.max(filtered.length - 1, 0)));
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!open) {
        openList();
        return;
      }
      setHighlight((i) => Math.max(i - 1, 0));
      return;
    }

    if (event.key === "Enter") {
      if (!open) return;
      event.preventDefault();
      const pick = filtered[highlight];
      if (pick) selectOption(pick);
      return;
    }

    if (event.key === "Escape") {
      if (!open) return;
      event.preventDefault();
      closeList();
    }
  };

  const listbox =
    open && panel && typeof document !== "undefined"
      ? createPortal(
          <ul
            ref={listRef}
            id={listboxId}
            role="listbox"
            aria-label={ariaLabel ?? placeholder}
            style={
              panel.placement === "down"
                ? {
                    position: "fixed",
                    top: panel.top,
                    left: panel.left,
                    width: panel.width,
                  }
                : {
                    position: "fixed",
                    bottom: window.innerHeight - panel.top,
                    left: panel.left,
                    width: panel.width,
                  }
            }
            className={cn(
              "glass-dropdown-scroll z-[60] max-h-52 overflow-y-auto overscroll-contain rounded-xl py-1.5",
              "border border-on-media/25 bg-glass-dropdown shadow-xl",
              "backdrop-blur-2xl backdrop-saturate-150",
            )}
          >
            {filtered.length === 0 ? (
              <li className="px-3.5 py-2.5 text-sm text-on-media/70">
                {emptyMessage}
              </li>
            ) : (
              filtered.map((opt, index) => {
                const selected = opt === value;
                const active = index === highlight;
                return (
                  <li
                    key={opt}
                    role="option"
                    aria-selected={selected}
                    className={cn(
                      "cursor-pointer px-3.5 py-2.5 text-sm text-on-media transition-colors",
                      active || selected
                        ? "bg-glass-dropdown-hover"
                        : "hover:bg-glass-dropdown-hover",
                    )}
                    onMouseEnter={() => setHighlight(index)}
                    onMouseDown={(event) => {
                      event.preventDefault();
                      selectOption(opt);
                    }}
                  >
                    {opt}
                  </li>
                );
              })
            )}
          </ul>,
          document.body,
        )
      : null;

  return (
    <div ref={rootRef} className={cn("relative min-w-0", className)}>
      <label
        className={cn(
          "relative flex h-12 w-full items-center gap-2.5 rounded-2xl border border-glass-field-border bg-glass-field px-3.5 pr-9 text-sm text-on-media",
          "focus-within:border-on-media/60",
          disabled && "opacity-50",
          invalid && "border-danger/70",
        )}
      >
        {icon}
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-invalid={invalid}
          aria-label={ariaLabel ?? placeholder}
          disabled={disabled}
          autoComplete="off"
          placeholder={placeholder}
          value={query}
          className="min-w-0 flex-1 border-0 bg-transparent py-2 text-on-media outline-none placeholder:text-on-media/55 disabled:cursor-not-allowed"
          onFocus={() => {
            openList();
            setQuery(value);
          }}
          onChange={(event) => {
            const next = event.target.value;
            setQuery(next);
            setHighlight(0);
            if (!open) openList();
            if (value && next !== value) onChange("");
          }}
          onKeyDown={onKeyDown}
        />
        <ChevronDown
          className={cn(
            "pointer-events-none absolute right-3 size-4 text-on-media/70 transition-transform",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </label>
      {listbox}
    </div>
  );
}
