/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calculator as CalcIcon, 
  BarChart3, 
  Variable, 
  Divide, 
  Settings2,
  ChevronRight,
  Menu,
  X,
  RefreshCw,
  Maximize2,
  Minimize2,
  Wifi,
  WifiOff,
  Download,
  History as HistoryIcon,
  CheckCircle2
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Components & Context
import StandardCalculator from './components/StandardCalculator';
import StatisticsModule from './components/StatisticsModule';
import EquationSolvers from './components/EquationSolvers';
import FractionsModule from './components/FractionsModule';
import ConversionModule from './components/ConversionModule';
import HistoryDrawer from './components/HistoryDrawer';
import { HistoryProvider, useHistory } from './context/HistoryContext';
import { CalcModule } from './types/history';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Tab = 'standard' | 'scientific' | 'statistics' | 'quadratic' | 'cubic' | 'linear' | 'fractions' | 'conversions';

function CalculatorAppContent() {
  const { history, isDrawerOpen, setIsDrawerOpen, toastMessage } = useHistory();
  const [activeTab, setActiveTab] = useState<Tab>(() => {
    try {
      return (localStorage.getItem('malawi_calc_active_tab') as Tab) || 'standard';
    } catch {
      return 'standard';
    }
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [canInstall, setCanInstall] = useState(false);

  // Monitor Fullscreen status
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Monitor Online / Offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Monitor PWA Install Prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setCanInstall(false);
      setDeferredPrompt(null);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  const handleSelectTab = (tab: Tab) => {
    setActiveTab(tab);
    setIsSidebarOpen(false);
    try {
      localStorage.setItem('malawi_calc_active_tab', tab);
    } catch {}
  };

  const tabs: { id: Tab; label: string; shortLabel: string; icon: React.ReactNode; category: string }[] = [
    { id: 'standard', label: 'Standard', shortLabel: 'Standard', icon: <CalcIcon size={18} />, category: 'Calculators' },
    { id: 'scientific', label: 'Scientific', shortLabel: 'Scientific', icon: <Settings2 size={18} />, category: 'Calculators' },
    { id: 'statistics', label: 'Statistics', shortLabel: 'Stats', icon: <BarChart3 size={18} />, category: 'Analysis' },
    { id: 'quadratic', label: 'Quadratic Solver', shortLabel: 'Quadratic', icon: <Variable size={18} />, category: 'Solvers' },
    { id: 'cubic', label: 'Cubic Solver', shortLabel: 'Cubic', icon: <Variable size={18} />, category: 'Solvers' },
    { id: 'linear', label: 'Linear Solver', shortLabel: 'Linear', icon: <Variable size={18} />, category: 'Solvers' },
    { id: 'fractions', label: 'Fractions Engine', shortLabel: 'Fractions', icon: <Divide size={18} />, category: 'Arithmetic' },
    { id: 'conversions', label: 'Angle Conversions', shortLabel: 'Conversions', icon: <RefreshCw size={18} />, category: 'Arithmetic' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'standard':
      case 'scientific':
        return <StandardCalculator mode={activeTab} />;
      case 'statistics':
        return <StatisticsModule />;
      case 'quadratic':
      case 'cubic':
      case 'linear':
        return <EquationSolvers type={activeTab} />;
      case 'fractions':
        return <FractionsModule />;
      case 'conversions':
        return <ConversionModule />;
      default:
        return <div className="p-8 text-center text-slate-500">Select a module</div>;
    }
  };

  return (
    <div className="flex h-full w-full bg-slate-900 overflow-hidden font-sans select-none touch-manipulation">
      {/* Mobile Drawer Backdrop Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-xs lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Navigation Drawer */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 flex flex-col justify-between shadow-2xl lg:shadow-none",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full overflow-hidden">
          {/* Header & Logo */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-tr from-blue-700 to-blue-500 rounded-xl flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <CalcIcon size={22} />
              </div>
              <div>
                <h1 className="text-base font-bold text-slate-900 tracking-tight leading-tight">
                  Malawi Calc
                </h1>
                <p className="text-[11px] text-blue-600 font-semibold tracking-wide">
                  Offline Scientific Suite
                </p>
              </div>
            </div>
            
            <button
              type="button"
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X size={20} />
            </button>
          </div>

          {/* Nav Categories */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-5">
            {/* Quick History Button in Sidebar */}
            <button
              type="button"
              onClick={() => {
                setIsSidebarOpen(false);
                setIsDrawerOpen(true);
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-xs active:scale-98"
            >
              <div className="flex items-center gap-3">
                <HistoryIcon size={18} className="text-blue-400" />
                <span>History Drawer</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-600 text-white">
                {history.length}
              </span>
            </button>

            {['Calculators', 'Analysis', 'Solvers', 'Arithmetic'].map(category => (
              <div key={category}>
                <h3 className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">{category}</h3>
                <div className="space-y-1">
                  {tabs.filter(t => t.category === category).map(tab => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => handleSelectTab(tab.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all group active:scale-98",
                        activeTab === tab.id 
                          ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" 
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      )}
                    >
                      <span className={cn(
                        "transition-colors",
                        activeTab === tab.id ? "text-white" : "text-slate-400 group-hover:text-blue-600"
                      )}>
                        {tab.icon}
                      </span>
                      <span className="truncate">{tab.label}</span>
                      {activeTab === tab.id && (
                        <motion.div layoutId="active-nav-indicator" className="ml-auto">
                          <ChevronRight size={16} />
                        </motion.div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          {/* Footer Controls & Status */}
          <div className="p-4 border-t border-slate-100 space-y-2 bg-slate-50/60">
            {canInstall && (
              <button
                type="button"
                onClick={handleInstallClick}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold transition-colors border border-blue-200 shadow-xs"
              >
                <Download size={14} />
                <span>Install Mobile App</span>
              </button>
            )}

            <div className="bg-white rounded-xl p-3 border border-slate-200/80 shadow-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Network Engine</span>
                <div className="flex items-center gap-1.5">
                  {isOnline ? (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                      <Wifi size={12} />
                      <span>Ready</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-600">
                      <WifiOff size={12} />
                      <span>Offline Mode</span>
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-xs font-medium text-slate-700">100% Offline Capable</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Responsive Viewport */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-100 overflow-hidden relative">
        {/* Top App Bar */}
        <header className="h-14 sm:h-16 bg-white border-b border-slate-200 flex items-center justify-between px-3 sm:px-6 shrink-0 z-20 shadow-xs">
          <div className="flex items-center gap-2 sm:gap-3">
            <button 
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-1 text-slate-700 hover:bg-slate-100 rounded-xl active:scale-95 transition-all lg:hidden"
              aria-label="Open Navigation Menu"
            >
              <Menu size={22} />
            </button>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 capitalize tracking-tight flex items-center gap-2">
                <span>{activeTab.replace('-', ' ')}</span>
                <span className="hidden sm:inline-block text-xs font-medium text-slate-400 px-2 py-0.5 rounded bg-slate-100">
                  Full Mode
                </span>
              </h2>
            </div>
          </div>

          {/* Header Action Tools */}
          <div className="flex items-center gap-2">
            {/* Calculation History Drawer Button */}
            <button
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              title="Open Calculation History"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:text-blue-700 bg-slate-100 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 transition-all active:scale-95"
            >
              <HistoryIcon size={16} className="text-blue-600" />
              <span className="hidden xs:inline">History</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-blue-600 text-white">
                {history.length}
              </span>
            </button>

            {/* Offline Status Badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200/80">
              <div className={cn("w-1.5 h-1.5 rounded-full", isOnline ? "bg-emerald-500" : "bg-amber-500")} />
              <span>{isOnline ? 'Offline Ready' : 'Offline'}</span>
            </div>

            {/* Install button on top bar if eligible */}
            {canInstall && (
              <button
                type="button"
                onClick={handleInstallClick}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-all"
              >
                <Download size={14} />
                <span className="hidden xs:inline">Install</span>
              </button>
            )}

            {/* Fullscreen Mode Toggle for Mobile & Tablet */}
            <button
              type="button"
              onClick={toggleFullscreen}
              title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen Full Mode"}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 text-xs font-semibold transition-all flex items-center gap-1.5 active:scale-95 border border-slate-200"
            >
              {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              <span className="hidden md:inline">{isFullscreen ? 'Exit Fullscreen' : 'Full Mode'}</span>
            </button>
          </div>
        </header>

        {/* Quick Horizontal Module Switcher for Mobile & Tablet Touch Ergonomics */}
        <div className="bg-white/95 backdrop-blur-xs border-b border-slate-200/80 px-3 py-2 shrink-0 overflow-x-auto no-scrollbar flex items-center gap-1.5 z-10">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleSelectTab(tab.id)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all active:scale-95 shrink-0",
                  isActive
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900"
                )}
              >
                <span>{tab.icon}</span>
                <span>{tab.shortLabel}</span>
              </button>
            );
          })}
        </div>

        {/* Scrollable Content Viewport */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-2 sm:p-3.5 lg:p-4 overscroll-contain">
          <div className="max-w-5xl mx-auto h-full flex flex-col justify-start">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="w-full flex-1 flex flex-col"
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Calculation History Drawer */}
        <HistoryDrawer />

        {/* Recall Toast Notification */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl border border-slate-700 flex items-center gap-2 text-xs font-semibold"
            >
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <HistoryProvider>
      <CalculatorAppContent />
    </HistoryProvider>
  );
}

