"use client";

import { Check, ChevronDown } from "lucide-react";
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { createPortal } from "react-dom";

export type MinimalSelectOption = {
  value: string;
  label: string;
};

type MinimalSelectProps = {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  options: MinimalSelectOption[];
  placeholder?: string;
  className?: string;
  emphasized?: boolean;
};

type MenuLayout = {
  top: number;
  left: number;
  width: number;
  maxHeight: number;
  openUp: boolean;
};

const MENU_GAP = 6;
const VIEWPORT_PADDING = 12;
const MIN_MENU_HEIGHT = 120;

function getMenuLayout(trigger: HTMLButtonElement): MenuLayout {
  const rect = trigger.getBoundingClientRect();
  const spaceBelow = window.innerHeight - rect.bottom - VIEWPORT_PADDING;
  const spaceAbove = rect.top - VIEWPORT_PADDING;
  const openUp = spaceBelow < MIN_MENU_HEIGHT && spaceAbove > spaceBelow;
  const maxHeight = Math.max(
    MIN_MENU_HEIGHT,
    Math.min(320, openUp ? spaceAbove - MENU_GAP : spaceBelow - MENU_GAP),
  );

  return {
    top: openUp ? rect.top - MENU_GAP : rect.bottom + MENU_GAP,
    left: rect.left,
    width: rect.width,
    maxHeight,
    openUp,
  };
}

export default function MinimalSelect({
  id,
  value,
  onChange,
  options,
  placeholder = "Select an option",
  className = "",
  emphasized = false,
}: MinimalSelectProps) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const listboxId = `${selectId}-listbox`;

  const [isOpen, setIsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [menuLayout, setMenuLayout] = useState<MenuLayout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);

  const selectedOption = options.find((option) => option.value === value);
  const displayLabel = selectedOption?.label ?? placeholder;
  const hasValue = Boolean(value);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
    setHighlightIndex(-1);
    setMenuLayout(null);
  }, []);

  const updateMenuLayout = useCallback(() => {
    if (!triggerRef.current) return;
    setMenuLayout(getMenuLayout(triggerRef.current));
  }, []);

  useLayoutEffect(() => {
    if (!isOpen) return;
    updateMenuLayout();
  }, [isOpen, options.length, updateMenuLayout]);

  useEffect(() => {
    if (!isOpen) return;

    const handleViewportChange = () => updateMenuLayout();

    window.addEventListener("resize", handleViewportChange);
    window.addEventListener("scroll", handleViewportChange, true);
    return () => {
      window.removeEventListener("resize", handleViewportChange);
      window.removeEventListener("scroll", handleViewportChange, true);
    };
  }, [isOpen, updateMenuLayout]);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (containerRef.current?.contains(target)) return;
      if (menuRef.current?.contains(target)) return;
      closeMenu();
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [closeMenu]);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [closeMenu, isOpen]);

  const selectOption = (optionValue: string) => {
    onChange(optionValue);
    closeMenu();
  };

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setIsOpen((prev) => !prev);
      return;
    }

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        setHighlightIndex(0);
        return;
      }

      setHighlightIndex((prev) => {
        const next = event.key === "ArrowDown" ? prev + 1 : prev - 1;
        if (next < 0) return options.length - 1;
        if (next >= options.length) return 0;
        return next;
      });
    }

    if (event.key === "Enter" && isOpen && highlightIndex >= 0) {
      event.preventDefault();
      selectOption(options[highlightIndex].value);
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        ref={triggerRef}
        id={selectId}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={handleTriggerKeyDown}
        className={`flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left text-sm outline-none transition ${
          isOpen
            ? "border-primary bg-white ring-2 ring-primary/25"
            : emphasized
              ? "border-primary/30 bg-primary/5 hover:border-primary/40 hover:bg-primary/8 focus:border-primary focus:ring-2 focus:ring-primary/20"
              : "border-primary/15 bg-white hover:border-primary/25 focus:border-primary focus:ring-2 focus:ring-primary/20"
        }`}
      >
        <span className={hasValue ? "font-medium text-secondary" : "text-secondary/45"}>
          {displayLabel}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-secondary/35 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-primary" : ""
          }`}
        />
      </button>

      {isOpen && menuLayout && typeof document !== "undefined"
        ? createPortal(
            <ul
              ref={menuRef}
              id={listboxId}
              role="listbox"
              aria-labelledby={selectId}
              style={{
                top: menuLayout.openUp ? undefined : menuLayout.top,
                bottom: menuLayout.openUp ? window.innerHeight - menuLayout.top : undefined,
                left: menuLayout.left,
                width: menuLayout.width,
                maxHeight: menuLayout.maxHeight,
              }}
              className="minimal-select-menu fixed z-[100] overflow-y-auto rounded-xl border border-primary/10 bg-white py-1 shadow-[0_8px_30px_rgba(15,23,42,0.08)]"
            >
              {options.map((option, index) => {
                const isSelected = option.value === value;
                const isHighlighted = index === highlightIndex;

                return (
                  <li key={option.value || "__placeholder__"} role="presentation">
                    <button
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onMouseEnter={() => setHighlightIndex(index)}
                      onClick={() => selectOption(option.value)}
                      className={`flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                        isSelected
                          ? "bg-primary/8 font-medium text-primary"
                          : isHighlighted
                            ? "bg-primary/5 text-secondary"
                            : "text-secondary/80 hover:bg-primary/5"
                      }`}
                    >
                      <span>{option.label}</span>
                      {isSelected ? (
                        <Check className="h-3.5 w-3.5 shrink-0 text-primary" />
                      ) : null}
                    </button>
                  </li>
                );
              })}
            </ul>,
            document.body,
          )
        : null}
    </div>
  );
}
