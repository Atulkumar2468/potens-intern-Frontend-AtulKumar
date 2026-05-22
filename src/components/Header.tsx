import React, { useState, useEffect } from 'react';
import { translations } from '../i18n/translations';
import type { Language } from '../types';
import { Sun, Moon, Keyboard, Cpu, Wifi, WifiOff, CloudLightning, Loader2, CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  lowBandwidth: boolean;
  setLowBandwidth: (val: boolean) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onOpenShortcuts: () => void;
  hasActiveAnomalies: boolean;
  syncStatus: 'idle' | 'syncing' | 'success';
  onSync: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  setLanguage,
  lowBandwidth,
  setLowBandwidth,
  darkMode,
  setDarkMode,
  onOpenShortcuts,
  hasActiveAnomalies,
  syncStatus,
  onSync
}) => {
  const [time, setTime] = useState<Date>(new Date());
  const t = translations[language];

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString(language === 'hi' ? 'hi-IN' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <header className={`border-b border-[#e9ecef] dark:border-[#202533] bg-white dark:bg-[#12141c]/90 backdrop-blur-md transition-all sticky top-0 z-30 ${
      lowBandwidth ? 'py-2.5 px-4 shadow-none' : 'py-3.5 px-6 shadow-none'
    }`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 max-w-7xl mx-auto">
        
        {/* Brand details and status tags */}
        <div className="flex items-center gap-3">
          {!lowBandwidth && (
            <div className="p-2.5 bg-cyan-50 dark:bg-[#152733] border border-cyan-200/50 dark:border-cyan-800/40 rounded-xl text-cyan-600 dark:text-cyan-400">
              <Cpu className="w-5 h-5 animate-pulse-subtle" />
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h1 className={`font-extrabold tracking-tight text-slate-900 dark:text-zinc-50 ${
                lowBandwidth ? 'text-base' : 'text-xl'
              }`}>
                {t.title}
              </h1>
              <span className="text-[10px] font-bold bg-cyan-50 dark:bg-[#152733]/80 text-cyan-600 dark:text-cyan-400 px-2 py-0.5 rounded border border-cyan-100/50 dark:border-cyan-900/40 font-mono">
                OPS-CKPT v2.5
              </span>
            </div>
            {!lowBandwidth && (
              <p className="text-[11px] font-medium text-slate-400 dark:text-[#7f889c] mt-0.5">
                {t.subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Live system state, DB Sync button, and Config control panels */}
        <div className="flex flex-wrap items-center gap-3 md:gap-5 ml-auto md:ml-0">
          
          {/* Real-time sync button */}
          {!lowBandwidth && (
            <button
              onClick={onSync}
              disabled={syncStatus !== 'idle'}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xxs font-bold transition-all duration-150 cursor-pointer ${
                syncStatus === 'syncing'
                  ? 'bg-slate-50 dark:bg-[#1c2130] border-slate-200 dark:border-cyan-800/40 text-cyan-500 dark:text-cyan-400'
                  : syncStatus === 'success'
                    ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40 text-emerald-600 dark:text-emerald-400 font-extrabold'
                    : 'bg-white dark:bg-[#181d2c] border-slate-200 dark:border-[#2b3142] text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#20273a] hover:border-slate-300 dark:hover:border-[#383f56] active:scale-95 shadow-sm'
              }`}
            >
              {syncStatus === 'syncing' ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Syncing...</span>
                </>
              ) : syncStatus === 'success' ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Synced</span>
                </>
              ) : (
                <>
                  <CloudLightning className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" />
                  <span>{language === 'en' ? 'Sync Database' : 'डेटाबेस सिंक'}</span>
                </>
              )}
            </button>
          )}

          {/* Dynamic clock ticks */}
          <div className={`flex flex-col items-end border-r border-slate-200 dark:border-zinc-800 pr-3.5 md:pr-4 ${
            lowBandwidth ? 'py-0' : 'py-0.5'
          }`}>
            <span className="font-mono text-xs font-bold text-slate-800 dark:text-zinc-200 tabular-nums tracking-wide">
              {formatTime(time)}
            </span>
            <span className="text-[9px] text-slate-400 dark:text-zinc-500 font-semibold uppercase tracking-wider mt-0.5">
              {formatDate(time)}
            </span>
          </div>

          {/* Telemetry connection status dot */}
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              {hasActiveAnomalies ? (
                <>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </>
              ) : (
                <>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </>
              )}
            </span>
            <span className="text-[11px] font-bold text-slate-500 dark:text-zinc-300">
              {hasActiveAnomalies ? t.statusWarning : t.statusNominal}
            </span>
          </div>

          {/* Core settings control group */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-zinc-800/80 p-0.5 rounded-xl border border-slate-200/50 dark:border-zinc-700/50">
            
            {/* Bilingual toggle pill */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="px-2.5 py-1 text-[10px] font-bold rounded-lg text-slate-700 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-700 transition cursor-pointer select-none"
              title="Change Language / भाषा बदलें"
            >
              {language === 'en' ? 'हिन्दी' : 'English'}
            </button>

            {/* Low-Bandwidth Mode */}
            <button
              onClick={() => setLowBandwidth(!lowBandwidth)}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                lowBandwidth 
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-500/15' 
                  : 'text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-slate-200/40 dark:hover:bg-zinc-700/40'
              }`}
              title={`${t.bandwidthToggle}: ${lowBandwidth ? 'ON' : 'OFF'}`}
            >
              {lowBandwidth ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
            </button>

            {/* Dark Mode */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-slate-200/40 dark:hover:bg-zinc-700/40 transition cursor-pointer"
              title={darkMode ? t.lightModeToggle : t.darkModeToggle}
            >
              {darkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
            </button>

            {/* Keyboard shortcuts */}
            <button
              onClick={onOpenShortcuts}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-slate-200/40 dark:hover:bg-zinc-700/40 transition cursor-pointer"
              title={t.shortcutsBtn}
            >
              <Keyboard className="w-3.5 h-3.5" />
            </button>

          </div>
        </div>

      </div>
    </header>
  );
};
