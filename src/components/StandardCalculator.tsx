import React, { useState, useEffect } from 'react';
import { 
  Delete, 
  RotateCcw, 
  Sparkles, 
  Info, 
  Copy, 
  Check, 
  ArrowRightLeft,
  ChevronDown,
  History as HistoryIcon,
  Atom,
  Search,
  X,
  Zap,
  BookOpen
} from 'lucide-react';
import { calculateExpression, SCIENTIFIC_CONSTANTS, ScientificConstant, NotationMode, getAllAnswerNotations, formatAnswerByMode } from '../utils/mathUtils';
import { useHistory } from '../context/HistoryContext';

interface Props {
  mode: 'standard' | 'scientific';
}

export default function StandardCalculator({ mode }: Props) {
  const { addHistoryEntry, recalledItem, setIsDrawerOpen } = useHistory();
  const [display, setDisplay] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [notationMode, setNotationMode] = useState<NotationMode>(() => {
    try {
      return (localStorage.getItem('malawi_calc_notation_mode') as NotationMode) || 'full';
    } catch {
      return 'full';
    }
  });
  const [lastAns, setLastAns] = useState<string>(() => {
    try {
      return localStorage.getItem('malawi_calc_last_ans') || '0';
    } catch {
      return '0';
    }
  });
  const [history, setHistory] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('malawi_calc_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [angleMode, setAngleMode] = useState<'deg' | 'rad'>(() => {
    try {
      return (localStorage.getItem('malawi_calc_angle_mode') as 'deg' | 'rad') || 'deg';
    } catch {
      return 'deg';
    }
  });
  const [isSecond, setIsSecond] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'all' | 'trig' | 'algebra' | 'prob' | 'const'>('all');
  const [showConstantsModal, setShowConstantsModal] = useState(false);
  const [constantsSearch, setConstantsSearch] = useState('');
  const [selectedConstantCat, setSelectedConstantCat] = useState<'all' | 'universal' | 'physics' | 'chemistry' | 'math'>('all');
  const [copiedConstantId, setCopiedConstantId] = useState<string | null>(null);

  // Compute all notation representations for the active result
  const answerNotations = getAllAnswerNotations(result);
  const displayedResult = result !== null ? formatAnswerByMode(result, notationMode) : null;

  const handleNotationModeChange = (newMode: NotationMode) => {
    vibrate();
    setNotationMode(newMode);
    try {
      localStorage.setItem('malawi_calc_notation_mode', newMode);
    } catch {}
  };

  const cycleNotationMode = () => {
    vibrate();
    setNotationMode(prev => {
      let next: NotationMode = 'full';
      if (prev === 'full') next = 'sci';
      else if (prev === 'sci') next = answerNotations.fraction ? 'fraction' : 'eng';
      else if (prev === 'fraction') next = 'eng';
      else if (prev === 'eng') next = 'full';
      try {
        localStorage.setItem('malawi_calc_notation_mode', next);
      } catch {}
      return next;
    });
  };

  // Handle global history recall
  useEffect(() => {
    if (recalledItem && (recalledItem.module === mode || (recalledItem.module === 'standard' && mode === 'scientific') || (recalledItem.module === 'scientific' && mode === 'standard'))) {
      if (recalledItem.recallState?.display) {
        setDisplay(recalledItem.recallState.display);
        setResult(recalledItem.result);
      } else if (recalledItem.expression) {
        setDisplay(recalledItem.expression);
        setResult(recalledItem.result);
      }
    }
  }, [recalledItem, mode]);

  const vibrate = () => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(8);
      } catch {}
    }
  };

  const append = (val: string) => {
    vibrate();
    setDisplay(prev => prev + val);
  };

  const clear = () => {
    vibrate();
    setDisplay('');
    setResult(null);
  };

  const backspace = () => {
    vibrate();
    setDisplay(prev => prev.slice(0, -1));
  };

  const toggleSign = () => {
    vibrate();
    if (!display) {
      setDisplay('-');
      return;
    }
    // If expression already ends with a number or starts with -, toggle
    if (display.startsWith('-(') && display.endsWith(')')) {
      setDisplay(display.slice(2, -1));
    } else {
      setDisplay(`-(${display})`);
    }
  };

  const handleAngleModeChange = (newMode: 'deg' | 'rad') => {
    vibrate();
    setAngleMode(newMode);
    try {
      localStorage.setItem('malawi_calc_angle_mode', newMode);
    } catch {}
  };

  const calculate = () => {
    vibrate();
    if (!display || !display.trim()) return;
    const res = calculateExpression(display, angleMode, lastAns);
    if (res !== 'Error' && res !== 'Undefined') {
      const newHistory = [`${display} = ${res}`, ...history].slice(0, 10);
      setHistory(newHistory);
      setResult(res);
      setLastAns(res);

      // Record to Universal Calculation History
      addHistoryEntry({
        module: mode,
        title: mode === 'standard' ? 'Standard Calculator' : 'Scientific Calculator',
        expression: display,
        result: res,
        details: mode === 'scientific' ? `Angle mode: ${angleMode.toUpperCase()}` : undefined,
        recallState: { display }
      });

      try {
        localStorage.setItem('malawi_calc_history', JSON.stringify(newHistory));
        localStorage.setItem('malawi_calc_last_ans', res);
      } catch {}
    } else {
      setResult(res || 'Error');
    }
  };

  const copyResult = () => {
    const textToCopy = displayedResult !== null ? displayedResult : (result !== null ? result : display);
    if (textToCopy) {
      navigator.clipboard?.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  const standardButtons = [
    { label: 'C', action: clear, type: 'danger' },
    { label: '(', action: () => append('('), type: 'op' },
    { label: ')', action: () => append(')'), type: 'op' },
    { label: '÷', action: () => append(' / '), type: 'op' },
    
    { label: '7', action: () => append('7'), type: 'num' },
    { label: '8', action: () => append('8'), type: 'num' },
    { label: '9', action: () => append('9'), type: 'num' },
    { label: '×', action: () => append(' * '), type: 'op' },
    
    { label: '4', action: () => append('4'), type: 'num' },
    { label: '5', action: () => append('5'), type: 'num' },
    { label: '6', action: () => append('6'), type: 'num' },
    { label: '−', action: () => append(' - '), type: 'op' },
    
    { label: '1', action: () => append('1'), type: 'num' },
    { label: '2', action: () => append('2'), type: 'num' },
    { label: '3', action: () => append('3'), type: 'num' },
    { label: '+', action: () => append(' + '), type: 'op' },
    
    { label: '±', action: toggleSign, type: 'num' },
    { label: '0', action: () => append('0'), type: 'num' },
    { label: '.', action: () => append('.'), type: 'num' },
    { label: '%', action: () => append('%'), type: 'op' },
    { label: 'Ans', action: () => append('Ans'), type: 'op' },
    { label: 'Space', action: () => append(' '), type: 'op' },
    { label: '=', action: calculate, type: 'accent', span2: true },
  ];

  // Scientific functions matrix (Standard vs 2nd Shift)
  const scientificOperations = [
    // Trigonometry & Hyperbolic
    { 
      id: 'sin',
      primary: { label: 'sin', action: () => append('sin('), desc: 'Sine' },
      second: { label: 'sin⁻¹', action: () => append('asin('), desc: 'Arcsine' },
      category: 'trig'
    },
    { 
      id: 'cos',
      primary: { label: 'cos', action: () => append('cos('), desc: 'Cosine' },
      second: { label: 'cos⁻¹', action: () => append('acos('), desc: 'Arccosine' },
      category: 'trig'
    },
    { 
      id: 'tan',
      primary: { label: 'tan', action: () => append('tan('), desc: 'Tangent' },
      second: { label: 'tan⁻¹', action: () => append('atan('), desc: 'Arctangent' },
      category: 'trig'
    },
    { 
      id: 'sinh',
      primary: { label: 'sinh', action: () => append('sinh('), desc: 'Hyperbolic Sine' },
      second: { label: 'sinh⁻¹', action: () => append('asinh('), desc: 'Inverse Sinh' },
      category: 'trig'
    },
    { 
      id: 'cosh',
      primary: { label: 'cosh', action: () => append('cosh('), desc: 'Hyperbolic Cosine' },
      second: { label: 'cosh⁻¹', action: () => append('acosh('), desc: 'Inverse Cosh' },
      category: 'trig'
    },
    { 
      id: 'tanh',
      primary: { label: 'tanh', action: () => append('tanh('), desc: 'Hyperbolic Tan' },
      second: { label: 'tanh⁻¹', action: () => append('atanh('), desc: 'Inverse Tanh' },
      category: 'trig'
    },

    // Logarithms & Exponentials
    { 
      id: 'ln',
      primary: { label: 'ln', action: () => append('ln('), desc: 'Natural Log (base e)' },
      second: { label: 'eˣ', action: () => append('exp('), desc: 'Exponential e^x' },
      category: 'algebra'
    },
    { 
      id: 'log',
      primary: { label: 'log₁₀', action: () => append('log('), desc: 'Common Log (base 10)' },
      second: { label: '10ˣ', action: () => append('10^('), desc: 'Power of 10' },
      category: 'algebra'
    },
    { 
      id: 'log2',
      primary: { label: 'log₂', action: () => append('log2('), desc: 'Binary Log (base 2)' },
      second: { label: '2ˣ', action: () => append('2^('), desc: 'Power of 2' },
      category: 'algebra'
    },

    // Powers, Roots & Radicals
    { 
      id: 'sqr',
      primary: { label: 'x²', action: () => append('^2'), desc: 'Square' },
      second: { label: '√x', action: () => append('sqrt('), desc: 'Square Root' },
      category: 'algebra'
    },
    { 
      id: 'cube',
      primary: { label: 'x³', action: () => append('^3'), desc: 'Cube' },
      second: { label: '∛x', action: () => append('cbrt('), desc: 'Cube Root' },
      category: 'algebra'
    },
    { 
      id: 'power',
      primary: { label: 'xʸ', action: () => append('^'), desc: 'Power x^y' },
      second: { label: 'ʸ√x', action: () => append('nthRoot('), desc: 'nth Root: nthRoot(x, n)' },
      category: 'algebra'
    },
    { 
      id: 'reciprocal',
      primary: { label: '1/x', action: () => append('^(-1)'), desc: 'Reciprocal' },
      second: { label: '|x|', action: () => append('abs('), desc: 'Absolute Value' },
      category: 'algebra'
    },

    // Combinatorics, Probability & Integers
    { 
      id: 'fact',
      primary: { label: 'n!', action: () => append('!'), desc: 'Factorial: n!' },
      second: { label: 'fact(n)', action: () => append('fact('), desc: 'Factorial Function' },
      category: 'prob'
    },
    { 
      id: 'npr',
      primary: { label: 'nPr', action: () => append('nPr('), desc: 'Permutations: nPr(n, r)' },
      second: { label: 'nCr', action: () => append('nCr('), desc: 'Combinations: nCr(n, r)' },
      category: 'prob'
    },
    { 
      id: 'mod',
      primary: { label: 'mod', action: () => append('mod('), desc: 'Modulo: mod(a, b)' },
      second: { label: 'round', action: () => append('round('), desc: 'Round: round(x, decimals)' },
      category: 'prob'
    },
    { 
      id: 'floor_ceil',
      primary: { label: 'floor', action: () => append('floor('), desc: 'Floor integer' },
      second: { label: 'ceil', action: () => append('ceil('), desc: 'Ceiling integer' },
      category: 'prob'
    },
    { 
      id: 'rand',
      primary: { label: 'rand', action: () => append('rand()'), desc: 'Random [0, 1)' },
      second: { label: 'EE', action: () => append('EE'), desc: 'Scientific Notation *10^' },
      category: 'prob'
    },

    // Scientific & Physical Constants
    { 
      id: 'pi',
      primary: { label: 'π', action: () => append('π'), desc: 'Pi (3.14159265...)' },
      second: { label: '2π', action: () => append('tau'), desc: 'Tau: 2*pi' },
      category: 'const'
    },
    { 
      id: 'e',
      primary: { label: 'e', action: () => append('e'), desc: "Euler's number (2.71828...)" },
      second: { label: 'ϕ', action: () => append('phi'), desc: 'Golden ratio (1.61803...)' },
      category: 'const'
    },
    { 
      id: 'c',
      primary: { label: 'c', action: () => append('c'), desc: 'Speed of Light (2.99792458e8 m/s)' },
      second: { label: 'g', action: () => append('g'), desc: 'Standard Gravity (9.80665 m/s²)' },
      category: 'const'
    },
    { 
      id: 'h',
      primary: { label: 'h', action: () => append('h'), desc: "Planck's Constant (6.62607015e-34 J·s)" },
      second: { label: 'ℏ', action: () => append('ℏ'), desc: 'Reduced Planck Constant (h / 2π)' },
      category: 'const'
    },
    { 
      id: 'G',
      primary: { label: 'G', action: () => append('G'), desc: 'Gravitational Constant (6.6743e-11)' },
      second: { label: 'N_A', action: () => append('N_A'), desc: "Avogadro's Number (6.02214e23)" },
      category: 'const'
    },
    { 
      id: 'kB',
      primary: { label: 'k_B', action: () => append('k_B'), desc: 'Boltzmann Constant (1.3806e-23 J/K)' },
      second: { label: 'R', action: () => append('R'), desc: 'Molar Gas Constant (8.314 J/mol·K)' },
      category: 'const'
    },
    { 
      id: 'qe',
      primary: { label: 'q_e', action: () => append('q_e'), desc: 'Elementary Charge (1.60218e-19 C)' },
      second: { label: 'ε₀', action: () => append('ε₀'), desc: 'Vacuum Permittivity (8.85419e-12 F/m)' },
      category: 'const'
    },
    { 
      id: 'me',
      primary: { label: 'm_e', action: () => append('m_e'), desc: 'Electron Mass (9.10938e-31 kg)' },
      second: { label: 'm_p', action: () => append('m_p'), desc: 'Proton Mass (1.67262e-27 kg)' },
      category: 'const'
    },
    { 
      id: 'comma',
      primary: { label: ',', action: () => append(', '), desc: 'Argument separator' },
      second: { label: 'Ans', action: () => append('Ans'), desc: 'Previous Answer' },
      category: 'all'
    },
    { 
      id: 'sd_switch',
      primary: { label: 'S ⇄ D', action: cycleNotationMode, desc: 'Switch Answer between Full Digits & Standard Scientific Notation' },
      second: { label: 'ENG/Frac', action: () => handleNotationModeChange(notationMode === 'eng' ? 'fraction' : 'eng'), desc: 'Toggle Engineering or Fraction Notation' },
      category: 'all'
    },
  ];

  const [showGuide, setShowGuide] = useState(false);

  const filteredScientificOps = scientificOperations.filter(op => {
    if (activeCategory === 'all') return true;
    return op.category === activeCategory || op.category === 'all';
  });

  const filteredConstantsList = SCIENTIFIC_CONSTANTS.filter(c => {
    const matchesCategory = selectedConstantCat === 'all' || c.category === selectedConstantCat;
    if (!matchesCategory) return false;
    if (!constantsSearch.trim()) return true;
    const query = constantsSearch.toLowerCase();
    return (
      c.name.toLowerCase().includes(query) ||
      c.displaySymbol.toLowerCase().includes(query) ||
      c.symbol.toLowerCase().includes(query) ||
      c.description.toLowerCase().includes(query) ||
      c.unit.toLowerCase().includes(query)
    );
  });

  const handleCopyConstantValue = (c: ScientificConstant, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(c.valueStr);
    setCopiedConstantId(c.id);
    setTimeout(() => setCopiedConstantId(null), 1500);
  };

  const handleInsertConstant = (constant: ScientificConstant, insertType: 'symbol' | 'value') => {
    if (insertType === 'symbol') {
      append(constant.displaySymbol);
    } else {
      append(constant.valueStr);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto space-y-2.5 sm:space-y-3">
      {/* Primary Display & Result Card (Condensed & Integrated) */}
      <div className="bg-slate-950 rounded-2xl shadow-lg overflow-hidden border border-slate-800">
        {/* Header toolbar within display (DEG/RAD, History toggle, Notation Toggle, Copy, Guide) */}
        <div className="px-3.5 py-2 bg-slate-900/90 border-b border-slate-800/80 flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            {mode === 'scientific' ? (
              <div className="flex items-center bg-slate-800 p-0.5 rounded-md border border-slate-700/60">
                <button
                  type="button"
                  onClick={() => handleAngleModeChange('deg')}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider transition-all ${
                    angleMode === 'deg'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  DEG
                </button>
                <button
                  type="button"
                  onClick={() => handleAngleModeChange('rad')}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider transition-all ${
                    angleMode === 'rad'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  RAD
                </button>
              </div>
            ) : (
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Standard
              </span>
            )}

            {/* S ⇄ D Answer Notation Switcher Pill in Top Bar */}
            {mode === 'scientific' && answerNotations.isNumeric && (
              <button
                type="button"
                onClick={cycleNotationMode}
                title="Click to toggle answer notation (Full Digits ⇄ Standard Scientific 10ⁿ ⇄ Eng ⇄ Frac)"
                className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-950/90 hover:bg-blue-900/90 text-blue-300 border border-blue-700/60 text-[10px] font-bold transition-all shadow-2xs active:scale-95"
              >
                <ArrowRightLeft size={11} className="text-blue-400" />
                <span>S ⇄ D</span>
                <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-blue-800/80 text-white">
                  {notationMode === 'full' ? 'Full Digits' : notationMode === 'sci' ? 'Sci (10ⁿ)' : notationMode === 'eng' ? 'Eng (10³ⁿ)' : 'Fraction'}
                </span>
              </button>
            )}

            <span className="text-[10px] font-mono font-medium text-slate-400 px-1.5 py-0.5 rounded bg-slate-800/60">
              Ans = {lastAns}
            </span>
          </div>

          <div className="flex items-center gap-1.5 ml-auto">
            {mode === 'scientific' && (
              <button
                type="button"
                onClick={() => setShowGuide(true)}
                title="View Syntax Guide"
                className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium text-slate-400 hover:text-blue-300 hover:bg-slate-800 transition-colors"
              >
                <Info size={13} />
                <span className="hidden sm:inline">Guide</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              title="Open Calculation History"
              className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium text-slate-400 hover:text-blue-300 hover:bg-slate-800 transition-colors"
            >
              <HistoryIcon size={13} />
              <span className="hidden sm:inline">History</span>
            </button>

            <button
              type="button"
              onClick={copyResult}
              title="Copy calculation or formatted result"
              className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Main Display Area */}
        <div className="px-4 py-3 sm:py-3.5 text-right space-y-1.5 bg-gradient-to-b from-slate-950 to-slate-900">
          <div className="flex items-center justify-between text-[9px] font-bold text-slate-500 uppercase tracking-widest">
            <span>Expression</span>
            {mode === 'scientific' && (
              <span className="text-blue-400/80 lowercase font-mono">
                {angleMode} {isSecond ? '• 2nd shift active' : ''}
              </span>
            )}
          </div>
          
          <div className="text-sm sm:text-base font-mono text-blue-300 min-h-[1.4rem] break-all tracking-tight selection:bg-blue-900">
            {display || <span className="text-slate-600">0</span>}
          </div>

          <div className="pt-2 border-t border-slate-800/60 space-y-1">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Result</span>
                
                {/* Segmented Notation Mode Pills in Result Area */}
                {mode === 'scientific' && answerNotations.isNumeric && (
                  <div className="flex items-center gap-0.5 bg-slate-900 border border-slate-800 p-0.5 rounded-md">
                    <button
                      type="button"
                      onClick={() => handleNotationModeChange('full')}
                      className={`px-1.5 py-0.5 rounded text-[9px] font-mono transition-all ${
                        notationMode === 'full'
                          ? 'bg-blue-600 text-white font-bold shadow-xs'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                      title="Show full value digits without scientific exponent"
                    >
                      Full Digits
                    </button>
                    <button
                      type="button"
                      onClick={() => handleNotationModeChange('sci')}
                      className={`px-1.5 py-0.5 rounded text-[9px] font-mono transition-all ${
                        notationMode === 'sci'
                          ? 'bg-blue-600 text-white font-bold shadow-xs'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                      title="Show standard scientific notation (a × 10ⁿ)"
                    >
                      Sci (10ⁿ)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleNotationModeChange('eng')}
                      className={`px-1.5 py-0.5 rounded text-[9px] font-mono transition-all ${
                        notationMode === 'eng'
                          ? 'bg-blue-600 text-white font-bold shadow-xs'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                      title="Show engineering notation (a × 10³ⁿ)"
                    >
                      Eng
                    </button>
                    {answerNotations.fraction && (
                      <button
                        type="button"
                        onClick={() => handleNotationModeChange('fraction')}
                        className={`px-1.5 py-0.5 rounded text-[9px] font-mono transition-all ${
                          notationMode === 'fraction'
                            ? 'bg-blue-600 text-white font-bold shadow-xs'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                        title="Show simplified fraction (p/q)"
                      >
                        Fraction
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* S ⇄ D Action Button */}
              {mode === 'scientific' && answerNotations.isNumeric && (
                <button
                  type="button"
                  onClick={cycleNotationMode}
                  className="text-[10px] text-blue-400 hover:text-blue-300 font-mono font-medium flex items-center gap-1 transition-colors px-1.5 py-0.5 rounded hover:bg-slate-800/80"
                  title="Switch between Full Value Digits and Standard Scientific Form"
                >
                  <ArrowRightLeft size={11} />
                  <span>Switch (S ⇄ D)</span>
                </button>
              )}
            </div>

            {/* Main Result Display */}
            <div className="text-2xl sm:text-3xl font-mono font-bold text-white break-all drop-shadow-xs selection:bg-blue-800">
              {displayedResult !== null ? displayedResult : (display ? '—' : '0')}
            </div>

            {/* Alternate format quick subtitle */}
            {mode === 'scientific' && answerNotations.isNumeric && result !== null && (
              <div className="flex items-center justify-end gap-2 text-[10px] sm:text-[11px] font-mono text-slate-400 pt-0.5">
                {notationMode === 'sci' && (
                  <span className="text-slate-400 truncate">
                    = <span className="text-slate-200 font-semibold">{answerNotations.fullDigits}</span> <span className="text-slate-500">(Full Digits)</span>
                  </span>
                )}
                {notationMode === 'full' && (
                  <span className="text-slate-400 truncate">
                    = <span className="text-blue-300 font-semibold">{answerNotations.scientific}</span> <span className="text-slate-500">(Standard Notation)</span>
                  </span>
                )}
                {notationMode === 'eng' && (
                  <span className="text-slate-400 truncate">
                    = <span className="text-blue-300 font-semibold">{answerNotations.scientific}</span> <span className="text-slate-500">(Sci)</span> • <span className="text-slate-200">{answerNotations.fullDigits}</span> <span className="text-slate-500">(Full)</span>
                  </span>
                )}
                {notationMode === 'fraction' && (
                  <span className="text-slate-400 truncate">
                    = <span className="text-slate-200 font-semibold">{answerNotations.fullDigits}</span> <span className="text-slate-500">(Decimal)</span>
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Calculator Keypad Body */}
      {mode === 'scientific' ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-2.5 sm:p-3.5 shadow-sm space-y-2.5">
          {/* Top Control Bar: 2nd Shift, Angle Toggle, Category Pills & Quick Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-1.5 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-1 flex-wrap">
              <button
                type="button"
                onClick={() => setIsSecond(!isSecond)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 border ${
                  isSecond 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs' 
                    : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                }`}
              >
                <Sparkles size={12} />
                <span>2nd</span>
              </button>

              <div className="flex items-center gap-0.5 bg-slate-100 p-0.5 rounded-lg">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'trig', label: 'Trig' },
                  { id: 'algebra', label: 'Algebra' },
                  { id: 'prob', label: 'Prob' },
                  { id: 'const', label: 'Const' },
                ].map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategory(cat.id as any)}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                      activeCategory === cat.id
                        ? 'bg-white text-blue-700 shadow-xs font-bold'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Quick Constants Library Dialog Trigger */}
              <button
                type="button"
                onClick={() => setShowConstantsModal(true)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100/90 text-amber-900 border border-amber-200/90 text-xs font-bold transition-all shadow-2xs active:scale-95"
                title="Open Scientific Constants Library (π, e, h, c, G...)"
              >
                <Atom size={13} className="text-amber-600" />
                <span>Constants</span>
                <span className="text-[10px] font-mono text-amber-700/90 bg-amber-100 px-1 py-0.2 rounded hidden sm:inline">
                  π, e, h, c...
                </span>
              </button>
            </div>

            <div className="flex items-center gap-1 ml-auto">
              <button 
                type="button"
                onClick={backspace}
                title="Backspace"
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-200 text-xs font-semibold"
              >
                <Delete size={14} />
                <span className="hidden sm:inline">Del</span>
              </button>
              <button 
                type="button"
                onClick={clear}
                title="Clear All"
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors border border-red-100 text-xs font-semibold"
              >
                <RotateCcw size={14} />
                <span>AC</span>
              </button>
            </div>
          </div>

          {/* Keypad Grid: Split Scientific + Numeric */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5">
            {/* Scientific Functions Area */}
            <div className="md:col-span-6 grid grid-cols-4 sm:grid-cols-4 gap-1.5 content-start">
              {filteredScientificOps.map((op) => {
                const current = isSecond ? op.second : op.primary;
                const getCategoryStyle = () => {
                  if (isSecond) {
                    return 'bg-amber-50/80 border-amber-200 text-amber-900 hover:bg-amber-100 hover:border-amber-300';
                  }
                  if (op.category === 'trig') {
                    return 'bg-sky-50/70 border-sky-200/80 text-sky-900 hover:bg-sky-100 hover:border-sky-300';
                  }
                  if (op.category === 'algebra') {
                    return 'bg-indigo-50/60 border-indigo-200/70 text-indigo-900 hover:bg-indigo-100 hover:border-indigo-300';
                  }
                  if (op.category === 'prob') {
                    return 'bg-emerald-50/60 border-emerald-200/70 text-emerald-900 hover:bg-emerald-100 hover:border-emerald-300';
                  }
                  if (op.category === 'const') {
                    return 'bg-amber-50/70 border-amber-200/80 text-amber-950 hover:bg-amber-100 hover:border-amber-300 font-semibold';
                  }
                  return 'bg-slate-50/90 border-slate-200/90 text-slate-800 hover:bg-slate-100 hover:border-slate-300';
                };

                return (
                  <button
                    key={op.id}
                    type="button"
                    onClick={current.action}
                    title={current.desc}
                    className={`py-2 px-1 text-xs font-bold rounded-lg border transition-all active:scale-95 flex flex-col items-center justify-center min-h-[38px] shadow-2xs ${getCategoryStyle()}`}
                  >
                    <span className="truncate max-w-full px-0.5">{current.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Standard Numeric & Operator Area */}
            <div className="md:col-span-6 grid grid-cols-4 gap-1.5 content-start">
              {standardButtons.map((btn, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={btn.action}
                  className={`py-2 px-1 rounded-lg font-bold text-sm sm:text-base transition-all active:scale-95 flex items-center justify-center min-h-[38px] ${
                    btn.span2 ? 'col-span-2' : ''
                  } ${
                    btn.type === 'num'
                      ? 'bg-white border border-slate-200 text-slate-900 hover:bg-slate-50 shadow-2xs'
                      : btn.type === 'op'
                      ? 'bg-slate-100/90 border border-slate-200 text-slate-800 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200'
                      : btn.type === 'accent'
                      ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-500/25 border border-blue-700'
                      : 'bg-rose-50 border border-rose-200/80 text-rose-600 hover:bg-rose-100/80'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Standard Mode Keypad (Clean & Compact) */
        <div className="bg-white rounded-2xl border border-slate-200 p-3 sm:p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Keypad</span>
            <div className="flex items-center gap-1.5">
              <button 
                type="button"
                onClick={backspace}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-200 text-xs font-semibold"
              >
                <Delete size={14} />
                <span>Backspace</span>
              </button>
              <button 
                type="button"
                onClick={clear}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors border border-rose-200/80 text-xs font-semibold"
              >
                <RotateCcw size={14} />
                <span>Clear</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {standardButtons.map((btn, i) => (
              <button
                key={i}
                type="button"
                onClick={btn.action}
                className={`py-3 sm:py-3.5 rounded-xl font-bold text-base sm:text-lg transition-all active:scale-95 flex items-center justify-center ${
                  btn.span2 ? 'col-span-2' : ''
                } ${
                  btn.type === 'num'
                    ? 'bg-white border border-slate-200 text-slate-900 hover:bg-slate-50 shadow-2xs'
                    : btn.type === 'op'
                    ? 'bg-slate-100/90 border border-slate-200 text-slate-800 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200'
                    : btn.type === 'accent'
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-500/25 border border-blue-700'
                    : 'bg-rose-50 border border-rose-200/80 text-rose-600 hover:bg-rose-100'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Scientific & Physical Constants Library Modal */}
      {showConstantsModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/90">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-100 text-amber-800 rounded-xl">
                  <Atom size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Scientific & Physical Constants</h3>
                  <p className="text-[11px] text-slate-500">
                    Insert symbols ($h, c, \pi, e, G$) or exact high-precision numeric values
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowConstantsModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Search & Category Tabs */}
            <div className="p-4 border-b border-slate-100 space-y-2.5 bg-slate-50/40">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search constants (e.g. Planck, light, pi, gravity, Boltzmann, electron)..."
                  value={constantsSearch}
                  onChange={(e) => setConstantsSearch(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-2xs"
                />
                {constantsSearch && (
                  <button
                    type="button"
                    onClick={() => setConstantsSearch('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs">
                {[
                  { id: 'all', label: 'All Constants' },
                  { id: 'universal', label: 'Universal & Quantum' },
                  { id: 'physics', label: 'Physics & Gravity' },
                  { id: 'chemistry', label: 'Chemistry & Molar' },
                  { id: 'math', label: 'Mathematics' },
                ].map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedConstantCat(cat.id as any)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition-all ${
                      selectedConstantCat === cat.id
                        ? 'bg-amber-600 text-white font-bold shadow-xs'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Constants Grid */}
            <div className="p-4 overflow-y-auto max-h-[50vh] space-y-2">
              {filteredConstantsList.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">
                  No scientific constants found matching "{constantsSearch}".
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {filteredConstantsList.map((c) => {
                    const isCopied = copiedConstantId === c.id;
                    return (
                      <div
                        key={c.id}
                        className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col justify-between hover:border-amber-300 hover:shadow-xs transition-all space-y-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center font-mono font-bold text-amber-900 text-sm shrink-0">
                              {c.displaySymbol}
                            </div>
                            <div>
                              <h4 className="text-xs font-bold text-slate-900 leading-tight">{c.name}</h4>
                              <p className="text-[10px] text-slate-500 truncate max-w-[180px]">{c.description}</p>
                            </div>
                          </div>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-1.5 py-0.5 bg-slate-50 border border-slate-100 rounded">
                            {c.category}
                          </span>
                        </div>

                        <div className="bg-slate-50/80 border border-slate-100 rounded-lg p-2 flex items-center justify-between font-mono text-xs">
                          <div className="truncate">
                            <span className="font-bold text-slate-800">{c.formattedValue}</span>
                            {c.unit !== 'dimensionless' && (
                              <span className="text-[10px] text-slate-500 ml-1 font-sans">{c.unit}</span>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={(e) => handleCopyConstantValue(c, e)}
                            title="Copy exact numeric value"
                            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded transition-colors ml-1 shrink-0"
                          >
                            {isCopied ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-1.5 pt-1">
                          <button
                            type="button"
                            onClick={() => {
                              handleInsertConstant(c, 'symbol');
                              setShowConstantsModal(false);
                            }}
                            className="py-1.5 px-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/80 rounded-lg text-[11px] font-bold transition-colors flex items-center justify-center gap-1"
                          >
                            <span>Insert {c.displaySymbol}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              handleInsertConstant(c, 'value');
                              setShowConstantsModal(false);
                            }}
                            className="py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 rounded-lg text-[11px] font-semibold transition-colors flex items-center justify-center gap-1"
                          >
                            <span>Insert Value</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quick Physics & Mathematical Formula Presets */}
            <div className="p-3 bg-slate-50 border-t border-slate-100 space-y-1.5">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <Zap size={12} className="text-amber-600" />
                <span>Common Formula Templates (Click to insert):</span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {[
                  { label: 'Photon Energy: E = h * f', expr: 'h * ' },
                  { label: 'Mass-Energy: E = m * c²', expr: ' * c^2' },
                  { label: 'Gravity: G * m1 * m2 / r²', expr: 'G * ' },
                  { label: 'Ideal Gas: n * R * T', expr: 'R * ' },
                  { label: 'de Broglie: λ = h / p', expr: 'h / ' },
                  { label: 'Circle Area: π * r²', expr: 'π * ' }
                ].map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      append(item.expr);
                      setShowConstantsModal(false);
                    }}
                    className="px-2 py-1 bg-white hover:bg-amber-50 text-slate-700 hover:text-amber-900 border border-slate-200/80 hover:border-amber-200 rounded-md text-[10px] font-mono transition-all"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 bg-slate-50/90 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-500">
                You can also type constants directly like <code className="bg-white px-1 py-0.5 border rounded font-mono text-slate-800">2c</code>, <code className="bg-white px-1 py-0.5 border rounded font-mono text-slate-800">h * 5e14</code>, or <code className="bg-white px-1 py-0.5 border rounded font-mono text-slate-800">2π</code>.
              </span>
              <button
                type="button"
                onClick={() => setShowConstantsModal(false)}
                className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors shrink-0 ml-2"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Syntax Guide Modal (Does NOT take vertical page space) */}
      {showGuide && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <Info size={18} className="text-blue-600" />
                <span>Scientific Functions & Constants Guide</span>
              </div>
              <button
                type="button"
                onClick={() => setShowGuide(false)}
                className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 text-xs text-slate-600">
              <div className="bg-blue-50 border border-blue-200/80 rounded-xl p-3">
                <p className="font-bold text-blue-950 mb-1 flex items-center gap-1.5 text-xs">
                  <ArrowRightLeft size={14} className="text-blue-600" />
                  <span>Answer Notation Switcher (S ⇄ D)</span>
                </p>
                <p className="text-[11px] text-blue-900/90 leading-relaxed mb-2">
                  Switch the calculated answer between <strong>Full Value Decimal Digits</strong>, <strong>Standard Scientific Notation (a × 10ⁿ)</strong>, <strong>Engineering Form (a × 10³ⁿ)</strong>, and <strong>Fractions</strong> using the <code className="bg-white px-1 py-0.5 rounded border border-blue-200 font-mono font-bold text-blue-800">S ⇄ D</code> key or the quick pills next to the result.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 font-mono text-[10px] bg-white p-2 rounded-lg border border-blue-100 text-slate-700">
                  <div>• <strong>Full Digits:</strong> 299792458</div>
                  <div>• <strong>Standard Sci:</strong> 2.99792458 × 10⁸</div>
                  <div>• <strong>Small Num:</strong> 0.000125 ⇄ 1.25 × 10⁻⁴</div>
                  <div>• <strong>Fractions:</strong> 0.75 ⇄ 3/4</div>
                </div>
              </div>

              <div>
                <p className="font-semibold text-slate-800 mb-1 flex items-center gap-1">
                  <Atom size={14} className="text-amber-600" />
                  <span>Scientific & Physical Constants</span>
                </p>
                <div className="space-y-1 font-mono text-[11px] bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <div>π ≈ 3.14159265 (Pi)</div>
                  <div>e ≈ 2.71828182 (Euler's number)</div>
                  <div>c = 299792458 m/s (Speed of light)</div>
                  <div>h = 6.62607015e-34 J·s (Planck's constant)</div>
                  <div>G = 6.67430e-11 N·m²/kg² (Gravitational constant)</div>
                  <div>N_A = 6.02214076e23 mol⁻¹ (Avogadro's number)</div>
                  <div>k_B = 1.380649e-23 J/K (Boltzmann constant)</div>
                </div>
              </div>

              <div>
                <p className="font-semibold text-slate-800 mb-1">Trigonometry & Angles</p>
                <div className="space-y-1 font-mono text-[11px] bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <div>sin(90) = 1 (in DEG)</div>
                  <div>sin(pi / 2) = 1 (in RAD)</div>
                  <div>asin(1) = 90° or π/2</div>
                </div>
              </div>

              <div>
                <p className="font-semibold text-slate-800 mb-1">Powers & Roots</p>
                <div className="space-y-1 font-mono text-[11px] bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <div>2^4 = 16</div>
                  <div>sqrt(144) = 12</div>
                  <div>nthRoot(32, 5) = 2</div>
                </div>
              </div>

              <div>
                <p className="font-semibold text-slate-800 mb-1">Logarithms & Exponentials</p>
                <div className="space-y-1 font-mono text-[11px] bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <div>log(100) = 2 (base 10)</div>
                  <div>ln(e) = 1 (natural log)</div>
                  <div>exp(2) = e² ≈ 7.389</div>
                </div>
              </div>

              <div>
                <p className="font-semibold text-slate-800 mb-1">Combinatorics & Probability</p>
                <div className="space-y-1 font-mono text-[11px] bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <div>5! = 120 (Factorial)</div>
                  <div>nPr(5, 2) = 20 (Permutations)</div>
                  <div>nCr(5, 2) = 10 (Combinations)</div>
                  <div>mod(17, 5) = 2 (Remainder)</div>
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-100 text-right">
              <button
                type="button"
                onClick={() => setShowGuide(false)}
                className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
