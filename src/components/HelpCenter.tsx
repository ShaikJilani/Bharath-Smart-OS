import React, { useState } from "react";
import { HelpArticle, t } from "../data";
import { BookOpen, Search, PhoneCall, CheckSquare, Clock, HelpCircle } from "lucide-react";
import { LOCAL_HELP_UI_TRANSLATIONS, getLocalizedHelpArticles } from "./HelpCenterTranslations";

interface HelpCenterProps {
  selectedLanguage?: string;
}

export default function HelpCenter({ selectedLanguage = "English" }: HelpCenterProps) {
  const ui = LOCAL_HELP_UI_TRANSLATIONS[selectedLanguage] || LOCAL_HELP_UI_TRANSLATIONS.English;
  const localizedArticles = getLocalizedHelpArticles(selectedLanguage);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArticleIndex, setSelectedArticleIndex] = useState(0);

  const selectedArticle = localizedArticles[selectedArticleIndex] || localizedArticles[0];

  const filteredArticles = localizedArticles.filter((art) =>
    art.sector.toLowerCase().includes(searchQuery.toLowerCase()) ||
    art.guidance.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleArticleClick = (art: HelpArticle) => {
    const idx = localizedArticles.findIndex((item) => item.sector === art.sector);
    if (idx !== -1) {
      setSelectedArticleIndex(idx);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-indigo-700">
          <BookOpen className="h-5 w-5" />
          <span className="font-mono text-xs font-bold uppercase tracking-wider">{ui.advisoryPanel}</span>
        </div>
        <h2 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">{t(selectedLanguage, "helpCenter")}</h2>
        <p className="text-sm text-slate-500">{ui.subtitle}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Sidebar categories search */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute top-3 left-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder={ui.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-2 shadow-sm space-y-1">
            <span className="block px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
              {ui.sectorsHeader}
            </span>
            {filteredArticles.length > 0 ? (
              filteredArticles.map((art) => {
                const originalIndex = localizedArticles.findIndex((item) => item.sector === art.sector);
                const isActive = selectedArticleIndex === originalIndex;
                return (
                  <button
                    key={art.sector}
                    onClick={() => handleArticleClick(art)}
                    className={`w-full rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition-all ${
                      isActive
                        ? "bg-indigo-50 text-indigo-900"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    {art.sector}
                  </button>
                );
              })
            ) : (
              <p className="px-3 py-4 text-xs text-slate-400">{ui.noSectors}</p>
            )}
          </div>

          {/* Helpline box */}
          <div className="rounded-2xl bg-gradient-to-br from-indigo-900 to-slate-950 p-5 text-white shadow-md">
            <h4 className="text-sm font-bold tracking-tight">{ui.helplineTitle}</h4>
            <p className="mt-1 text-xs text-indigo-200 leading-relaxed">{ui.helplineDesc}</p>
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-indigo-800/50 px-3.5 py-2 font-mono text-sm font-bold border border-indigo-700/50">
              <PhoneCall className="h-4 w-4 text-indigo-300" />
              <span>+91 1800-456-2047</span>
            </div>
          </div>
        </div>

        {/* Content details panel */}
        <div className="lg:col-span-2">
          {selectedArticle ? (
            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm space-y-6">
              {/* Sector Title */}
              <div>
                <span className="rounded-full bg-indigo-100 px-2.5 py-1 text-[10px] font-bold tracking-wider text-indigo-700 uppercase font-mono">
                  {ui.standardDirective}
                </span>
                <h3 className="mt-2 text-xl font-black text-slate-900 sm:text-2xl">{selectedArticle.sector}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{selectedArticle.guidance}</p>
              </div>

              {/* SLA & Phone */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-50 bg-slate-50/50 p-4 flex items-center gap-3">
                  <div className="rounded-lg bg-indigo-100 p-2 text-indigo-700">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                      {ui.slaLabel}
                    </span>
                    <p className="text-sm font-bold text-slate-800">{selectedArticle.sla}</p>
                  </div>
                </div>

                {selectedArticle.emergencyPhone && (
                  <div className="rounded-xl border border-slate-50 bg-slate-50/50 p-4 flex items-center gap-3">
                    <div className="rounded-lg bg-rose-100 p-2 text-rose-700">
                      <PhoneCall className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                        {ui.dispatchLabel}
                      </span>
                      <p className="text-sm font-bold text-slate-800">{selectedArticle.emergencyPhone}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Photo recommendation */}
              <div className="rounded-2xl border border-dashed border-amber-300 bg-amber-50/40 p-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 font-mono">
                  {ui.evidentiaryTitle}
                </h4>
                <p className="mt-1 text-xs text-amber-900/85 leading-relaxed">
                  {selectedArticle.recommendedPhoto} {ui.evidentiaryDescText}
                </p>
              </div>

              {/* Steps */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <CheckSquare className="h-4 w-4 text-emerald-600" />
                  {ui.lodgingSteps}
                </h4>
                <ol className="space-y-2">
                  {selectedArticle.steps.map((step, index) => (
                    <li key={index} className="flex gap-3 text-xs text-slate-600 leading-relaxed">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 font-mono font-bold text-[10px] text-slate-600">
                        {index + 1}
                      </span>
                      <span className="pt-0.5">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          ) : (
            <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 p-6 text-center">
              <HelpCircle className="h-10 w-10 text-slate-300" />
              <p className="mt-2 text-sm font-semibold text-slate-400">Select a sector to review guidance</p>
            </div>
          )}

          {/* Quick FAQ accordion */}
          <div className="mt-8 space-y-4">
            <h3 className="text-base font-bold text-slate-900">{ui.faqTitle}</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                <h4 className="text-xs font-bold text-slate-900">{ui.faq1Q}</h4>
                <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">{ui.faq1A}</p>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                <h4 className="text-xs font-bold text-slate-900">{ui.faq2Q}</h4>
                <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">{ui.faq2A}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
