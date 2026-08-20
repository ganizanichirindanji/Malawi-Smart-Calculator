import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { RefreshCw, ArrowRightLeft, History as HistoryIcon, BookmarkPlus } from 'lucide-react';
import { convertAngle } from '../utils/mathUtils';
import { useHistory } from '../context/HistoryContext';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Unit = 'deg' | 'rad';

export default function ConversionModule() {
  const { addHistoryEntry, recalledItem, setIsDrawerOpen } = useHistory();
  const [value, setValue] = useState<string>('45');
  const [fromUnit, setFromUnit] = useState<Unit>('deg');
  const [toUnit, setToUnit] = useState<Unit>('rad');

  const result = convertAngle(parseFloat(value) || 0, fromUnit, toUnit);

  // Handle global history recall
  useEffect(() => {
    if (recalledItem && recalledItem.module === 'conversions') {
      if (recalledItem.recallState?.conversionValue !== undefined) {
        setValue(recalledItem.recallState.conversionValue);
        if (recalledItem.recallState.conversionFrom) setFromUnit(recalledItem.recallState.conversionFrom);
        if (recalledItem.recallState.conversionTo) setToUnit(recalledItem.recallState.conversionTo);
      }
    }
  }, [recalledItem]);

  const recordConversion = () => {
    const formattedResult = result.toFixed(6).replace(/\.?0+$/, '');
    addHistoryEntry({
      module: 'conversions',
      title: 'Angle Conversion',
      expression: `${value} ${fromUnit} → ${toUnit}`,
      result: `${formattedResult} ${toUnit}`,
      details: fromUnit === 'deg' ? `${value}° = ${formattedResult} rad` : `${value} rad = ${formattedResult}°`,
      recallState: {
        conversionValue: value,
        conversionFrom: fromUnit,
        conversionTo: toUnit
      }
    });
  };

  const swap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-3">
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-4">
        {/* Header toolbar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Angle Unit Converter</h3>
            <p className="text-[11px] text-slate-500">Instant conversion between Degrees (°) and Radians (rad)</p>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              className="px-2.5 py-1.5 bg-slate-100 text-slate-600 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all flex items-center gap-1 text-xs font-semibold"
            >
              <HistoryIcon size={13} />
              <span>History</span>
            </button>
            <button
              type="button"
              onClick={recordConversion}
              className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-all shadow-xs active:scale-95"
            >
              <BookmarkPlus size={13} />
              <span>Save</span>
            </button>
          </div>
        </div>

        {/* Inputs & Outputs Side by Side with Center Swap Button */}
        <div className="grid grid-cols-1 md:grid-cols-11 gap-3 items-center">
          {/* From Input Card */}
          <div className="md:col-span-5 space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">From Angle</label>
              <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded-md text-[10px] font-bold text-slate-700 uppercase">
                {fromUnit === 'deg' ? 'Degrees (°)' : 'Radians (rad)'}
              </span>
            </div>
            <div className="relative">
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xl sm:text-2xl font-mono font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-2xs"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-mono font-semibold text-sm">
                {fromUnit}
              </div>
            </div>
          </div>

          {/* Center Swap Button */}
          <div className="md:col-span-1 flex justify-center pt-2 md:pt-4">
            <button 
              type="button"
              onClick={swap}
              title="Swap From & To units"
              className="p-2.5 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-all active:scale-90 border border-blue-200 shadow-xs"
            >
              <ArrowRightLeft size={16} />
            </button>
          </div>

          {/* To Result Card */}
          <div className="md:col-span-5 space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Converted Result</label>
              <span className="px-2 py-0.5 bg-blue-50 border border-blue-100 rounded-md text-[10px] font-bold text-blue-600 uppercase">
                {toUnit === 'deg' ? 'Degrees (°)' : 'Radians (rad)'}
              </span>
            </div>
            <div className="relative">
              <div className="w-full px-4 py-3 bg-blue-50/70 border border-blue-200/80 rounded-xl text-xl sm:text-2xl font-mono font-bold text-blue-700 flex items-center min-h-[50px] truncate shadow-2xs">
                {result.toFixed(6).replace(/\.?0+$/, '')}
              </div>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-400 font-mono font-semibold text-sm">
                {toUnit}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Angle Presets */}
        <div className="pt-2 border-t border-slate-100">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Common Presets</span>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
            {[
              { label: '30°', val: '30', unit: 'deg' },
              { label: '45°', val: '45', unit: 'deg' },
              { label: '60°', val: '60', unit: 'deg' },
              { label: '90°', val: '90', unit: 'deg' },
              { label: '180°', val: '180', unit: 'deg' },
              { label: 'π/6', val: (Math.PI/6).toFixed(4), unit: 'rad' },
              { label: 'π/4', val: (Math.PI/4).toFixed(4), unit: 'rad' },
              { label: 'π', val: Math.PI.toFixed(4), unit: 'rad' },
            ].map((preset, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setValue(preset.val);
                  setFromUnit(preset.unit as Unit);
                  setToUnit(preset.unit === 'deg' ? 'rad' : 'deg');
                }}
                className="py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-medium text-slate-700 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50/50 transition-all active:scale-95"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Compact Formula Summary */}
        <div className="bg-slate-50 rounded-xl p-2.5 flex items-center gap-2 text-[11px] text-slate-600 border border-slate-100">
          <RefreshCw size={13} className="text-slate-400 shrink-0" />
          <span className="font-semibold text-slate-700">Formula:</span>
          {fromUnit === 'deg' ? (
            <span className="font-mono">Radians = Degrees × (π / 180)</span>
          ) : (
            <span className="font-mono">Degrees = Radians × (180 / π)</span>
          )}
        </div>
      </div>
    </div>
  );
}
