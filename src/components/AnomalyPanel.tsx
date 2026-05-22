import React from 'react';
import type { Anomaly, Language } from '../types';
import { translations } from '../i18n/translations';
import { AlertTriangle, VolumeX, CheckCircle2, ShieldAlert } from 'lucide-react';

interface AnomalyPanelProps {
  anomalies: Anomaly[];
  onMute: (id: string) => void;
  onResolve: (id: string) => void;
  language: Language;
  lowBandwidth: boolean;
}

export const AnomalyPanel: React.FC<AnomalyPanelProps> = ({
  anomalies,
  onMute,
  onResolve,
  language,
  lowBandwidth
}) => {
  const t = translations[language];

  const activeAnomalies = anomalies.filter(anm => anm.status === 'active');

  const severityColors = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-rose-600 bg-rose-50 border-rose-100/40 dark:text-rose-400 dark:bg-rose-950/15 dark:border-rose-900/30';
      case 'high':
        return 'text-orange-600 bg-orange-50 border-orange-100/40 dark:text-orange-400 dark:bg-orange-950/15 dark:border-orange-900/30';
      default:
        return 'text-amber-600 bg-amber-50 border-amber-100/40 dark:text-amber-400 dark:bg-amber-950/15 dark:border-amber-900/30';
    }
  };

  const severityText = (severity: string) => {
    switch (severity) {
      case 'critical':
        return t.criticalSeverity;
      case 'high':
        return t.highSeverity;
      default:
        return t.mediumSeverity;
    }
  };

  if (lowBandwidth) {
    return (
      <div className="bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-800 rounded p-3">
        <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-300 dark:border-zinc-800">
          <h2 className="text-xs font-bold text-slate-800 dark:text-zinc-200 uppercase tracking-wider flex items-center gap-1">
            ⚠️ {t.anomalyHeader} ({activeAnomalies.length})
          </h2>
        </div>

        {activeAnomalies.length === 0 ? (
          <div className="py-4 text-center text-xs font-semibold text-slate-500">
            {t.noAnomalies}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {activeAnomalies.map(anm => (
              <div 
                key={anm.id} 
                className="flex items-start justify-between gap-3 text-xxs font-mono border-b border-slate-200 dark:border-zinc-800/50 pb-1.5"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-rose-500">[{severityText(anm.severity)}]</span>
                    <span className="font-bold text-slate-800 dark:text-zinc-200">{anm.title}</span>
                    <span className="text-slate-400">({anm.timestamp})</span>
                  </div>
                  <p className="text-slate-500 mt-0.5">{anm.details}</p>
                </div>
                <div className="inline-flex gap-1 shrink-0">
                  <button
                    onClick={() => onMute(anm.id)}
                    className="bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 px-1 py-0.5 rounded font-bold hover:bg-slate-300 cursor-pointer"
                  >
                    Mute
                  </button>
                  <button
                    onClick={() => onResolve(anm.id)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-1 py-0.5 rounded font-bold cursor-pointer"
                  >
                    Resolve
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#12141c] border border-[#e9ecef] dark:border-[#202533] rounded-3xl p-5 md:p-6 shadow-sm shadow-[#e9ecef]/20 dark:shadow-none">
      
      {/* Header */}
      <div className="border-b border-slate-100 dark:border-zinc-800 pb-4 mb-5">
        <h2 className="text-base font-bold text-slate-900 dark:text-zinc-50 flex items-center gap-2">
          {t.anomalyHeader}
          <span className="text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 px-2 py-0.5 rounded border border-rose-500/20">
            {activeAnomalies.length} {language === 'en' ? 'Active Alerts' : 'सक्रिय अलर्ट'}
          </span>
        </h2>
        <p className="text-[11px] text-slate-400 dark:text-[#7f889c] mt-0.5">
          {t.anomalySub}
        </p>
      </div>

      {activeAnomalies.length === 0 ? (
        <div className="py-12 flex flex-col items-center justify-center text-center border border-dashed border-emerald-100 dark:border-emerald-950/20 rounded-2xl bg-emerald-50/10 dark:bg-emerald-950/5">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mb-2" />
          <h3 className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
            {t.noAnomalies}
          </h3>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {activeAnomalies.map(anm => (
            <div
              key={anm.id}
              className={`border rounded-2xl p-4 transition-all duration-150 relative ${
                anm.severity === 'critical'
                  ? 'bg-rose-500/5 border-rose-200/50 dark:border-rose-900/30'
                  : anm.severity === 'high'
                    ? 'bg-[#ff922b]/5 border-orange-200/50 dark:border-orange-900/30'
                    : 'bg-[#ffbe3b]/5 border-amber-200/50 dark:border-amber-900/30'
              }`}
            >
              {/* Severity Left color strip */}
              <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl ${
                anm.severity === 'critical'
                  ? 'bg-rose-500'
                  : anm.severity === 'high'
                    ? 'bg-[#ff922b]'
                    : 'bg-[#ffbe3b]'
              }`} />

              <div className="flex items-start gap-3">
                
                {/* Visual Icon */}
                <div className={`p-2 rounded-xl shrink-0 ${
                  anm.severity === 'critical'
                    ? 'text-rose-600 bg-rose-500/10 border border-rose-500/20'
                    : anm.severity === 'high'
                      ? 'text-orange-600 bg-[#ff922b]/10 border border-[#ff922b]/20'
                      : 'text-amber-600 bg-[#ffbe3b]/10 border border-[#ffbe3b]/20'
                }`}>
                  {anm.severity === 'critical' ? <ShieldAlert className="w-4 h-4 animate-pulse" /> : <AlertTriangle className="w-4 h-4" />}
                </div>

                {/* Content info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-bold text-slate-800 dark:text-zinc-100 tracking-tight leading-snug">
                        {anm.title}
                      </h3>
                      <span className={`text-[8px] font-extrabold font-mono px-1.5 py-0.5 rounded border uppercase tracking-wider ${severityColors(anm.severity)}`}>
                        {severityText(anm.severity)}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 dark:text-[#7f889c] font-mono">
                      {anm.timestamp}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-[#9ea7b8] mt-1 leading-relaxed">
                    {anm.details}
                  </p>

                  {/* Tactile control buttons */}
                  <div className="flex items-center gap-1.5 mt-3 border-t border-slate-100 dark:border-zinc-800/80 pt-2.5 select-none">
                    <button
                      onClick={() => onMute(anm.id)}
                      className="flex items-center gap-1 bg-[#ffffff] hover:bg-slate-100 dark:bg-[#202533] dark:hover:bg-[#2c3346] text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200 font-bold text-[10px] px-2.5 py-1.5 rounded-xl border border-slate-200/50 dark:border-zinc-750 transition cursor-pointer"
                    >
                      <VolumeX className="w-3 h-3" />
                      <span>{t.mute}</span>
                    </button>
                    <button
                      onClick={() => onResolve(anm.id)}
                      className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 dark:bg-[#14532d] dark:hover:bg-[#166534] text-white font-bold text-[10px] px-2.5 py-1.5 rounded-xl shadow-sm transition cursor-pointer active:scale-95 ml-auto"
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{t.resolve}</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
