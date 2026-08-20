import React, { useState, useEffect } from 'react';
import { calculateStatistics } from '../utils/mathUtils';
import { BarChart3, Trash2, Calculator, History as HistoryIcon, Sparkles } from 'lucide-react';
import { useHistory } from '../context/HistoryContext';

export default function StatisticsModule() {
  const { addHistoryEntry, recalledItem, setIsDrawerOpen } = useHistory();
  const [input, setInput] = useState('12, 18, 25, 30, 30, 42, 55, 68');
  const [results, setResults] = useState<ReturnType<typeof calculateStatistics>>(() => {
    return calculateStatistics([12, 18, 25, 30, 30, 42, 55, 68]);
  });
  const [error, setError] = useState('');

  // Handle global history recall
  useEffect(() => {
    if (recalledItem && recalledItem.module === 'statistics') {
      const dataStr = recalledItem.recallState?.datasetInput || recalledItem.expression.replace(/^Dataset:\s*\[?/, '').replace(/\]?$/, '');
      if (dataStr) {
        setInput(dataStr);
        const numbers = dataStr
          .split(/[\s,]+/)
          .map(n => n.trim())
          .filter(n => n !== '')
          .map(Number);
        if (numbers.length > 0 && !numbers.some(isNaN)) {
          setResults(calculateStatistics(numbers));
          setError('');
        }
      }
    }
  }, [recalledItem]);

  const handleCalculate = (customInput?: string) => {
    setError('');
    const raw = customInput !== undefined ? customInput : input;
    const numbers = raw
      .split(/[\s,]+/)
      .map(n => n.trim())
      .filter(n => n !== '')
      .map(Number);

    if (numbers.some(isNaN)) {
      setError('Please enter valid numbers separated by commas or spaces.');
      return;
    }

    if (numbers.length === 0) {
      setError('Please enter at least one number.');
      return;
    }

    const stats = calculateStatistics(numbers);
    setResults(stats);

    // Save to Calculation History
    addHistoryEntry({
      module: 'statistics',
      title: 'Statistics Analysis',
      expression: `Dataset: [${numbers.slice(0, 8).join(', ')}${numbers.length > 8 ? '...' : ''}]`,
      result: `Mean: ${stats.mean.toFixed(2)}, Σ: ${stats.sum.toFixed(2)}, N: ${stats.count}`,
      details: `Median: ${stats.median.toFixed(2)}, Std Dev: ${stats.stdDev.toFixed(4)}, Range: ${stats.min} – ${stats.max}`,
      recallState: { datasetInput: raw }
    });
  };

  const loadPreset = (preset: string) => {
    setInput(preset);
    handleCalculate(preset);
  };

  const clear = () => {
    setInput('');
    setResults(null);
    setError('');
  };

  return (
    <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 items-start">
      {/* Left Column: Dataset Input & Presets */}
      <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-3.5 sm:p-4 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">
              Dataset Input
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
          <div className="flex items-center gap-1.5 mb-2 overflow-x-auto pb-1 no-scrollbar">
            <span className="text-[10px] font-semibold text-slate-400 shrink-0">Sample:</span>
            {[
              { label: 'Exam Scores', data: '45, 62, 78, 85, 90, 92, 68, 74' },
              { label: 'Temperatures', data: '22.5, 24.1, 28.0, 31.2, 29.5, 26.0' },
              { label: 'Small', data: '3, 7, 8, 12, 14, 18' }
            ].map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => loadPreset(p.data)}
                className="px-2 py-0.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 rounded text-[10px] font-medium transition-colors shrink-0"
              >
                {p.label}
              </button>
            ))}
          </div>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. 10, 20, 30, 40, 50"
            className="w-full h-24 sm:h-28 p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-mono text-xs sm:text-sm resize-none bg-slate-50/50"
          />
          {error && <p className="mt-1 text-xs text-red-500 font-medium">{error}</p>}
        </div>

        <div className="flex gap-2 mt-3">
          <button
            onClick={() => handleCalculate()}
            className="flex-1 flex items-center justify-center gap-1.5 bg-blue-600 text-white py-2.5 rounded-xl font-bold text-xs sm:text-sm hover:bg-blue-700 transition-all shadow-xs active:scale-98"
          >
            <Calculator size={15} />
            <span>Calculate</span>
          </button>
          <button
            onClick={clear}
            title="Clear input"
            className="px-3.5 flex items-center justify-center bg-slate-100 text-slate-600 py-2.5 rounded-xl font-semibold hover:bg-red-50 hover:text-red-600 transition-all"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Right Column: Statistics Summary Dashboard */}
      <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
        <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <BarChart3 size={15} className="text-blue-600" />
            <span>Statistical Summary Analysis</span>
          </h3>
          {results && (
            <span className="text-[10px] font-mono font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
              n = {results.count}
            </span>
          )}
        </div>

        {results ? (
          <div className="p-3 sm:p-4 space-y-3">
            {/* 4 Core Primary Metric Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="bg-blue-50/70 border border-blue-200/80 rounded-xl p-2.5 text-center">
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">Mean (x̄)</span>
                <span className="text-base sm:text-lg font-mono font-bold text-blue-900">{results.mean.toFixed(3)}</span>
              </div>
              <div className="bg-indigo-50/60 border border-indigo-200/80 rounded-xl p-2.5 text-center">
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block">Median (x̃)</span>
                <span className="text-base sm:text-lg font-mono font-bold text-indigo-900">{results.median.toFixed(3)}</span>
              </div>
              <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-xl p-2.5 text-center">
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">Std Dev (s)</span>
                <span className="text-base sm:text-lg font-mono font-bold text-emerald-900">{results.stdDev.toFixed(3)}</span>
              </div>
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 text-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Sum (Σx)</span>
                <span className="text-base sm:text-lg font-mono font-bold text-slate-800">{results.sum.toFixed(2)}</span>
              </div>
            </div>

            {/* Dense 2-Column Property Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 pt-1 text-xs border-t border-slate-100">
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Mode</span>
                <span className="font-mono font-semibold text-slate-900 truncate max-w-[120px]">{results.mode}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Sample Variance (s²)</span>
                <span className="font-mono font-semibold text-slate-900">{results.variance.toFixed(4)}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Pop. Std Dev (σ)</span>
                <span className="font-mono font-semibold text-slate-900">{results.popStdDev.toFixed(4)}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Pop. Variance (σ²)</span>
                <span className="font-mono font-semibold text-slate-900">{results.popVariance.toFixed(4)}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Standard Error (SE)</span>
                <span className="font-mono font-semibold text-slate-900">{results.standardError.toFixed(4)}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Quartiles (Q₁ / Q₃)</span>
                <span className="font-mono font-semibold text-slate-900">{results.q1} / {results.q3}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Interquartile Range (IQR)</span>
                <span className="font-mono font-semibold text-slate-900">{results.iqr.toFixed(3)}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Range (Max - Min)</span>
                <span className="font-mono font-semibold text-slate-900">{results.range.toFixed(3)} ({results.min} to {results.max})</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-500">Sum of Squares (Σx²)</span>
                <span className="font-mono font-semibold text-slate-900">{results.sumSq.toFixed(2)}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-slate-400 flex flex-col items-center justify-center space-y-2">
            <BarChart3 size={32} className="text-slate-300" />
            <p className="text-xs">Enter numbers on the left and tap Calculate to see the statistics breakdown.</p>
          </div>
        )}
      </div>
    </div>
  );
}
