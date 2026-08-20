import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Ruler,
  Scale,
  Thermometer,
  Grid,
  Beaker,
  Gauge,
  Clock,
  Compass,
  Zap,
  Flame,
  HardDrive,
  ArrowRightLeft,
  Copy,
  Check,
  BookmarkPlus,
  History as HistoryIcon,
  Search,
  Sparkles,
  Info,
  ChevronDown
} from 'lucide-react';
import {
  UNIT_CATEGORIES,
  executeUnitConversion,
  UnitCategory,
  UnitDef,
  formatConversionNumber
} from '../utils/conversionUtils';
import { useHistory } from '../context/HistoryContext';

// Helper to render category icon
const getCategoryIcon = (iconName: string, size = 16, className = '') => {
  switch (iconName) {
    case 'Ruler':
      return <Ruler size={size} className={className} />;
    case 'Scale':
      return <Scale size={size} className={className} />;
    case 'Thermometer':
      return <Thermometer size={size} className={className} />;
    case 'Grid':
      return <Grid size={size} className={className} />;
    case 'Beaker':
      return <Beaker size={size} className={className} />;
    case 'Gauge':
      return <Gauge size={size} className={className} />;
    case 'Clock':
      return <Clock size={size} className={className} />;
    case 'Compass':
      return <Compass size={size} className={className} />;
    case 'Zap':
      return <Zap size={size} className={className} />;
    case 'Flame':
      return <Flame size={size} className={className} />;
    case 'HardDrive':
      return <HardDrive size={size} className={className} />;
    default:
      return <Ruler size={size} className={className} />;
  }
};

