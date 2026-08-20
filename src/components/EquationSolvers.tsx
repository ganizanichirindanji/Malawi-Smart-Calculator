import React, { useState, useMemo, useEffect } from 'react';
import { solveQuadratic, solveCubic } from '../utils/mathUtils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calculator, Trash2, History as HistoryIcon, BookmarkPlus } from 'lucide-react';
import { useHistory } from '../context/HistoryContext';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Props {
  type: 'quadratic' | 'cubic' | 'linear';
}

export default function EquationSolvers({ type }: Props) {
  const { addHistoryEntry, recalledItem, setIsDrawerOpen } = useHistory();
  const [linearMode, setLinearMode] = useState<'slope-intercept' | 'two-points'>('slope-intercept');
  const [inputs, setInputs] = useState<Record<string, string>>({
    a: '1', b: '0', c: '0', d: '0', m: '1', x1: '0', y1: '0', x2: '1', y2: '1'
  });

  // Handle global history recall
  useEffect(() => {
    if (recalledItem && recalledItem.module === type) {
      if (recalledItem.recallState?.inputs) {
        setInputs(prev => ({ ...prev, ...recalledItem.recallState!.inputs }));
      }
      if (recalledItem.recallState?.linearMode) {
        setLinearMode(recalledItem.recallState.linearMode);
      }
    }
  }, [recalledItem, type]);

  const handleInputChange = (key: string, value: string) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  const results = useMemo(() => {
    const a = parseFloat(inputs.a) || 0;
    const b = parseFloat(inputs.b) || 0;
    const c = parseFloat(inputs.c) || 0;
    const d = parseFloat(inputs.d) || 0;
    
    let m = parseFloat(inputs.m) || 0;
    let finalC = c;

    if (type === 'linear') {
      if (linearMode === 'two-points') {
        const x1 = parseFloat(inputs.x1) || 0;
        const y1 = parseFloat(inputs.y1) || 0;
        const x2 = parseFloat(inputs.x2) || 0;
        const y2 = parseFloat(inputs.y2) || 0;

        if (x2 - x1 !== 0) {
          m = (y2 - y1) / (x2 - x1);
          finalC = y1 - m * x1;
        } else {
          return {
            equation: `x = ${x1}`,
            xIntercept: x1.toFixed(4),
            yIntercept: 'None',
            isVertical: true,
            m: Infinity,
            c: NaN
          };
        }
      }

      const xIntercept = m !== 0 ? -finalC / m : null;
      return {
        equation: `y = ${m.toFixed(4)}x ${finalC >= 0 ? '+' : '-'} ${Math.abs(finalC).toFixed(4)}`,
        xIntercept: xIntercept !== null ? xIntercept.toFixed(4) : 'None',
        yIntercept: finalC.toFixed(4),
        m,
        c: finalC
      };
    }

    if (type === 'quadratic') return solveQuadratic(a, b, c);
    if (type === 'cubic') return solveCubic(a, b, c, d);
    
    return null;
  }, [inputs, type, linearMode]);

  const graphData = useMemo(() => {
    if (!results) return [];
    
    if (type === 'linear') {
      const res = results as any;
      if (res.isVertical) {
        return Array.from({ length: 21 }, (_, i) => ({ x: parseFloat(res.xIntercept), y: i - 10 }));
      }
      const m = res.m;
      const c = res.c;
      return Array.from({ length: 21 }, (_, i) => {
        const x = i - 10;
        return { x, y: m * x + c };
      });
    }

    if (type === 'quadratic') {
      const res = results as any;
      const { a, b, c } = res;
      if (a === 0) return [];
      
      const vertexX = -b / (2 * a);
      const discriminant = b * b - 4 * a * c;
      
      let xMin, xMax;
      if (discriminant > 0) {
        const r1 = (-b + Math.sqrt(discriminant)) / (2 * a);
        const r2 = (-b - Math.sqrt(discriminant)) / (2 * a);
        xMin = Math.min(r1, r2, vertexX);
        xMax = Math.max(r1, r2, vertexX);
      } else {
        xMin = vertexX - 5;
        xMax = vertexX + 5;
      }
      
      const range = xMax - xMin;
      const padding = Math.max(2, range * 0.5);
      const startX = xMin - padding;
      const endX = xMax + padding;
      const step = (endX - startX) / 50;

      return Array.from({ length: 51 }, (_, i) => {
        const x = startX + i * step;
        return { 
          x: parseFloat(x.toFixed(2)), 
          y: parseFloat((a * x * x + b * x + c).toFixed(4)) 
        };
      });
    }

    return [];
  }, [results, type]);

  const renderInputs = () => {
    if (type === 'quadratic') {
      return (
        <div className="grid grid-cols-3 gap-4">
          {['a', 'b', 'c'].map(k => (
            <div key={k}>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{k}</label>
              <input
                type="number"
                value={inputs[k]}
                onChange={(e) => handleInputChange(k, e.target.value)}
                className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
              />
            </div>
          ))}
        </div>
      );
    }
    if (type === 'cubic') {
      return (
        <div className="grid grid-cols-4 gap-4">
          {['a', 'b', 'c', 'd'].map(k => (
            <div key={k}>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{k}</label>
              <input
                type="number"
                value={inputs[k]}
                onChange={(e) => handleInputChange(k, e.target.value)}
                className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
              />
            </div>
          ))}
        </div>
      );
    }
    if (type === 'linear') {
      return (
        <div className="space-y-4">
          <div className="flex gap-2 p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => setLinearMode('slope-intercept')}
              className={cn(
                "flex-1 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-md transition-all",
                linearMode === 'slope-intercept' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              Slope-Intercept
            </button>
            <button
              onClick={() => setLinearMode('two-points')}
              className={cn(
                "flex-1 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-md transition-all",
                linearMode === 'two-points' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              Two Points
            </button>
          </div>

          {linearMode === 'slope-intercept' ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Gradient (m)</label>
                <input
                  type="number"
                  value={inputs.m}
                  onChange={(e) => handleInputChange('m', e.target.value)}
                  className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">y-intercept (c)</label>
                <input
                  type="number"
                  value={inputs.c}
                  onChange={(e) => handleInputChange('c', e.target.value)}
                  className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">x₁</label>
                  <input
                    type="number"
                    value={inputs.x1}
                    onChange={(e) => handleInputChange('x1', e.target.value)}
                    className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">y₁</label>
                  <input
                    type="number"
                    value={inputs.y1}
                    onChange={(e) => handleInputChange('y1', e.target.value)}
                    className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">x₂</label>
                  <input
                    type="number"
                    value={inputs.x2}
                    onChange={(e) => handleInputChange('x2', e.target.value)}
                    className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">y₂</label>
                  <input
                    type="number"
                    value={inputs.y2}
                    onChange={(e) => handleInputChange('y2', e.target.value)}
                    className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }
  };

  const handleSaveToHistory = () => {
    if (!results) return;
    
    if (type === 'quadratic') {
      const qRes = results as ReturnType<typeof solveQuadratic>;
      if (!qRes) return;
      const a = inputs.a || '1', b = inputs.b || '0', c = inputs.c || '0';
      const expr = `${a !== '1' ? a : ''}x² ${parseFloat(b) >= 0 ? `+ ${b}x` : `- ${Math.abs(parseFloat(b))}x`} ${parseFloat(c) >= 0 ? `+ ${c}` : `- ${Math.abs(parseFloat(c))}`} = 0`;
      addHistoryEntry({
        module: 'quadratic',
        title: 'Quadratic Solver',
        expression: expr,
        result: `Roots: ${qRes.roots.join(', ')}`,
        details: `Vertex: ${qRes.turningPoint}, y-int: ${qRes.yIntercept}`,
        recallState: { inputs }
      });
    } else if (type === 'cubic') {
      const cRes = results as ReturnType<typeof solveCubic>;
      if (!cRes) return;
      const a = inputs.a || '1', b = inputs.b || '0', c = inputs.c || '0', d = inputs.d || '0';
      const expr = `${a}x³ + ${b}x² + ${c}x + ${d} = 0`;
      addHistoryEntry({
        module: 'cubic',
        title: 'Cubic Solver',
        expression: expr,
        result: `Turning Points: ${cRes.turningPoints.join(' & ')}`,
        details: `y-intercept: ${cRes.yIntercept}`,
        recallState: { inputs }
      });
    } else if (type === 'linear') {
      const lRes = results as any;
      addHistoryEntry({
        module: 'linear',
        title: 'Linear Solver',
        expression: linearMode === 'two-points' ? `Line via (${inputs.x1},${inputs.y1}) & (${inputs.x2},${inputs.y2})` : `m=${inputs.m}, c=${inputs.c}`,
        result: lRes.equation,
        details: `Gradient: ${lRes.isVertical ? 'Undefined' : lRes.m?.toFixed(2)}, x-int: ${lRes.xIntercept}, y-int: ${lRes.yIntercept}`,
        recallState: { inputs, linearMode }
      });
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 items-start">
      {/* Left Column: Equation Inputs & Action Controls */}
      <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-3.5 sm:p-4 shadow-sm flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-800 font-mono">
              {type === 'quadratic' ? 'ax² + bx + c = 0' : type === 'cubic' ? 'ax³ + bx² + cx + d = 0' : 'y = mx + c'}
            </h3>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setIsDrawerOpen(true)}
                className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded-md transition-colors"
              >
                <HistoryIcon size={12} />
                <span>History</span>
              </button>
              <button 
                onClick={() => setInputs({ a: '1', b: '0', c: '0', d: '0', m: '1', x1: '0', y1: '0', x2: '1', y2: '1' })}
                title="Reset inputs"
                className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>

          <div className="pt-2">
            {renderInputs()}
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={handleSaveToHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-all shadow-xs active:scale-95"
          >
            <BookmarkPlus size={13} />
            <span>Save to History</span>
          </button>
        </div>
      </div>

      {/* Right Column: Solution Analysis & Graph Visualization */}
      {results && (
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col space-y-3 p-3.5 sm:p-4">
          {/* Solutions / Roots / Intercepts Summary */}
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Solution Analysis</h3>
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full capitalize">
                {type}
              </span>
            </div>

            <div className="pt-2.5">
              {type === 'quadratic' && (
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Roots:</span>
                    {(results as any).roots.map((r: string, i: number) => (
                      <div key={i} className="px-2.5 py-0.5 bg-blue-50 border border-blue-200 text-blue-700 rounded-md font-mono text-xs font-bold shadow-2xs">
                        x = {r}
                      </div>
                    ))}
                    {(results as any).nature && (
                      <span className="text-[10px] font-medium text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md ml-auto">
                        {(results as any).nature}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-100">
                    <div className="bg-slate-50/80 p-2 rounded-lg border border-slate-200/80">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">y-intercept</p>
                      <p className="font-mono text-xs font-bold text-slate-900">{(results as any).yIntercept}</p>
                    </div>
                    <div className="bg-emerald-50/60 p-2 rounded-lg border border-emerald-200/80">
                      <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider">Turning Point</p>
                      <p className="font-mono text-xs font-bold text-emerald-950">{(results as any).turningPoint}</p>
                    </div>
                    <div className="bg-indigo-50/60 p-2 rounded-lg border border-indigo-200/80">
                      <p className="text-[9px] font-bold text-indigo-600 uppercase tracking-wider">Symmetry Axis</p>
                      <p className="font-mono text-xs font-bold text-indigo-950">{(results as any).axisOfSymmetry}</p>
                    </div>
                  </div>
                </div>
              )}

              {type === 'cubic' && (
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Roots:</span>
                    {(results as any).roots?.map((r: string, i: number) => (
                      <span key={i} className="px-2.5 py-0.5 bg-blue-50 border border-blue-200 text-blue-700 rounded-md font-mono text-xs font-bold shadow-2xs">
                        x = {r}
                      </span>
                    ))}
                    {(results as any).nature && (
                      <span className="text-[10px] font-medium text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md ml-auto">
                        {(results as any).nature}
                      </span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 border-t border-slate-100">
                    <div className="bg-emerald-50/60 p-2 rounded-lg border border-emerald-200/80 sm:col-span-2">
                      <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider block">Turning Points</span>
                      <span className="font-mono text-xs font-bold text-emerald-950">{(results as any).turningPoints?.join(' & ')}</span>
                    </div>
                    <div className="bg-slate-50/80 p-2 rounded-lg border border-slate-200/80">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">y-intercept</span>
                      <span className="font-mono text-xs font-bold text-slate-900">{(results as any).yIntercept}</span>
                    </div>
                  </div>
                </div>
              )}

              {type === 'linear' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between bg-blue-50/60 p-2 rounded-xl border border-blue-100">
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Equation:</span>
                    <span className="font-mono text-sm font-bold text-blue-900">{(results as any).equation}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-100">
                    <div className="bg-slate-50/80 p-2 rounded-lg border border-slate-200/80">
                      <p className="text-[9px] font-bold text-slate-400 uppercase">Gradient (m)</p>
                      <p className="font-mono text-xs font-bold text-slate-900">
                        {(results as any).isVertical ? 'Undefined' : (results as any).m.toFixed(4)}
                      </p>
                    </div>
                    <div className="bg-slate-50/80 p-2 rounded-lg border border-slate-200/80">
                      <p className="text-[9px] font-bold text-slate-400 uppercase">y-intercept</p>
                      <p className="font-mono text-xs font-bold text-slate-900">{(results as any).yIntercept}</p>
                    </div>
                    <div className="bg-slate-50/80 p-2 rounded-lg border border-slate-200/80">
                      <p className="text-[9px] font-bold text-slate-400 uppercase">x-intercept</p>
                      <p className="font-mono text-xs font-bold text-slate-900">{(results as any).xIntercept}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Compact Curve Visualization */}
          {(type === 'linear' || type === 'quadratic') && (
            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Graph Curve</span>
                <span className="text-[9px] text-slate-400 font-mono">f(x)</span>
              </div>
              <div className="h-44 sm:h-48 w-full bg-slate-50/50 rounded-xl p-1 border border-slate-100">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={graphData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="x" stroke="#94a3b8" fontSize={9} type="number" domain={['auto', 'auto']} />
                    <YAxis stroke="#94a3b8" fontSize={9} domain={['auto', 'auto']} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '11px', padding: '4px 8px' }}
                      itemStyle={{ color: '#2563eb', fontWeight: 'bold' }}
                    />
                    <Line type="monotone" dataKey="y" stroke="#2563eb" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
