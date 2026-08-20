export type CalcModule = 
  | 'standard' 
  | 'scientific' 
  | 'statistics' 
  | 'quadratic' 
  | 'cubic' 
  | 'linear' 
  | 'fractions' 
  | 'conversions';

export interface HistoryItem {
  id: string;
  timestamp: number;
  module: CalcModule;
  title: string;
  expression: string;
  result: string;
  details?: string;
  recallState?: {
    display?: string;
    inputs?: Record<string, string>;
    datasetInput?: string;
    fractionInput?: string;
    conversionValue?: string;
    conversionCategory?: string;
    conversionFrom?: string;
    conversionTo?: string;
    linearMode?: 'slope-intercept' | 'two-points';
  };
}
