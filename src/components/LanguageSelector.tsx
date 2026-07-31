import React, { useState, useRef, useEffect } from "react";
import { Languages, ChevronDown, Check, Globe } from "lucide-react";
import { LANGUAGE_OPTIONS, LanguageOption } from "../types";

interface LanguageSelectorProps {
  selectedLanguage: string;
  onLanguageChange: (lang: string) => void;
  variant?: "header" | "compact" | "full" | "light";
  className?: string;
}

export default function LanguageSelector({
  selectedLanguage,
  onLanguageChange,
  variant = "header",
  className = "",
}: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentOption =
    LANGUAGE_OPTIONS.find((opt) => opt.code === selectedLanguage) ||
    LANGUAGE_OPTIONS[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (langCode: string) => {
    onLanguageChange(langCode);
    setIsOpen(false);
  };

  if (variant === "compact") {
    return (
      <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
        <div className="relative flex items-center">
          <Languages className="absolute left-2.5 h-3.5 w-3.5 text-slate-500 pointer-events-none" />
          <select
            value={selectedLanguage}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="pl-8 pr-7 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer appearance-none transition-all"
          >
            {LANGUAGE_OPTIONS.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name} ({lang.nativeName})
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
        </div>
      </div>
    );
  }

  if (variant === "light") {
    return (
      <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/20 bg-white/10 text-white hover:bg-white/20 backdrop-blur-md text-xs font-bold transition-all cursor-pointer shadow-sm"
        >
          <Languages className="h-4 w-4 text-amber-300" />
          <span>{currentOption.nativeName}</span>
          <span className="text-[10px] opacity-75">({currentOption.code})</span>
          <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 max-h-80 overflow-y-auto">
            <div className="px-3 py-1.5 border-b border-slate-100 flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Select Language / भाषा चुनें</span>
              <Globe className="h-3.5 w-3.5 text-slate-400" />
            </div>
            {LANGUAGE_OPTIONS.map((lang) => {
              const isSelected = lang.code === selectedLanguage;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleSelect(lang.code)}
                  className={`w-full flex items-center justify-between px-3.5 py-2 text-xs text-left transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-teal-50 text-teal-800 font-bold"
                      : "text-slate-700 hover:bg-slate-50 font-medium"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm">{lang.flag}</span>
                    <div>
                      <span className="block font-bold leading-none">{lang.nativeName}</span>
                      <span className="text-[10px] text-slate-400 font-medium">{lang.name}</span>
                    </div>
                  </div>
                  {isSelected && <Check className="h-4 w-4 text-teal-600 shrink-0" />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold transition-all cursor-pointer shadow-sm"
        aria-label="Change language"
      >
        <div className="flex items-center justify-center h-5 w-5 rounded-md bg-teal-50 text-teal-700">
          <Languages className="h-3.5 w-3.5" />
        </div>
        <div className="flex items-baseline gap-1 text-left">
          <span className="font-bold text-slate-900">{currentOption.nativeName}</span>
          <span className="text-[10px] text-slate-400 font-semibold hidden sm:inline">({currentOption.code})</span>
        </div>
        <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-white shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 max-h-80 overflow-y-auto">
          <div className="px-3.5 py-2 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider font-mono">Select Language / भाषा चुनें</span>
            <Globe className="h-3.5 w-3.5 text-teal-600" />
          </div>
          <div className="p-1 space-y-0.5">
            {LANGUAGE_OPTIONS.map((lang) => {
              const isSelected = lang.code === selectedLanguage;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleSelect(lang.code)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-left transition-all cursor-pointer ${
                    isSelected
                      ? "bg-gradient-to-r from-teal-50 to-emerald-50 text-teal-900 font-bold border border-teal-200/60 shadow-xs"
                      : "text-slate-700 hover:bg-slate-50 font-medium"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm">{lang.flag}</span>
                    <div>
                      <span className="block font-bold text-slate-900 leading-tight">{lang.nativeName}</span>
                      <span className="text-[10px] text-slate-400 font-semibold">{lang.name}</span>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="h-5 w-5 rounded-full bg-teal-600 text-white flex items-center justify-center shrink-0">
                      <Check className="h-3 w-3 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
