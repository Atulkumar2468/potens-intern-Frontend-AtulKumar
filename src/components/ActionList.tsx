import React from 'react';
import type { ActionItem, Language } from '../types';
import { translations } from '../i18n/translations';
import { Check, Pause, RotateCcw, Award, Shield, Compass, Eye, Thermometer, UserCheck } from 'lucide-react';

interface ActionListProps {
  items: ActionItem[];
  activeSelectedIndex: number;
  onApprove: (id: string) => void;
  onHold: (id: string) => void;
  onUndo: (id: string) => void;
  language: Language;
  lowBandwidth: boolean;
}

export const ActionList: React.FC<ActionListProps> = ({
  items,
  activeSelectedIndex,
  onApprove,
  onHold,
  onUndo,
  language,
  lowBandwidth
}) => {
  const t = translations[language];

  // Helper to choose high-fidelity category icons
  const categoryIcon = (category: string) => {
    const norm = category.toLowerCase();
    if (norm.includes('compliance') || norm.includes('अनुपालन')) return <Shield className="w-3.5 h-3.5 text-[#5cacf7]" />;
    if (norm.includes('logistics') || norm.includes('रसद')) return <Compass className="w-3.5 h-3.5 text-[#38bdf8]" />;
    if (norm.includes('risk') || norm.includes('जोखिम')) return <Eye className="w-3.5 h-3.5 text-[#ff922b]" />;
    if (norm.includes('cold') || norm.includes('कोल्ड')) return <Thermometer className="w-3.5 h-3.5 text-[#20c997]" />;
    return <UserCheck className="w-3.5 h-3.5 text-[#51cf66]" />;
  };

  const urgencyColors = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return 'text-rose-600 bg-rose-50 border-rose-100/40 dark:text-rose-400 dark:bg-rose-950/15 dark:border-rose-900/30';
      case 'medium':
        return 'text-amber-600 bg-amber-50 border-amber-100/40 dark:text-amber-400 dark:bg-amber-950/15 dark:border-amber-900/30';
      default:
        return 'text-slate-500 bg-slate-50 border-slate-100/40 dark:text-zinc-400 dark:bg-zinc-800/20 dark:border-zinc-800/40';
    }
  };

  const isAllResolved = items.every(item => item.status !== 'pending');

  if (lowBandwidth) {
    return (
      <div className="bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-800 rounded p-3">
        <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-300 dark:border-zinc-800">
          <h2 className="text-xs font-bold text-slate-800 dark:text-zinc-200 uppercase tracking-wider">
            📋 {t.actionHeader} (5)
          </h2>
          <span className="text-[10px] text-slate-500 font-mono">
            {t.keyboardNavTip}
          </span>
        </div>

        {isAllResolved ? (
          <div className="py-4 text-center text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            {t.allDone}
          </div>
        ) : (
          <table className="w-full text-left text-xxs font-mono border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-zinc-800 text-slate-400">
                <th className="py-1 pr-2">ID</th>
                <th className="py-1 px-2">TITLE</th>
                <th className="py-1 px-2">CONTEXT</th>
                <th className="py-1 px-2">URGENCY</th>
                <th className="py-1 px-2">STATUS</th>
                <th className="py-1 pl-2 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => {
                const isSelected = idx === activeSelectedIndex;
                return (
                  <tr 
                    key={item.id} 
                    className={`border-b border-slate-200 dark:border-zinc-800/50 ${
                      isSelected ? 'bg-slate-100 dark:bg-zinc-800 border-l-2 border-l-indigo-500 font-semibold' : ''
                    }`}
                  >
                    <td className="py-1.5 pr-2 font-bold">{item.id}</td>
                    <td className="py-1.5 px-2 font-bold text-slate-800 dark:text-zinc-200">{item.title}</td>
                    <td className="py-1.5 px-2 text-slate-500 dark:text-zinc-400 truncate max-w-[200px]" title={item.context}>
                      {item.context}
                    </td>
                    <td className="py-1.5 px-2 uppercase font-bold">
                      <span className={item.urgency === 'high' ? 'text-rose-500' : item.urgency === 'medium' ? 'text-amber-500' : 'text-slate-500'}>
                        {item.urgency}
                      </span>
                    </td>
                    <td className="py-1.5 px-2">
                      <span className={`px-1.5 py-0.5 rounded font-bold uppercase ${
                        item.status === 'approved' 
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400'
                          : item.status === 'held'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-400'
                            : 'bg-slate-100 text-slate-800 dark:bg-zinc-800 dark:text-zinc-400'
                      }`}>
                        {item.status === 'approved' ? t.approvedBadge : item.status === 'held' ? t.heldBadge : 'PENDING'}
                      </span>
                    </td>
                    <td className="py-1.5 pl-2 text-right whitespace-nowrap">
                      {item.status === 'pending' ? (
                        <div className="inline-flex gap-1">
                          <button
                            onClick={() => onApprove(item.id)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-1.5 py-0.5 rounded cursor-pointer"
                          >
                            [A] Approve
                          </button>
                          <button
                            onClick={() => onHold(item.id)}
                            className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-1.5 py-0.5 rounded cursor-pointer"
                          >
                            [H] Hold
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => onUndo(item.id)}
                          className="bg-slate-200 dark:bg-zinc-800 hover:bg-slate-300 text-slate-700 dark:text-zinc-300 px-1.5 py-0.5 rounded cursor-pointer"
                        >
                          Undo
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#12141c] border border-[#e9ecef] dark:border-[#202533] rounded-3xl p-5 md:p-6 shadow-sm shadow-[#e9ecef]/20 dark:shadow-none">
      
      {/* Panel Headers */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 dark:border-zinc-800 pb-4 mb-5 gap-2">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-zinc-50 flex items-center gap-2">
            {t.actionHeader}
            <span className="text-[10px] font-bold bg-cyan-50 dark:bg-[#172b35] text-cyan-600 dark:text-cyan-400 px-2 py-0.5 rounded border border-cyan-100/50 dark:border-cyan-900/40">
              5 {language === 'en' ? 'Actions Today' : 'कार्य आज'}
            </span>
          </h2>
          <p className="text-[11px] text-slate-400 dark:text-[#7f889c] mt-0.5">
            {t.actionSub}
          </p>
        </div>
        
        {/* Soft keyboard helper bubble */}
        <div className="flex items-center gap-2 text-[10px] font-bold bg-cyan-500/5 dark:bg-[#172b35]/60 border border-cyan-100/50 dark:border-cyan-900/30 px-3 py-1.5 rounded-xl text-cyan-600 dark:text-cyan-400 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></span>
          <span>{t.keyboardNavTip}</span>
        </div>
      </div>

      {isAllResolved ? (
        <div className="py-14 flex flex-col items-center justify-center text-center border border-dashed border-emerald-100 dark:border-emerald-950/20 rounded-2xl bg-emerald-50/10 dark:bg-emerald-950/5">
          <Award className="w-12 h-12 text-emerald-500 dark:text-emerald-400 mb-3" />
          <h3 className="text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">
            {t.allDone}
          </h3>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((item, index) => {
            const isSelected = index === activeSelectedIndex;
            const isPending = item.status === 'pending';

            return (
              <div
                key={item.id}
                className={`border rounded-2xl p-4 transition-all duration-200 relative ${
                  isSelected 
                    ? 'keyboard-active-item' 
                    : 'bg-white/40 dark:bg-[#151722]/50 border-[#e9ecef] dark:border-[#202533] hover:border-slate-200 dark:hover:border-[#2b3142] hover:bg-white dark:hover:bg-[#181d2c]'
                }`}
              >
                {/* Visual selection sidebar accent */}
                {isSelected && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500 dark:bg-cyan-500 rounded-l-2xl" />
                )}

                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  
                  {/* Left Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="font-mono text-xxs font-extrabold text-cyan-600 dark:text-cyan-400 tracking-wider">
                        {item.id}
                      </span>
                      
                      {/* Unified category tag */}
                      <span className={`inline-flex items-center gap-1 text-[9px] font-extrabold font-mono uppercase px-2 py-0.5 rounded border ${urgencyColors(item.urgency)}`}>
                        {categoryIcon(item.category)}
                        <span>{item.category}</span>
                      </span>

                      <span className="text-[10px] text-slate-400 dark:text-[#7f889c] font-mono ml-auto sm:ml-0">
                        {item.timestamp}
                      </span>
                    </div>

                    <h3 className="text-xs font-bold text-slate-800 dark:text-zinc-100 tracking-tight leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-[#9ea7b8] mt-1 leading-relaxed">
                      {item.context}
                    </p>
                  </div>

                  {/* Right Actions */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 border-t sm:border-t-0 border-[#f1f3f5] dark:border-[#202533] pt-3 sm:pt-0 shrink-0 select-none">
                    
                    {/* Status Pill Badge */}
                    {!isPending && (
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-xl text-[10px] font-bold uppercase border tracking-wider ${
                        item.status === 'approved'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                      }`}>
                        {item.status === 'approved' ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-500" />
                            <span>{t.approvedBadge}</span>
                          </>
                        ) : (
                          <>
                            <Pause className="w-3 h-3 text-amber-500" />
                            <span>{t.heldBadge}</span>
                          </>
                        )}
                      </span>
                    )}

                    {/* Action button states */}
                    {isPending ? (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => onApprove(item.id)}
                          className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 dark:bg-[#14532d] dark:hover:bg-[#166534] text-white font-bold text-xxs px-3 py-1.5 rounded-xl shadow-sm transition cursor-pointer active:scale-95"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>{t.approve}</span>
                        </button>
                        <button
                          onClick={() => onHold(item.id)}
                          className="flex items-center gap-1 bg-amber-500 hover:bg-amber-600 dark:bg-[#78350f] dark:hover:bg-[#92400e] text-white font-bold text-xxs px-3 py-1.5 rounded-xl shadow-sm transition cursor-pointer active:scale-95"
                        >
                          <Pause className="w-3.5 h-3.5" />
                          <span>{t.hold}</span>
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => onUndo(item.id)}
                        className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 dark:bg-[#202533] dark:hover:bg-[#2c3346] text-slate-500 dark:text-zinc-300 font-bold text-xxs px-2.5 py-1.5 rounded-xl border border-slate-200/50 dark:border-zinc-700/60 transition cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>{t.undo}</span>
                      </button>
                    )}

                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
