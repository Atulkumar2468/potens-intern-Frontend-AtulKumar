import React, { useState, useEffect } from 'react';
import { translations } from '../i18n/translations';
import type { Language } from '../types';
import { Clock, ShieldAlert, TrendingUp, AlertTriangle } from 'lucide-react';

interface MetricCounterProps {
  language: Language;
  lowBandwidth: boolean;
  activeCriticalCount: number;
}

export const MetricCounter: React.FC<MetricCounterProps> = ({
  language,
  lowBandwidth,
  activeCriticalCount
}) => {
  const t = translations[language];

  // SLA Cutoff Countdown State (ticking)
  const [timeLeft, setTimeLeft] = useState<number>(0);

  // Live average queue age state (ticking with micro-oscillations)
  const [avgAge, setAvgAge] = useState<number>(274); // Starts at 4m 34s

  useEffect(() => {
    // Calculate seconds remaining until the next top-of-the-hour cutoff
    const getSecondsToNextHour = () => {
      const now = new Date();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();
      return (60 - minutes - 1) * 60 + (60 - seconds);
    };

    setTimeLeft(getSecondsToNextHour());

    const countdownTimer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          return 3600; 
        }
        return prev - 1;
      });
    }, 1000);

    const queueAgeTimer = setInterval(() => {
      setAvgAge(prev => {
        const drift = Math.random() > 0.45 ? 1 : -1;
        return Math.max(120, prev + drift);
      });
    }, 1000);

    return () => {
      clearInterval(countdownTimer);
      clearInterval(queueAgeTimer);
    };
  }, []);

  const formatCountdown = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    const pad = (num: number) => String(num).padStart(2, '0');

    if (hrs > 0) {
      return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
    }
    return `${pad(mins)}:${pad(secs)}`;
  };

  const formatAge = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}${t.minutes} ${secs}${t.seconds}`;
  };

  const isCriticalTime = timeLeft < 900; // Less than 15 minutes left
  
  // Calculate remaining percentage of current hourly batch window (for the visual progress indicator)
  const hourPercentage = (timeLeft / 3600) * 100;

  if (lowBandwidth) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2 font-mono text-xxs bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-800 rounded p-2">
        <div className="flex justify-between py-1 border-r border-slate-200 dark:border-zinc-800/80 pr-2">
          <span>{t.cutoffHeader.toUpperCase()}:</span>
          <span className="font-bold text-slate-800 dark:text-zinc-200">{formatCountdown(timeLeft)}</span>
        </div>
        <div className="flex justify-between py-1 px-2 border-r border-slate-200 dark:border-zinc-800/80">
          <span>{t.liveQueueAge.toUpperCase()}:</span>
          <span className="font-bold text-slate-800 dark:text-zinc-200">{formatAge(avgAge)}</span>
        </div>
        <div className="flex justify-between py-1 pl-2">
          <span>{t.activeShipments.toUpperCase()}:</span>
          <span className="font-bold text-slate-800 dark:text-zinc-200">{activeCriticalCount}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
      
      {/* 1. Time-Sensitive SLA Cutoff Countdown Widget */}
      <div className={`relative overflow-hidden border rounded-2xl p-5 transition-all duration-200 bg-white dark:bg-[#12141c] border-[#e9ecef] dark:border-[#202533] hover:border-slate-300 dark:hover:border-[#2b3142] shadow-sm hover:shadow ${
        isCriticalTime ? 'ring-1 ring-rose-500/20' : ''
      }`}>
        {/* Glow behind counter for professional telemetry cockpit styling */}
        {!lowBandwidth && (
          <div className={`absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl opacity-10 pointer-events-none -mr-4 -mt-4 bg-cyan-500`} />
        )}

        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 dark:text-[#7f889c] uppercase tracking-wider">
              {t.cutoffHeader}
            </span>
            <span className={`text-[10px] font-extrabold mt-1 tracking-wide uppercase px-2 py-0.5 rounded border w-fit font-mono ${
              isCriticalTime 
                ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' 
                : 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20'
            }`}>
              {t.cutoffTime}
            </span>
          </div>

          <div className={`p-2 rounded-xl ${
            isCriticalTime 
              ? 'bg-rose-500/10 text-rose-500' 
              : 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20'
          }`}>
            {isCriticalTime ? <AlertTriangle className="w-4 h-4 animate-bounce" /> : <Clock className="w-4 h-4" />}
          </div>
        </div>

        <div className="mt-4 flex items-baseline gap-2">
          <span className={`font-mono text-3xl font-extrabold tracking-tight tabular-nums ${
            isCriticalTime ? 'text-rose-600 dark:text-rose-400' : 'text-slate-800 dark:text-zinc-100'
          }`}>
            {formatCountdown(timeLeft)}
          </span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
            mins
          </span>
        </div>

        {/* Live hour fraction progress bar */}
        <div className="w-full bg-[#f1f3f5] dark:bg-[#181d2c] h-1.5 rounded-full mt-4 overflow-hidden border border-slate-100 dark:border-zinc-800/40">
          <div 
            className={`h-full transition-all duration-1000 ${
              isCriticalTime ? 'bg-gradient-to-r from-rose-500 to-rose-600' : 'bg-gradient-to-r from-cyan-500 to-teal-500'
            }`} 
            style={{ width: `${hourPercentage}%` }}
          />
        </div>
      </div>

      {/* 2. Live Ticking Average Queue Age Widget */}
      <div className="relative overflow-hidden border rounded-2xl p-5 transition-all duration-200 bg-white dark:bg-[#12141c] border-[#e9ecef] dark:border-[#202533] hover:border-slate-300 dark:hover:border-[#2b3142] shadow-sm hover:shadow">
        {!lowBandwidth && (
          <div className="absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl opacity-10 pointer-events-none -mr-4 -mt-4 bg-emerald-500" />
        )}

        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 dark:text-[#7f889c] uppercase tracking-wider">
              {t.liveQueueAge}
            </span>
            <span className="text-[9px] font-extrabold mt-1 tracking-wide uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 w-fit font-mono animate-pulse">
              ▲ Live Stream
            </span>
          </div>

          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-4 flex items-baseline gap-2">
          <span className="font-mono text-3xl font-extrabold tracking-tight tabular-nums text-slate-800 dark:text-zinc-100">
            {formatAge(avgAge)}
          </span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
            latency
          </span>
        </div>

        {/* Oscillating live status indicator */}
        <div className="w-full flex items-center justify-between mt-4">
          <div className="flex gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 absolute"></span>
          </div>
          <span className="text-[9px] font-bold font-mono text-slate-400 uppercase">
            SLA target: &lt; 10m
          </span>
        </div>
      </div>

      {/* 3. Urgent shipments telemetry counter */}
      <div className="relative overflow-hidden border rounded-2xl p-5 transition-all duration-200 bg-white dark:bg-[#12141c] border-[#e9ecef] dark:border-[#202533] hover:border-slate-300 dark:hover:border-[#2b3142] shadow-sm hover:shadow">
        {!lowBandwidth && (
          <div className="absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl opacity-10 pointer-events-none -mr-4 -mt-4 bg-rose-500" />
        )}

        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 dark:text-[#7f889c] uppercase tracking-wider">
              {t.activeShipments}
            </span>
            <span className="text-[9px] font-bold mt-1 tracking-wide uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-[#181d2c] text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-[#2b3142] w-fit font-mono">
              Realtime telemetry
            </span>
          </div>

          <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20">
            <ShieldAlert className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-4 flex items-baseline gap-2">
          <span className="font-mono text-3xl font-extrabold tracking-tight tabular-nums text-slate-800 dark:text-zinc-100">
            {activeCriticalCount}
          </span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
            critical items
          </span>
        </div>

        {/* Linear density layout bar */}
        <div className="w-full bg-[#f1f3f5] dark:bg-[#181d2c] h-1.5 rounded-full mt-4 overflow-hidden border border-slate-100 dark:border-zinc-800/40">
          <div 
            className="h-full bg-rose-500 transition-all duration-500" 
            style={{ width: `${(activeCriticalCount / 5) * 100}%` }}
          />
        </div>
      </div>

    </div>
  );
};
