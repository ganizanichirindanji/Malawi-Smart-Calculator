import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  History as HistoryIcon, 
  X, 
  Trash2, 
  Copy, 
  Check, 
  CornerDownLeft, 
  Calculator, 
  Settings2, 
  BarChart3, 
  Variable, 
  Divide, 
  RefreshCw,
  Clock,
  Sparkles
} from 'lucide-react';
import { useHistory } from '../context/HistoryContext';
import { HistoryItem, CalcModule } from '../types/history';

function formatTimestamp(timestamp: number): string {
  const diffSec = Math.floor((Date.now() - timestamp) / 1000);
  if (diffSec < 60) return 'Just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function getModuleBadge(module: CalcModule) {
  switch (module) {
    case 'standard':
      return { label: 'Standard', icon: <Calculator size={13} />, color: 'bg-blue-50 text-blue-700 border-blue-200' };
    case 'scientific':
      return { label: 'Scientific', icon: <Settings2 size={13} />, color: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
    case 'statistics':
      return { label: 'Statistics', icon: <BarChart3 size={13} />, color: 'bg-purple-50 text-purple-700 border-purple-200' };
    case 'quadratic':
      return { label: 'Quadratic', icon: <Variable size={13} />, color: 'bg-amber-50 text-amber-700 border-amber-200' };
    case 'cubic':
      return { label: 'Cubic', icon: <Variable size={13} />, color: 'bg-orange-50 text-orange-700 border-orange-200' };
    case 'linear':
      return { label: 'Linear', icon: <Variable size={13} />, color: 'bg-teal-50 text-teal-700 border-teal-200' };
    case 'fractions':
      return { label: 'Fractions', icon: <Divide size={13} />, color: 'bg-rose-50 text-rose-700 border-rose-200' };
    case 'conversions':
      return { label: 'Conversions', icon: <RefreshCw size={13} />, color: 'bg-cyan-50 text-cyan-700 border-cyan-200' };
    default:
      return { label: module, icon: <Calculator size={13} />, color: 'bg-slate-50 text-slate-700 border-slate-200' };
  }
}

export default function HistoryDrawer() {
  const { history, isDrawerOpen, setIsDrawerOpen, clearHistory, deleteEntry, recallEntry } = useHistory();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'calc' | 'solver' | 'other'>('all');

  const filteredHistory = history.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'calc') return item.module === 'standard' || item.module === 'scientific';
    if (filter === 'solver') return item.module === 'quadratic' || item.module === 'cubic' || item.module === 'linear';
    if (filter === 'other') return item.module === 'statistics' || item.module === 'fractions' || item.module === 'conversions';
    return true;
  });

  const handleCopy = (e: React.MouseEvent, item: HistoryItem) => {
    e.stopPropagation();
    const text = `${item.expression} = ${item.result}`;
    navigator.clipboard?.writeText(text);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteEntry(id);
  };

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsDrawerOpen(false)}
            className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs"
          />

          {/* Slide-over Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed inset-y-0 right-0 z-50 w-full sm:max-w-md bg-white border-l border-slate-200 shadow-2xl flex flex-col justify-between overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/80 shrink-0">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20">
                    <HistoryIcon size={18} />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900 leading-tight">Calculation History</h2>
                    <p className="text-xs text-slate-500">Last {history.length} calculations across all modules</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {history.length > 0 && (
                    <button
                      type="button"
                      onClick={clearHistory}
                      title="Clear all calculation history"
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsDrawerOpen(false)}
                    className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Filter Pills */}
              {history.length > 0 && (
                <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200/80">
                  {[
                    { id: 'all', label: `All (${history.length})` },
                    { id: 'calc', label: 'Calculators' },
                    { id: 'solver', label: 'Solvers' },
                    { id: 'other', label: 'Stats & Math' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setFilter(tab.id as any)}
                      className={`flex-1 py-1 px-2 rounded-md text-xs font-semibold transition-all ${
                        filter === tab.id
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Content List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 overscroll-contain">
              {filteredHistory.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3 text-slate-400">
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-1">
                    <Clock size={28} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-700">No Calculation History</h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
                      Perform calculations in any module (Standard, Scientific, Solvers, Fractions, Statistics, etc.) to record them here.
                    </p>
                  </div>
                </div>
              ) : (
                filteredHistory.map((item) => {
                  const badge = getModuleBadge(item.module);
                  const isCopied = copiedId === item.id;

                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      onClick={() => recallEntry(item)}
                      className="group relative bg-white hover:bg-blue-50/40 rounded-2xl p-4 border border-slate-200 hover:border-blue-300 shadow-xs hover:shadow-md transition-all cursor-pointer space-y-2.5 active:scale-98"
                    >
                      {/* Card Header: Module Tag + Time */}
                      <div className="flex items-center justify-between">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold border ${badge.color}`}>
                          {badge.icon}
                          <span>{badge.label}</span>
                        </span>

                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                            <Clock size={11} />
                            {formatTimestamp(item.timestamp)}
                          </span>
                        </div>
                      </div>

                      {/* Expression & Result */}
                      <div className="space-y-1">
                        <div className="text-xs font-mono text-slate-500 break-all leading-snug">
                          {item.expression}
                        </div>
                        <div className="text-base sm:text-lg font-mono font-bold text-slate-900 group-hover:text-blue-700 transition-colors break-all">
                          {item.result}
                        </div>
                        {item.details && (
                          <div className="text-[11px] text-slate-500 font-medium bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                            {item.details}
                          </div>
                        )}
                      </div>

                      {/* Card Action Footer */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="inline-flex items-center gap-1 text-blue-600 font-semibold group-hover:translate-x-0.5 transition-transform">
                          <CornerDownLeft size={13} />
                          <span>Tap to Recall</span>
                        </span>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={(e) => handleCopy(e, item)}
                            title="Copy calculation"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                          >
                            {isCopied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleDelete(e, item.id)}
                            title="Delete entry"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="p-3 bg-slate-50 border-t border-slate-100 text-center shrink-0">
              <p className="text-[11px] text-slate-400 font-medium">
                Tap any entry to recall its inputs into the active module
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