export default function ConversionModule() {
  const { addHistoryEntry, recalledItem, setIsDrawerOpen } = useHistory();

  // Active state
  const [selectedCategory, setSelectedCategory] = useState<string>(() => {
    try {
      return localStorage.getItem('malawi_calc_conv_cat') || 'length';
    } catch {
      return 'length';
    }
  });

  const [fromUnitId, setFromUnitId] = useState<string>('m');
  const [toUnitId, setToUnitId] = useState<string>('ft');
  const [inputValue, setInputValue] = useState<string>('1');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [copiedUnitId, setCopiedUnitId] = useState<string | null>(null);
  const [showAllUnits, setShowAllUnits] = useState<boolean>(true);

  // Active Category definition
  const currentCategory = useMemo(() => {
    return UNIT_CATEGORIES.find((c) => c.id === selectedCategory) || UNIT_CATEGORIES[0];
  }, [selectedCategory]);

  // When category changes, set sensible default units
  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId);
    try {
      localStorage.setItem('malawi_calc_conv_cat', catId);
    } catch {}

    const cat = UNIT_CATEGORIES.find((c) => c.id === catId);
    if (cat && cat.units.length > 1) {
      setFromUnitId(cat.units[0].id);
      setToUnitId(cat.units[1].id);
    }
  };

  // Perform calculation
  const numericInput = parseFloat(inputValue);
  const conversionResult = useMemo(() => {
    const validVal = isNaN(numericInput) ? 0 : numericInput;
    return executeUnitConversion(selectedCategory, fromUnitId, toUnitId, validVal);
  }, [selectedCategory, fromUnitId, toUnitId, numericInput]);

  // Handle global history recall
  useEffect(() => {
    if (recalledItem && recalledItem.module === 'conversions') {
      if (recalledItem.recallState) {
        const { conversionCategory, conversionFrom, conversionTo, conversionValue } = recalledItem.recallState;
        if (conversionCategory && UNIT_CATEGORIES.some((c) => c.id === conversionCategory)) {
          setSelectedCategory(conversionCategory);
        }
        if (conversionFrom) setFromUnitId(conversionFrom);
        if (conversionTo) setToUnitId(conversionTo);
        if (conversionValue !== undefined) setInputValue(conversionValue);
      }
    }
  }, [recalledItem]);

  const swapUnits = () => {
    setFromUnitId(toUnitId);
    setToUnitId(fromUnitId);
  };

  const copyResult = (textToCopy: string, unitId?: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy);
      if (unitId) {
        setCopiedUnitId(unitId);
        setTimeout(() => setCopiedUnitId(null), 1500);
      } else {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }
    }
  };

  const saveToHistory = () => {
    if (!conversionResult) return;
    const { fromUnit, toUnit, formattedResult, formula } = conversionResult;
    addHistoryEntry({
      module: 'conversions',
      title: `${currentCategory.name} Conversion`,
      expression: `${inputValue} ${fromUnit.symbol} → ${toUnit.symbol}`,
      result: `${formattedResult} ${toUnit.symbol}`,
      details: `${inputValue} ${fromUnit.name} = ${formattedResult} ${toUnit.name} (${formula})`,
      recallState: {
        conversionCategory: selectedCategory,
        conversionFrom: fromUnitId,
        conversionTo: toUnitId,
        conversionValue: inputValue
      }
    });
  };

  // Filter categories by search if user is typing
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return UNIT_CATEGORIES;
    const q = searchQuery.toLowerCase();
    return UNIT_CATEGORIES.filter((c) => {
      const matchCat = c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q);
      const matchUnit = c.units.some(
        (u) => u.name.toLowerCase().includes(q) || u.symbol.toLowerCase().includes(q)
      );
      return matchCat || matchUnit;
    });
  }, [searchQuery]);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-3">
      {/* Category Pills Navigation Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-xs space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Select Quantity / Category
            </span>
            <span className="px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold">
              {UNIT_CATEGORIES.length} Categories
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="relative">
              <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search mass, temp, length..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-7 pr-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:ring-1 focus:ring-blue-500 focus:bg-white outline-none w-36 sm:w-48 transition-all"
              />
            </div>
            <button
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center gap-1 text-xs font-semibold"
            >
              <HistoryIcon size={13} />
              <span className="hidden sm:inline">History</span>
            </button>
          </div>
        </div>

        {/* Scrollable / Grid Category Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          {filteredCategories.map((cat) => {
            const isSelected = cat.id === selectedCategory;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryChange(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all shrink-0 ${
                  isSelected
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/60'
                }`}
              >
                {getCategoryIcon(cat.iconName, 14, isSelected ? 'text-white' : 'text-blue-600')}
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Conversion Panel */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-4">
        {/* Module Title & Header Actions */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              {getCategoryIcon(currentCategory.iconName, 20)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">{currentCategory.name} Converter</h3>
                <span className="px-2 py-0.5 bg-slate-100 rounded-md text-[10px] font-mono font-bold text-slate-600 uppercase">
                  {currentCategory.units.length} units
                </span>
              </div>
              <p className="text-xs text-slate-500">{currentCategory.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={saveToHistory}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-all shadow-xs active:scale-95"
            >
              <BookmarkPlus size={14} />
              <span>Save to History</span>
            </button>
          </div>
        </div>

        {/* Input & Output Conversion Grid */}
        <div className="grid grid-cols-1 md:grid-cols-11 gap-3 items-center">
          {/* FROM CARD */}
          <div className="md:col-span-5 bg-slate-50/80 rounded-2xl p-3.5 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                From Quantity
              </label>
              <div className="relative">
                <select
                  value={fromUnitId}
                  onChange={(e) => setFromUnitId(e.target.value)}
                  className="appearance-none bg-white border border-slate-200 rounded-lg pl-2.5 pr-7 py-1 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer shadow-2xs"
                >
                  {currentCategory.units.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.symbol})
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={12}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
              </div>
            </div>

            <div className="relative">
              <input
                type="number"
                step="any"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="0"
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-2xl font-mono font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-2xs"
              />
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono font-bold text-sm bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/80">
                {conversionResult?.fromUnit.symbol}
              </div>
            </div>

            {/* From Unit Description */}
            <p className="text-[11px] text-slate-500 truncate">
              {conversionResult?.fromUnit.name}
              {conversionResult?.fromUnit.description ? ` • ${conversionResult.fromUnit.description}` : ''}
            </p>
          </div>

          {/* SWAP BUTTON */}
          <div className="md:col-span-1 flex justify-center py-1 md:py-0">
            <button
              type="button"
              onClick={swapUnits}
              title="Swap From and To units"
              className="p-3 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 border border-blue-200 shadow-xs hover:shadow transition-all active:scale-90"
            >
              <ArrowRightLeft size={16} />
            </button>
          </div>

          {/* TO RESULT CARD */}
          <div className="md:col-span-5 bg-blue-50/50 rounded-2xl p-3.5 border border-blue-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">
                Converted Result
              </label>
              <div className="relative">
                <select
                  value={toUnitId}
                  onChange={(e) => setToUnitId(e.target.value)}
                  className="appearance-none bg-white border border-blue-200 rounded-lg pl-2.5 pr-7 py-1 text-xs font-bold text-blue-900 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer shadow-2xs"
                >
                  {currentCategory.units.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.symbol})
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={12}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-400 pointer-events-none"
                />
              </div>
            </div>

            <div className="relative flex items-center justify-between bg-white border border-blue-200 rounded-xl px-4 py-3 min-h-[56px] shadow-2xs">
              <span className="text-2xl font-mono font-bold text-blue-700 truncate pr-16">
                {conversionResult ? conversionResult.formattedResult : '0'}
              </span>
              <div className="flex items-center gap-1.5 absolute right-3 top-1/2 -translate-y-1/2">
                <button
                  type="button"
                  onClick={() => copyResult(conversionResult?.formattedResult || '0')}
                  title="Copy result"
                  className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                >
                  {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                </button>
                <span className="text-xs font-mono font-bold text-blue-800 bg-blue-100/70 px-2 py-0.5 rounded-md border border-blue-200">
                  {conversionResult?.toUnit.symbol}
                </span>
              </div>
            </div>

            {/* To Unit Description */}
            <p className="text-[11px] text-blue-700/80 truncate">
              {conversionResult?.toUnit.name}
              {conversionResult?.toUnit.description ? ` • ${conversionResult.toUnit.description}` : ''}
            </p>
          </div>
        </div>

        {/* Formula & Explanation Card */}
        {conversionResult && (
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex items-center justify-between flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-2 text-slate-700">
              <Info size={15} className="text-blue-600 shrink-0" />
              <span className="font-semibold text-slate-900">Conversion Relationship:</span>
              <span className="font-mono text-blue-700 bg-white px-2 py-0.5 rounded border border-slate-200 font-bold">
                {conversionResult.formula}
              </span>
            </div>
            <div className="font-mono text-[11px] text-slate-500">
              Base: {currentCategory.units.find((u) => u.id === currentCategory.baseUnitId)?.name || 'SI Unit'}
            </div>
          </div>
        )}

        {/* Quick Presets for Current Category */}
        {currentCategory.presets && currentCategory.presets.length > 0 && (
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <Sparkles size={11} className="text-amber-500" />
                <span>Common {currentCategory.name} Presets</span>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {currentCategory.presets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setInputValue(String(preset.value));
                    setFromUnitId(preset.fromUnit);
                    setToUnitId(preset.toUnit);
                  }}
                  className="p-2 bg-slate-50 hover:bg-blue-50/70 border border-slate-200 hover:border-blue-300 rounded-xl text-left transition-all group active:scale-98"
                >
                  <div className="font-semibold text-xs text-slate-800 group-hover:text-blue-700 truncate">
                    {preset.label}
                  </div>
                  {preset.note && (
                    <div className="text-[10px] text-slate-500 group-hover:text-blue-600/80 truncate">
                      {preset.note}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Live Matrix: All Units in this Category Converted Simultaneously */}
        {conversionResult && (
          <div className="pt-3 border-t border-slate-100 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Live Unit Matrix (All {currentCategory.name} Units)
                </span>
                <span className="text-[10px] text-slate-500">
                  Equivalent to {inputValue} {conversionResult.fromUnit.symbol}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowAllUnits(!showAllUnits)}
                className="text-[11px] text-blue-600 hover:text-blue-700 font-semibold"
              >
                {showAllUnits ? 'Collapse Matrix' : 'Expand Matrix'}
              </button>
            </div>

            <AnimatePresence>
              {showAllUnits && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 overflow-hidden"
                >
                  {conversionResult.allConversions.map((conv) => {
                    const isTarget = conv.isCurrentTarget;
                    const isSource = conv.isCurrentSource;
                    return (
                      <div
                        key={conv.unit.id}
                        className={`p-2.5 rounded-xl border flex items-center justify-between transition-all ${
                          isTarget
                            ? 'bg-blue-50/90 border-blue-300 ring-1 ring-blue-400'
                            : isSource
                            ? 'bg-slate-100/90 border-slate-300'
                            : 'bg-slate-50 border-slate-200/80 hover:bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="min-w-0 pr-2">
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-xs text-slate-900 truncate">
                              {conv.unit.name}
                            </span>
                            <span className="text-[10px] font-mono font-bold text-slate-500">
                              ({conv.unit.symbol})
                            </span>
                            {isTarget && (
                              <span className="px-1.5 py-0.2 text-[9px] bg-blue-600 text-white rounded font-bold uppercase">
                                Selected
                              </span>
                            )}
                            {isSource && (
                              <span className="px-1.5 py-0.2 text-[9px] bg-slate-600 text-white rounded font-bold uppercase">
                                Input
                              </span>
                            )}
                          </div>
                          <div className="font-mono text-sm font-bold text-slate-800 truncate mt-0.5">
                            {conv.formatted} <span className="text-xs text-slate-500 font-normal">{conv.unit.symbol}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => copyResult(conv.formatted, conv.unit.id)}
                            title="Copy converted value"
                            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-white rounded transition-colors"
                          >
                            {copiedUnitId === conv.unit.id ? (
                              <Check size={13} className="text-emerald-500" />
                            ) : (
                              <Copy size={13} />
                            )}
                          </button>
                          {!isTarget && !isSource && (
                            <button
                              type="button"
                              onClick={() => setToUnitId(conv.unit.id)}
                              title="Set as target unit"
                              className="px-1.5 py-0.5 text-[10px] font-medium text-blue-600 hover:bg-blue-100 rounded transition-colors"
                            >
                              Set Target
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
