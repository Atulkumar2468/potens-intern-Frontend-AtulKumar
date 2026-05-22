import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { MetricCounter } from './components/MetricCounter';
import { ActionList } from './components/ActionList';
import { AnomalyPanel } from './components/AnomalyPanel';
import { StorageLedger } from './components/StorageLedger';
import type { AuditLogEntry } from './components/StorageLedger';
import type { Language, ActionItem, Anomaly } from './types';
import { mockActionItems, mockAnomalies, translations } from './i18n/translations';
import { Keyboard, CheckCircle2 } from 'lucide-react';

function App() {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('cockpit_lang');
    return (saved as Language) || 'en';
  });
  
  const [lowBandwidth, setLowBandwidth] = useState<boolean>(() => {
    return localStorage.getItem('cockpit_low_bw') === 'true';
  });

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('cockpit_dark_mode');
    return saved !== 'false'; // Default to true for premium dark mode
  });

  const [showShortcutsGuide, setShowShortcutsGuide] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success'>('idle');

  // Persistence: initialize state from localStorage or load localized templates
  const [actionItems, setActionItems] = useState<ActionItem[]>(() => {
    const saved = localStorage.getItem('cockpit_actions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved actions", e);
      }
    }
    return mockActionItems('en');
  });

  const [anomalies, setAnomalies] = useState<Anomaly[]>(() => {
    const saved = localStorage.getItem('cockpit_anomalies');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved anomalies", e);
      }
    }
    return mockAnomalies('en');
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    const saved = localStorage.getItem('cockpit_audit_logs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved audit logs", e);
      }
    }
    // Seed initial session entry
    return [
      {
        id: `LOG-init-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        }),
        message: 'Operational session initialized. Dispatcher terminal ready at 09:00 AM.',
        type: 'info'
      }
    ];
  });

  const [activeSelectedIndex, setActiveSelectedIndex] = useState<number>(-1);
  const t = translations[language];

  // 1. Sync configuration toggles to localStorage
  useEffect(() => {
    localStorage.setItem('cockpit_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('cockpit_low_bw', String(lowBandwidth));
  }, [lowBandwidth]);

  useEffect(() => {
    localStorage.setItem('cockpit_dark_mode', String(darkMode));
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  // 2. Persist dynamic item changes to localStorage
  useEffect(() => {
    localStorage.setItem('cockpit_actions', JSON.stringify(actionItems));
  }, [actionItems]);

  useEffect(() => {
    localStorage.setItem('cockpit_anomalies', JSON.stringify(anomalies));
  }, [anomalies]);

  useEffect(() => {
    localStorage.setItem('cockpit_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  // 3. Keep localized content aligned but preserve interaction statuses
  useEffect(() => {
    setActionItems(prev => {
      const template = mockActionItems(language);
      return template.map(tmpl => {
        const match = prev.find(p => p.id === tmpl.id);
        return match ? { ...tmpl, status: match.status } : tmpl;
      });
    });

    setAnomalies(prev => {
      const template = mockAnomalies(language);
      return template.map(tmpl => {
        const match = prev.find(p => p.id === tmpl.id);
        return match ? { ...tmpl, status: match.status } : tmpl;
      });
    });
  }, [language]);

  // Helper log generator
  const logEvent = (messageEn: string, messageHi: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    const newLog: AuditLogEntry = {
      id: `LOG-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toLocaleTimeString(language === 'hi' ? 'hi-IN' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }),
      message: language === 'hi' ? messageHi : messageEn,
      type
    };
    setAuditLogs(prev => [newLog, ...prev].slice(0, 50));
  };

  // 4. Register keyboard shortcut triggers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showShortcutsGuide) {
          setShowShortcutsGuide(false);
        } else {
          setActiveSelectedIndex(-1);
        }
        return;
      }

      if (e.key === '?') {
        setShowShortcutsGuide(prev => !prev);
        return;
      }

      if (showShortcutsGuide) return;

      if (e.key.toLowerCase() === 'j') {
        e.preventDefault();
        setActiveSelectedIndex(prev => {
          if (prev === -1) return 0;
          return Math.min(actionItems.length - 1, prev + 1);
        });
      }

      if (e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setActiveSelectedIndex(prev => {
          if (prev === -1) return actionItems.length - 1;
          return Math.max(0, prev - 1);
        });
      }

      if (e.key.toLowerCase() === 'a') {
        if (activeSelectedIndex >= 0 && activeSelectedIndex < actionItems.length) {
          const selectedItem = actionItems[activeSelectedIndex];
          if (selectedItem.status === 'pending') {
            e.preventDefault();
            handleApprove(selectedItem.id);
          }
        }
      }

      if (e.key.toLowerCase() === 'h') {
        if (activeSelectedIndex >= 0 && activeSelectedIndex < actionItems.length) {
          const selectedItem = actionItems[activeSelectedIndex];
          if (selectedItem.status === 'pending') {
            e.preventDefault();
            handleHold(selectedItem.id);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSelectedIndex, actionItems, showShortcutsGuide]);

  // Action handlers (persist locally)
  const handleApprove = (id: string) => {
    const item = actionItems.find(i => i.id === id);
    if (!item) return;
    setActionItems(prev =>
      prev.map(i => (i.id === id ? { ...i, status: 'approved' } : i))
    );
    logEvent(
      `Approved Action Item: ${id} - "${item.title}"`,
      `कार्रवाई वस्तु स्वीकृत: ${id} - "${item.title}"`,
      'success'
    );
  };

  const handleHold = (id: string) => {
    const item = actionItems.find(i => i.id === id);
    if (!item) return;
    setActionItems(prev =>
      prev.map(i => (i.id === id ? { ...i, status: 'held' } : i))
    );
    logEvent(
      `Placed Action Item on Hold: ${id} - "${item.title}"`,
      `कार्रवाई वस्तु को रोक पर रखा: ${id} - "${item.title}"`,
      'warning'
    );
  };

  const handleUndo = (id: string) => {
    const item = actionItems.find(i => i.id === id);
    if (!item) return;
    setActionItems(prev =>
      prev.map(i => (i.id === id ? { ...i, status: 'pending' } : i))
    );
    logEvent(
      `Reverted Action Item back to pending: ${id} - "${item.title}"`,
      `कार्रवाई वस्तु की स्थिति पूर्ववत की गई: ${id} - "${item.title}"`,
      'info'
    );
  };

  // Anomalies controls
  const handleMuteAnomaly = (id: string) => {
    const anm = anomalies.find(a => a.id === id);
    if (!anm) return;
    setAnomalies(prev =>
      prev.map(a => (a.id === id ? { ...a, status: 'muted' } : a))
    );
    logEvent(
      `Muted System Anomaly: ${id} - "${anm.title}"`,
      `प्रणाली विसंगति म्यूट की गई: ${id} - "${anm.title}"`,
      'warning'
    );
  };

  const handleResolveAnomaly = (id: string) => {
    const anm = anomalies.find(a => a.id === id);
    if (!anm) return;
    setAnomalies(prev =>
      prev.map(a => (a.id === id ? { ...a, status: 'resolved' } : a))
    );
    logEvent(
      `Resolved System Anomaly: ${id} - "${anm.title}"`,
      `प्रणाली विसंगति हल की गई: ${id} - "${anm.title}"`,
      'success'
    );
  };

  // Simulated DB sync trigger
  const handleSyncDatabase = () => {
    setSyncStatus('syncing');
    logEvent(
      `Initiated operations sync to central database...`,
      `केंद्रीय डेटाबेस में परिचालन सिंक शुरू किया गया...`,
      'info'
    );
    setTimeout(() => {
      setSyncStatus('success');
      logEvent(
        `Central dispatch database successfully synchronized. All changes pushed.`,
        `केंद्रीय प्रेषण डेटाबेस सफलतापूर्वक सिंक्रनाइज़ हुआ। सभी परिवर्तन सहेजे गए।`,
        'success'
      );
      setTimeout(() => setSyncStatus('idle'), 2500);
    }, 1200);
  };

  // Factory reset logic
  const handleFactoryReset = () => {
    const confirmed = window.confirm(t.resetStorageConfirm);
    if (!confirmed) return;

    // Purge storage keys
    const keys = ['cockpit_actions', 'cockpit_anomalies', 'cockpit_lang', 'cockpit_dark_mode', 'cockpit_low_bw', 'cockpit_audit_logs'];
    keys.forEach(k => localStorage.removeItem(k));

    // Reset components to pristine states
    setActionItems(mockActionItems(language));
    setAnomalies(mockAnomalies(language));
    setActiveSelectedIndex(-1);
    
    // Seed new session log
    const resetLog: AuditLogEntry = {
      id: `LOG-reset-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(language === 'hi' ? 'hi-IN' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }),
      message: language === 'hi' 
        ? 'फ़ैक्टरी रीसेट पूर्ण। स्थानीय स्टोरेज खाली और डिफ़ॉल्ट टेम्पलेट पुनर्जीवित की गई।'
        : 'Factory reset complete. local storage cleared & re-hydrated.',
      type: 'error'
    };
    setAuditLogs([resetLog]);
  };

  const handleClearLogs = () => {
    setAuditLogs([]);
  };

  const activeCriticalCount = actionItems.filter(item => item.status === 'pending' && item.urgency === 'high').length;
  const hasActiveAnomalies = anomalies.some(anm => anm.status === 'active');

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans ${
      darkMode 
        ? 'dark bg-[#0a0f1d] text-slate-100' 
        : 'bg-slate-50 text-slate-900'
    } ${lowBandwidth ? 'low-bandwidth-active' : ''}`}>
      
      {/* Visual background gradient mesh for custom dark mode */}
      {!lowBandwidth && darkMode && (
        <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-indigo-950/20 via-violet-950/5 to-transparent pointer-events-none z-0" />
      )}

      {/* Top Header */}
      <Header
        language={language}
        setLanguage={setLanguage}
        lowBandwidth={lowBandwidth}
        setLowBandwidth={setLowBandwidth}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenShortcuts={() => setShowShortcutsGuide(true)}
        hasActiveAnomalies={hasActiveAnomalies}
        syncStatus={syncStatus}
        onSync={handleSyncDatabase}
      />

      {/* Low-Bandwidth Warning Banner */}
      {lowBandwidth && (
        <div className="bg-amber-500 text-white text-center py-1 px-4 text-xxs font-semibold tracking-wide border-b border-amber-600 font-mono z-10 relative">
          ⚠️ {t.bandwidthWarning}
        </div>
      )}

      {/* Main Content Layout */}
      <main className={`mx-auto w-full transition-all relative z-10 ${
        lowBandwidth ? 'p-2 max-w-7xl' : 'p-4 md:p-6 lg:p-8 max-w-7xl'
      }`}>
        
        {/* Real-time Ticking Counters Section */}
        <MetricCounter
          language={language}
          lowBandwidth={lowBandwidth}
          activeCriticalCount={activeCriticalCount}
        />

        {/* Dashboard Operations Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start mt-2">
          
          {/* Top 5 Action Items */}
          <div className="lg:col-span-2">
            <ActionList
              items={actionItems}
              activeSelectedIndex={activeSelectedIndex}
              onApprove={handleApprove}
              onHold={handleHold}
              onUndo={handleUndo}
              language={language}
              lowBandwidth={lowBandwidth}
            />
          </div>

          {/* System Automated Anomalies Panel */}
          <div className="lg:col-span-1">
            <AnomalyPanel
              anomalies={anomalies}
              onMute={handleMuteAnomaly}
              onResolve={handleResolveAnomaly}
              language={language}
              lowBandwidth={lowBandwidth}
            />
          </div>

        </div>

        {/* Database & Storage Audit Ledger console */}
        <StorageLedger
          language={language}
          lowBandwidth={lowBandwidth}
          actionItems={actionItems}
          anomalies={anomalies}
          auditLogs={auditLogs}
          onClearLogs={handleClearLogs}
          onFactoryReset={handleFactoryReset}
        />

      </main>

      {/* Database sync floating status popup */}
      {syncStatus === 'success' && (
        <div className="fixed top-20 right-6 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 z-50 animate-bounce font-medium text-xs">
          <CheckCircle2 className="w-5 h-5" />
          <span>
            {language === 'en' 
              ? 'Local operations successfully synchronized to central dispatch database!' 
              : 'स्थानीय संचालन केंद्रीय प्रेषण डेटाबेस में सफलतापूर्वक सिंक हो गया है!'
            }
          </span>
        </div>
      )}

      {/* Keyboard navigation helper guide */}
      {!lowBandwidth && activeSelectedIndex !== -1 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/95 dark:bg-zinc-900/90 border border-slate-700/80 text-white px-5 py-2.5 rounded-2xl shadow-2xl flex items-center gap-3 backdrop-blur-md z-40 transition-all text-xs font-semibold">
          <div className="flex gap-1.5 items-center">
            <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-600 rounded text-slate-200 text-[10px]">J</kbd>
            <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-600 rounded text-slate-200 text-[10px]">K</kbd>
            <span className="text-slate-400 font-normal">navigate</span>
          </div>
          <span className="h-4 w-px bg-slate-700" />
          <div className="flex gap-1.5 items-center">
            <kbd className="px-1.5 py-0.5 bg-emerald-600 rounded text-white text-[10px] font-bold">A</kbd>
            <span className="text-slate-300">{translations[language].approve}</span>
          </div>
          <span className="h-4 w-px bg-slate-700" />
          <div className="flex gap-1.5 items-center">
            <kbd className="px-1.5 py-0.5 bg-amber-500 rounded text-white text-[10px] font-bold">H</kbd>
            <span className="text-slate-300">{translations[language].hold}</span>
          </div>
          <span className="h-4 w-px bg-slate-700" />
          <kbd className="px-1.5 py-0.5 bg-slate-700 rounded text-slate-300 text-[10px]">Esc</kbd>
        </div>
      )}

      {/* Keyboard shortcuts modal */}
      {showShortcutsGuide && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity">
          <div className={`bg-white dark:bg-zinc-900 border rounded-3xl w-full max-w-md ${
            lowBandwidth ? 'border-slate-400 p-4' : 'border-slate-200 dark:border-zinc-800/80 p-6 shadow-2xl'
          }`}>
            
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-zinc-800 pb-3 mb-4">
              <Keyboard className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
              <h3 className="text-base font-bold text-slate-950 dark:text-zinc-50">
                {t.shortcutsTitle}
              </h3>
            </div>

            <div className="flex flex-col gap-3 font-mono text-xs text-slate-600 dark:text-zinc-300">
              <div className="flex justify-between items-center py-1.5 border-b border-slate-100 dark:border-zinc-800/50">
                <span className="font-sans font-medium">{t.shortcutK}</span>
                <kbd className="px-2 py-1 bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 rounded border border-slate-300 dark:border-zinc-700 shadow-sm font-bold text-[10px]">k</kbd>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-slate-100 dark:border-zinc-800/50">
                <span className="font-sans font-medium">{t.shortcutJ}</span>
                <kbd className="px-2 py-1 bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 rounded border border-slate-300 dark:border-zinc-700 shadow-sm font-bold text-[10px]">j</kbd>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-slate-100 dark:border-zinc-800/50">
                <span className="font-sans font-medium">{t.shortcutA}</span>
                <kbd className="px-2 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 rounded border border-emerald-300 dark:border-emerald-800 shadow-sm font-bold text-[10px]">a</kbd>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-slate-100 dark:border-zinc-800/50">
                <span className="font-sans font-medium">{t.shortcutH}</span>
                <kbd className="px-2 py-1 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 rounded border border-amber-300 dark:border-amber-850 shadow-sm font-bold text-[10px]">h</kbd>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-slate-100 dark:border-zinc-800/50">
                <span className="font-sans font-medium">{t.shortcutQuestion}</span>
                <kbd className="px-2 py-1 bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 rounded border border-slate-300 dark:border-zinc-700 shadow-sm font-bold text-[10px]">?</kbd>
              </div>

              <div className="flex justify-between items-center py-1.5">
                <span className="font-sans font-medium">{t.shortcutEsc}</span>
                <kbd className="px-2 py-1 bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 rounded border border-slate-300 dark:border-zinc-700 shadow-sm font-bold text-[10px]">Esc</kbd>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-zinc-800 flex justify-end">
              <button
                onClick={() => setShowShortcutsGuide(false)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-4 py-2 rounded-xl transition active:scale-95 shadow-sm"
              >
                {t.close}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default App;
