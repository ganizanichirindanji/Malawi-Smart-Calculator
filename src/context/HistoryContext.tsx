import React, { createContext, useContext, useState, useEffect } from 'react';
import { HistoryItem, CalcModule } from '../types/history';

interface HistoryContextType {
  history: HistoryItem[];
  addHistoryEntry: (entry: Omit<HistoryItem, 'id' | 'timestamp'>) => void;
  deleteEntry: (id: string) => void;
  clearHistory: () => void;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  recalledItem: HistoryItem | null;
  recallEntry: (item: HistoryItem) => void;
  toastMessage: string | null;
  setToastMessage: (msg: string | null) => void;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

const STORAGE_KEY = 'malawi_calc_universal_history';
const MAX_SAVED = 10;

export const HistoryProvider: React.FC<{ 
  children: React.ReactNode; 
  onNavigateToTab?: (tab: CalcModule) => void;
}> = ({ children, onNavigateToTab }) => {
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [recalledItem, setRecalledItem] = useState<HistoryItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch {}
  }, [history]);

  const addHistoryEntry = (entry: Omit<HistoryItem, 'id' | 'timestamp'>) => {
    // Avoid duplicate rapid recordings if identical to the first item
    if (
      history.length > 0 && 
      history[0].module === entry.module && 
      history[0].expression === entry.expression && 
      history[0].result === entry.result
    ) {
      return;
    }

    const newItem: HistoryItem = {
      ...entry,
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      timestamp: Date.now(),
    };

    setHistory((prev) => [newItem, ...prev.filter(item => item.id !== newItem.id)].slice(0, MAX_SAVED));
  };

  const deleteEntry = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  const recallEntry = (item: HistoryItem) => {
    setRecalledItem(item);
    if (onNavigateToTab) {
      onNavigateToTab(item.module);
    }
    setIsDrawerOpen(false);
    
    // Show a quick visual confirmation
    setToastMessage(`Recalled into ${item.title}`);
    setTimeout(() => {
      setToastMessage(null);
    }, 2400);
  };

  return (
    <HistoryContext.Provider
      value={{
        history,
        addHistoryEntry,
        deleteEntry,
        clearHistory,
        isDrawerOpen,
        setIsDrawerOpen,
        recalledItem,
        recallEntry,
        toastMessage,
        setToastMessage,
      }}
    >
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = () => {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  return context;
};
