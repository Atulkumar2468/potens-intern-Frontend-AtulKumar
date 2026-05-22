import React, { useState } from 'react';
import { translations } from '../i18n/translations';
import type { Language, ActionItem, Anomaly } from '../types';
import { Database, Terminal, FileCode, Copy, RefreshCw, Trash2, ArrowDown, ArrowUp, CheckCircle } from 'lucide-react';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

interface StorageLedgerProps {
  language: Language;
  lowBandwidth: boolean;
  actionItems: ActionItem[];
  anomalies: Anomaly[];
  auditLogs: AuditLogEntry[];
  onClearLogs: () => void;
  onFactoryReset: () => void;
}

export const StorageLedger: React.FC<StorageLedgerProps> = ({
  language,
  lowBandwidth,
  actionItems,
  anomalies,
  auditLogs,
  onClearLogs,
  onFactoryReset
}) => {
  const t = translations[language];
  const [showJsonState, setShowJsonState] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Get sizing details of localStorage
  const getStorageSize = () => {
    let totalBytes = 0;
    const keys = ['cockpit_actions', 'cockpit_anomalies', 'cockpit_lang', 'cockpit_dark_mode', 'cockpit_low_bw'];
    keys.forEach(k => {
      const val = localStorage.getItem(k);
      if (val) {
        totalBytes += k.length + val.length;
      }
    });
    return totalBytes;
  };

  const currentSize = getStorageSize();

  const getFullRawStateJson = () => {
    const rawState = {
      timestamp: new Date().toISOString(),
      localStorage: {
        cockpit_actions: actionItems,
        cockpit_anomalies: anomalies,
        cockpit_lang: localStorage.getItem('cockpit_lang') || language,
        cockpit_dark_mode: localStorage.getItem('cockpit_dark_mode') || 'true',
        cockpit_low_bw: localStorage.getItem('cockpit_low_bw') || 'false'
      }
    };
    return JSON.stringify(rawState, null, 2);
  };

  const handleCopyPayload = () => {
    navigator.clipboard.writeText(getFullRawStateJson());
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <section className={`w-full mt-6 border border-[#e9ecef] dark:border-[#202533] bg-white dark:bg-[#12141c]/90 rounded-2xl overflow-hidden transition-all ${
      lowBandwidth ? 'p-2' : 'shadow-sm'
    }`}>
      
      {/* Ledger Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#e9ecef] dark:border-[#202533] bg-slate-50/50 dark:bg-[#171b26]/50 ${
        lowBandwidth ? 'p-2' : 'p-4 sm:p-5'
      }`}>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 border border-indigo-100/50 dark:border-indigo-900/40 rounded-xl">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-zinc-50 flex items-center gap-2">
              {t.ledgerTitle}
              <span className="text-[10px] bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-mono px-2 py-0.5 rounded-full border border-indigo-200/50 dark:border-indigo-900/50">
                localStorage
              </span>
            </h2>
            <p className="text-[11px] font-medium text-slate-400 dark:text-[#7f889c] mt-0.5">
              {t.ledgerSub}
            </p>
          </div>
        </div>

        {/* Global actions */}
        <div className="flex items-center gap-2 mt-3 sm:mt-0">
          <button
            onClick={() => setShowJsonState(!showJsonState)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-[#2b3142] text-xxs font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-[#181d2c] hover:bg-slate-50 dark:hover:bg-[#20273a] transition active:scale-95 cursor-pointer shadow-sm"
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>{t.toggleView}</span>
            {showJsonState ? <ArrowUp className="w-3 h-3 ml-0.5" /> : <ArrowDown className="w-3 h-3 ml-0.5" />}
          </button>

          <button
            onClick={onFactoryReset}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-950/40 text-xxs font-bold text-rose-600 dark:text-rose-400 bg-rose-50/50 dark:bg-rose-950/15 hover:bg-rose-100/50 dark:hover:bg-rose-950/30 transition active:scale-95 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{t.resetStorage}</span>
          </button>
        </div>
      </div>

      {/* Grid of Storage Metrics & Active Keys */}
      <div className={`grid grid-cols-1 md:grid-cols-3 border-b border-[#e9ecef] dark:border-[#202533] ${
        lowBandwidth ? 'gap-1' : 'divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-[#202533]'
      }`}>
        
        {/* Metric 1: Storage Medium */}
        <div className="p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-wider block">
              {t.storageMedium}
            </span>
            <span className="text-xs font-extrabold text-slate-800 dark:text-zinc-200 mt-1 block font-mono">
              HTML5 localStorage API
            </span>
          </div>
          <div className="px-2 py-1 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] font-bold rounded-lg">
            ONLINE
          </div>
        </div>

        {/* Metric 2: Size in Bytes */}
        <div className="p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-wider block">
              {t.dbSize}
            </span>
            <span className="text-sm font-black text-slate-900 dark:text-zinc-100 mt-1 block font-mono tabular-nums">
              {currentSize.toLocaleString()} <span className="text-xxs font-normal text-slate-400 dark:text-[#7f889c]">{t.bytes}</span>
            </span>
          </div>
          <div className="text-[10px] font-semibold text-slate-400 dark:text-zinc-500 font-mono">
            Limit: 5MB (5,242,880 B)
          </div>
        </div>

        {/* Metric 3: Active Keys Monitored */}
        <div className="p-4 flex flex-col justify-center">
          <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-wider block">
            {t.activeKeys}
          </span>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {['cockpit_actions', 'cockpit_anomalies', 'cockpit_lang'].map(key => (
              <span key={key} className="px-2 py-0.5 bg-slate-100 dark:bg-[#1a2030] border border-slate-200 dark:border-zinc-800 text-[10px] font-semibold text-slate-600 dark:text-zinc-400 rounded-md font-mono">
                {key}
              </span>
            ))}
            <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 self-center pl-1 font-mono">
              +2
            </span>
          </div>
        </div>

      </div>

      {/* Main Bottom Section: Live Log & Collapsible JSON payload console */}
      <div className="grid grid-cols-1 lg:grid-cols-2">
        
        {/* Panel Left: Live Session Transaction logs */}
        <div className={`p-4 sm:p-5 flex flex-col min-h-[220px] ${
          lowBandwidth ? 'p-2' : 'border-r border-[#e9ecef] dark:border-[#202533]'
        }`}>
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <h3 className="text-xs font-bold text-slate-800 dark:text-zinc-200 tracking-tight">
                {t.auditLog}
              </h3>
            </div>
            {auditLogs.length > 0 && (
              <button
                onClick={onClearLogs}
                className="flex items-center gap-1.5 px-2 py-1 border border-slate-200 dark:border-zinc-800 rounded-lg text-[10px] font-bold text-slate-500 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-[#1a2030] cursor-pointer"
              >
                <Trash2 className="w-3 h-3 text-rose-500" />
                <span>{t.logsClear}</span>
              </button>
            )}
          </div>

          {/* Logs terminal */}
          <div className="flex-1 bg-slate-950 dark:bg-black/95 border border-slate-800 rounded-xl p-3.5 font-mono text-[11px] leading-relaxed text-slate-300 overflow-y-auto max-h-[190px] shadow-inner select-text">
            {auditLogs.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-600 text-center py-6">
                &gt; SYSTEM STATE NOMINAL. LISTENING FOR INCOMING TRANSACTIONS...
              </div>
            ) : (
              <div className="flex flex-col gap-1.5">
                {auditLogs.map((log) => (
                  <div key={log.id} className="flex gap-2.5 items-start">
                    <span className="text-cyan-500/80 font-semibold shrink-0">[{log.timestamp}]</span>
                    <span className={`shrink-0 font-bold ${
                      log.type === 'success' ? 'text-emerald-400' :
                      log.type === 'warning' ? 'text-amber-400' :
                      log.type === 'error' ? 'text-rose-400' : 'text-cyan-400'
                    }`}>
                      {log.type.toUpperCase()}:
                    </span>
                    <span className="text-slate-200">{log.message}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Panel Right: Collapsible JSON payload console */}
        <div className={`p-4 sm:p-5 flex flex-col min-h-[220px] ${
          !showJsonState ? 'bg-slate-50/30 dark:bg-[#12141c]/40 items-center justify-center text-center opacity-70' : ''
        }`}>
          {!showJsonState ? (
            <div className="py-8 px-4 flex flex-col items-center">
              <FileCode className="w-10 h-10 text-slate-300 dark:text-zinc-700/80 mb-3" />
              <h4 className="text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">
                {t.rawPayload}
              </h4>
              <p className="text-[11px] text-slate-400 dark:text-zinc-500 max-w-xs mb-4">
                {language === 'en'
                  ? 'Expose exact state payloads stored inside your local sandbox container.'
                  : 'अपने स्थानीय सैंडबॉक्स कंटेनर में सहेजे गए सटीक स्टेट पेलोड को उजागर करें।'}
              </p>
              <button
                onClick={() => setShowJsonState(true)}
                className="px-3.5 py-1.5 text-xxs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200/50 dark:border-indigo-900/40 rounded-xl hover:bg-indigo-100/40 cursor-pointer"
              >
                {t.toggleView}
              </button>
            </div>
          ) : (
            <div className="flex flex-col flex-1 h-full">
              <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-indigo-500" />
                  <h3 className="text-xs font-bold text-slate-800 dark:text-zinc-200 tracking-tight">
                    {t.rawPayload}
                  </h3>
                </div>
                <button
                  onClick={handleCopyPayload}
                  className="flex items-center gap-1.5 px-2.5 py-1 border border-slate-200 dark:border-zinc-800 rounded-lg text-[10px] font-bold text-slate-600 dark:text-zinc-300 bg-white dark:bg-[#181d2c] hover:bg-slate-50 dark:hover:bg-[#1a2030] cursor-pointer"
                >
                  {copySuccess ? (
                    <>
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-500 font-extrabold">{language === 'en' ? 'Copied!' : 'कॉपी हो गया!'}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>{t.copyPayload}</span>
                    </>
                  )}
                </button>
              </div>

              {/* JSON render */}
              <div className="flex-1 bg-slate-950 dark:bg-black/95 border border-slate-800 rounded-xl p-3.5 font-mono text-[10px] leading-relaxed text-indigo-400 overflow-y-auto max-h-[190px] shadow-inner select-text">
                <pre className="whitespace-pre">{getFullRawStateJson()}</pre>
              </div>
            </div>
          )}
        </div>

      </div>

    </section>
  );
};
