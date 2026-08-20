import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Divide, Trash2, Calculator, History as HistoryIcon, HelpCircle } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { simplifyFraction } from '../utils/mathUtils';
import { useHistory } from '../context/HistoryContext';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function FractionsModule() {
  const { addHistoryEntry, recalledItem, setIsDrawerOpen } = useHistory();
  const [input, setInput] = useState('1 1/2 + 3/4');
  const [result, setResult] = useState<{ simplified: string, decimal: string, mixed?: string } | null>(() => {
    return simplifyFraction('1 1/2 + 3/4');
  });
  const [error, setError] = useState('');

  // Handle global history recall
  useEffect(() => {
    if (recalledItem && recalledItem.module === 'fractions') {
      const expr = recalledItem.recallState?.fractionInput || recalledItem.expression;
      if (expr) {
        setInput(expr);
        const res = simplifyFraction(expr);
        if (res) {
          setResult(res);
          setError('');
        }
      }
    }
  }, [recalledItem]);

  const handleCalculate = (overrideExpr?: string) => {
    setError('');
    const target = overrideExpr !== undefined ? overrideExpr : input;
    if (!target.trim()) {
      setError('Please enter a fraction expression.');
      return;
    }

    const res = simplifyFraction(target);
    if (!res) {
      setError('Invalid format. Use "a/b", "w a/b", or expressions like "(1 1/2) + 2/3".');
      return;
    }
    setResult(res);

    // Save to Universal Calculation History
    addHistoryEntry({
      module: 'fractions',
      title: 'Fraction Engine',
      expression: target,
      result: res.mixed ? `${res.simplified} = ${res.mixed} (${res.decimal})` : `${res.simplified} (${res.decimal})`,
      recallState: { fractionInput: target }
    });
  };

  const loadPreset = (preset: string) => {
    setInput(preset);
    handleCalculate(preset);
  };

  const append = (val: string) => {
    setInput(prev => prev + val);
  };

  const backspace = () => {
    setInput(prev => prev.slice(0, -1));
  };

  const clear = () => {
    setInput('');
    setResult(null);
    setError('');
  };

  const keypad = [
    { label: '1', val: '1' }, { label: '2', val: '2' }, { label: '3', val: '3' }, { label: '+', val: ' + ' },
    { label: '4', val: '4' }, { label: '5', val: '5' }, { label: '6', val: '6' }, { label: '−', val: ' - ' },
    { label: '7', val: '7' }, { label: '8', val: '8' }, { label: '9', val: '9' }, { label: '×', val: ' * ' },
    { label: '(', val: '(' }, { label: '0', val: '0' }, { label: ')', val: ')' }, { label: '÷', val: ' / ' },
    { label: '/', val: '/' }, { label: 'Space', val: ' ' }, { label: '⌫', action: backspace, type: 'op' }, { label: 'C', action: clear, type: 'danger' },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 items-start">
      {/* Left Column: Fraction Keypad & Input Form */}
      <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-3.5 sm:p-4 shadow-sm flex flex-col justify-between space-y-2.5">
        <div>
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">
              Fraction Expression
            </label>
            <button
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded-md transition-colors"
            >
              <HistoryIcon size={12} />
              <span>History</span>
            </button>
          </div>

          {/* Quick Presets */}
          <div className="flex items-center gap-1.5 my-2 overflow-x-auto no-scrollbar">
            <span className="text-[10px] font-semibold text-slate-400 shrink-0">Sample:</span>
            {[
              { label: '1 1/2 + 3/4', val: '1 1/2 + 3/4' },
              { label: '3 1/4 - 1 5/8', val: '3 1/4 - 1 5/8' },
              { label: '(2/3 * 4/5) / 1/2', val: '(2/3 * 4/5) / 1/2' },
            ].map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => loadPreset(p.val)}
                className="px-2 py-0.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 rounded text-[10px] font-medium transition-colors shrink-0"
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="relative mb-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleCalculate(); }}
              placeholder="e.g. 1 1/2 + (3/4 * 2)"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm sm:text-base bg-slate-50/50"
            />
          </div>

          <div className="grid grid-cols-4 gap-1.5 mb-2">
            {keypad.map((btn, i) => (
              <button
                key={i}
                type="button"
                onClick={() => btn.action ? btn.action() : append(btn.val!)}
                className={cn(
                  "py-2 rounded-lg font-bold text-xs sm:text-sm transition-all active:scale-95 border min-h-[36px] flex items-center justify-center",
                  btn.type === 'danger' ? "bg-red-50 text-red-600 border-red-100 hover:bg-red-100" :
                  btn.type === 'op' ? "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200" :
                  "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 shadow-2xs"
                )}
              >
                {btn.label}
              </button>
            ))}
          </div>

          {error && <p className="mb-2 text-xs text-red-500 font-medium bg-red-50 p-1.5 rounded-lg border border-red-100">{error}</p>}
        </div>
        
        <button
          type="button"
          onClick={() => handleCalculate()}
          className="w-full flex items-center justify-center gap-1.5 bg-blue-600 text-white py-2.5 rounded-xl font-bold text-xs sm:text-sm hover:bg-blue-700 transition-all shadow-xs active:scale-98"
        >
          <Calculator size={16} />
          <span>Evaluate Fraction</span>
        </button>
      </div>

      {/* Right Column: Computed Results & Quick Syntax Reference */}
      <div className="lg:col-span-6 space-y-3">
        {result ? (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 text-center space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Calculated Output</span>
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">Reduced</span>
            </div>

            <div className={`grid ${result.mixed ? 'grid-cols-3' : 'grid-cols-2'} gap-2.5`}>
              <div className="bg-blue-50/70 border border-blue-200/80 rounded-xl p-3 flex flex-col items-center justify-center">
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest block mb-1">Improper / Ratio</span>
                <span className="text-xl sm:text-2xl font-mono font-bold text-blue-800">{result.simplified}</span>
              </div>
              {result.mixed && (
                <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-3 flex flex-col items-center justify-center">
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest block mb-1">Mixed Form</span>
                  <span className="text-xl sm:text-2xl font-mono font-bold text-emerald-800">{result.mixed}</span>
                </div>
              )}
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex flex-col items-center justify-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Decimal</span>
                <span className="text-xl sm:text-2xl font-mono font-bold text-slate-800">{result.decimal}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 text-center text-slate-400 space-y-2">
            <Divide size={28} className="mx-auto text-slate-300" />
            <p className="text-xs">Enter a fraction or mixed expression and tap Evaluate to view simplified fractions.</p>
          </div>
        )}

        {/* Compact Syntax Guide Bar */}
        <div className="bg-slate-900 rounded-2xl p-3.5 text-slate-300 text-xs space-y-2 shadow-sm">
          <div className="flex items-center gap-1.5 text-white font-bold text-xs pb-1.5 border-b border-slate-800">
            <HelpCircle size={14} className="text-blue-400" />
            <span>Fraction Syntax Tips</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div>
              <span className="font-semibold text-slate-200 block">Mixed Fractions:</span>
              <span className="text-slate-400 font-mono">1 1/2 + 2 3/4</span>
            </div>
            <div>
              <span className="font-semibold text-slate-200 block">Brackets & Power:</span>
              <span className="text-slate-400 font-mono">(1/2 + 3/4) * 2</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
