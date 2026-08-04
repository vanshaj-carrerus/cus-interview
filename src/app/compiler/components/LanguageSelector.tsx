import React from "react";
import { LANGUAGE_VERSIONS } from "../lib/constants";
import { ChevronDown } from "lucide-react";
import LanguageIcon from "@/components/language/LanguageIcon";

type LanguageSelectorProps = {
  language: string;
  onSelect: (lang: string) => void;
};

const languages = Object.entries(LANGUAGE_VERSIONS);

export default function LanguageSelector({ language, onSelect }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-all hover:bg-slate-50"
      >
        <LanguageIcon language={language} className="h-5 w-5" />
        <span className="capitalize">{language}</span>
        <span className="ml-1 text-xs text-slate-500">
          ({LANGUAGE_VERSIONS[language as keyof typeof LANGUAGE_VERSIONS]})
        </span>
        <ChevronDown
          className={`ml-2 h-4 w-4 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen ? (
        <div className="absolute left-0 top-full z-50 mt-2 w-60 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
          {languages.map(([lang, version]) => {
            const selected = language === lang;
            return (
              <button
                key={lang}
                onClick={() => {
                  onSelect(lang);
                  setIsOpen(false);
                }}
                className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition-colors ${
                  selected
                    ? "bg-sky-500/10 font-bold text-sky-500"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <LanguageIcon language={lang} className="h-5 w-5" />
                <span className="flex-1 capitalize">{lang}</span>
                <span className="text-xs opacity-50">{version}</span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
