import React from "react";
import { LANGUAGE_VERSIONS } from "../lib/constants";
import { ChevronDown, Code2 } from "lucide-react";

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
        className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-sm font-medium transition-all"
      >
        <Code2 className="w-4 h-4 text-indigo-400" />
        <span className="capitalize">{language}</span>
        <span className="text-slate-500 text-xs ml-1">({LANGUAGE_VERSIONS[language as keyof typeof LANGUAGE_VERSIONS]})</span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ml-2 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden">
          {languages.map(([lang, version]) => (
            <button
              key={lang}
              onClick={() => {
                onSelect(lang);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-3 text-sm transition-colors flex justify-between items-center ${
                language === lang 
                  ? "bg-indigo-500/10 text-indigo-400 font-bold" 
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <span className="capitalize">{lang}</span>
              <span className="text-xs opacity-50">{version}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
