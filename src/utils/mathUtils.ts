import { all, create, fraction, Fraction } from 'mathjs';

const math = create(all);

export interface ScientificConstant {
  id: string;
  symbol: string;
  displaySymbol: string;
  name: string;
  category: 'universal' | 'physics' | 'chemistry' | 'math';
  value: number;
  valueStr: string;
  formattedValue: string;
  unit: string;
  description: string;
}

export const SCIENTIFIC_CONSTANTS: ScientificConstant[] = [
  {
    id: 'pi',
    symbol: 'pi',
    displaySymbol: 'π',
    name: 'Pi',
    category: 'math',
    value: Math.PI,
    valueStr: '3.141592653589793',
    formattedValue: '3.14159265359',
    unit: 'dimensionless',
    description: 'Ratio of circle circumference to diameter'
  },
  {
    id: 'e',
    symbol: 'e',
    displaySymbol: 'e',
    name: "Euler's Number",
    category: 'math',
    value: Math.E,
    valueStr: '2.718281828459045',
    formattedValue: '2.71828182846',
    unit: 'dimensionless',
    description: 'Base of the natural logarithm'
  },
  {
    id: 'c',
    symbol: 'c',
    displaySymbol: 'c',
    name: 'Speed of Light',
    category: 'universal',
    value: 299792458,
    valueStr: '299792458',
    formattedValue: '2.99792458 × 10⁸',
    unit: 'm/s',
    description: 'Speed of light in a vacuum'
  },
  {
    id: 'h',
    symbol: 'h',
    displaySymbol: 'h',
    name: "Planck's Constant",
    category: 'universal',
    value: 6.62607015e-34,
    valueStr: '6.62607015e-34',
    formattedValue: '6.62607015 × 10⁻³⁴',
    unit: 'J·s',
    description: 'Quantum of electromagnetic action'
  },
  {
    id: 'hbar',
    symbol: 'hbar',
    displaySymbol: 'ℏ',
    name: 'Reduced Planck Constant',
    category: 'universal',
    value: 1.054571817e-34,
    valueStr: '1.054571817e-34',
    formattedValue: '1.05457182 × 10⁻³⁴',
    unit: 'J·s',
    description: 'Dirac constant (h / 2π)'
  },
  {
    id: 'G',
    symbol: 'G',
    displaySymbol: 'G',
    name: 'Gravitational Constant',
    category: 'physics',
    value: 6.67430e-11,
    valueStr: '6.67430e-11',
    formattedValue: '6.67430 × 10⁻¹¹',
    unit: 'N·m²/kg²',
    description: 'Newtonian gravitational constant'
  },
  {
    id: 'g_acc',
    symbol: 'g',
    displaySymbol: 'g',
    name: 'Standard Gravity',
    category: 'physics',
    value: 9.80665,
    valueStr: '9.80665',
    formattedValue: '9.80665',
    unit: 'm/s²',
    description: 'Nominal gravitational acceleration on Earth'
  },
  {
    id: 'Na',
    symbol: 'Na',
    displaySymbol: 'N_A',
    name: "Avogadro's Number",
    category: 'chemistry',
    value: 6.02214076e23,
    valueStr: '6.02214076e23',
    formattedValue: '6.02214076 × 10²³',
    unit: 'mol⁻¹',
    description: 'Constituent particles per mole of substance'
  },
  {
    id: 'kB',
    symbol: 'kB',
    displaySymbol: 'k_B',
    name: 'Boltzmann Constant',
    category: 'physics',
    value: 1.380649e-23,
    valueStr: '1.380649e-23',
    formattedValue: '1.380649 × 10⁻²³',
    unit: 'J/K',
    description: 'Relates thermal kinetic energy with temperature'
  },
  {
    id: 'R',
    symbol: 'R',
    displaySymbol: 'R',
    name: 'Molar Gas Constant',
    category: 'chemistry',
    value: 8.314462618,
    valueStr: '8.314462618',
    formattedValue: '8.3144626',
    unit: 'J/(mol·K)',
    description: 'Ideal gas law constant (N_A · k_B)'
  },
  {
    id: 'qe',
    symbol: 'qe',
    displaySymbol: 'q_e',
    name: 'Elementary Charge',
    category: 'physics',
    value: 1.602176634e-19,
    valueStr: '1.602176634e-19',
    formattedValue: '1.60217663 × 10⁻¹⁹',
    unit: 'C',
    description: 'Electric charge carried by single proton'
  },
  {
    id: 'me',
    symbol: 'me',
    displaySymbol: 'm_e',
    name: 'Electron Mass',
    category: 'physics',
    value: 9.1093837015e-31,
    valueStr: '9.1093837015e-31',
    formattedValue: '9.10938370 × 10⁻³¹',
    unit: 'kg',
    description: 'Rest mass of an electron'
  },
  {
    id: 'mp',
    symbol: 'mp',
    displaySymbol: 'm_p',
    name: 'Proton Mass',
    category: 'physics',
    value: 1.67262192369e-27,
    valueStr: '1.67262192369e-27',
    formattedValue: '1.67262192 × 10⁻²⁷',
    unit: 'kg',
    description: 'Rest mass of a proton'
  },
  {
    id: 'eps0',
    symbol: 'eps0',
    displaySymbol: 'ε₀',
    name: 'Vacuum Permittivity',
    category: 'physics',
    value: 8.8541878128e-12,
    valueStr: '8.8541878128e-12',
    formattedValue: '8.85418781 × 10⁻¹²',
    unit: 'F/m',
    description: 'Dielectric permittivity of free space'
  },
  {
    id: 'phi',
    symbol: 'phi',
    displaySymbol: 'ϕ',
    name: 'Golden Ratio',
    category: 'math',
    value: (1 + Math.sqrt(5)) / 2,
    valueStr: '1.618033988749895',
    formattedValue: '1.61803398875',
    unit: 'dimensionless',
    description: 'Golden ratio (1 + √5)/2'
  },
  {
    id: 'atm',
    symbol: 'atm',
    displaySymbol: 'atm',
    name: 'Standard Atmosphere',
    category: 'physics',
    value: 101325,
    valueStr: '101325',
    formattedValue: '101,325',
    unit: 'Pa',
    description: 'Standard sea-level atmospheric pressure'
  }
];

const toRadians = (deg: number) => (deg * Math.PI) / 180;
const toDegrees = (rad: number) => (rad * 180) / Math.PI;

// Normalize angles to [0, 360)
const normDeg = (deg: number): number => {
  let d = deg % 360;
  if (d < 0) d += 360;
  return d;
};

// Clean floating point rounding errors like 0.30000000000000004 -> 0.3
const cleanFloat = (val: number, precision = 12): number => {
  if (Math.abs(val) < 1e-13) return 0;
  const rounded = Number(val.toPrecision(precision));
  return Number(rounded.toFixed(precision));
};

export const calculateExpression = (
  expression: string, 
  angleMode: 'deg' | 'rad' = 'deg',
  ansValue?: string | number | null
): string => {
  try {
    if (!expression || !expression.trim()) return '';

    // Replace display symbols with valid mathjs syntax
    let expr = expression
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-')
      .replace(/π/g, 'pi')
      .replace(/ℏ/g, 'hbar')
      .replace(/ε₀|eps0/g, 'eps0')
      .replace(/ϕ/g, 'phi')
      .replace(/N_A|N_a|Na\b/g, 'Na')
      .replace(/k_B|k_b|kB\b/g, 'kB')
      .replace(/q_e|qe\b/g, 'qe')
      .replace(/m_e|me\b/g, 'me')
      .replace(/m_p|mp\b/g, 'mp')
      .replace(/√/g, 'sqrt')
      .replace(/∛/g, 'cbrt')
      .replace(/EE/g, '*10^');

    // Replace Ans token with actual ansValue if provided
    if (ansValue !== undefined && ansValue !== null && ansValue !== '') {
      const numAns = typeof ansValue === 'number' ? ansValue : (!isNaN(Number(ansValue)) ? Number(ansValue) : 0);
      expr = expr.replace(/\bAns\b/g, `(${numAns})`);
    } else {
      expr = expr.replace(/\bAns\b/g, '(0)');
    }

    // Handle implicit multiplication e.g. "2pi", "2c", "2h", "2(", ")(", "3sin(", "5sqrt("
    expr = expr
      .replace(/(\d)\s*\(/g, '$1*(')
      .replace(/\)\s*(\d)/g, ')*$1')
      .replace(/\)\s*\(/g, ')*(')
      .replace(/(\d)\s*(pi|tau|phi|e|hbar|h|c|G|g_acc|Na|kB|qe|me|mp|eps0|atm|R)\b/gi, '$1*$2')
      .replace(/\)\s*(pi|tau|phi|e|hbar|h|c|G|g_acc|Na|kB|qe|me|mp|eps0|atm|R)\b/gi, ')*$1')
      .replace(/(\d)\s*(sin|cos|tan|asin|acos|atan|sinh|cosh|tanh|asinh|acosh|atanh|ln|log|log10|log2|sqrt|cbrt|nthRoot|exp|abs)\b/gi, '$1*$2')
      .replace(/%/g, '*(0.01)');

    // Build custom scope with angle mode and high-precision scientific functions & constants
    const scope: Record<string, any> = {
      // Mathematical & Physical Constants
      pi: Math.PI,
      e: Math.E,
      tau: 2 * Math.PI,
      phi: (1 + Math.sqrt(5)) / 2,
      c: 299792458,
      h: 6.62607015e-34,
      hbar: 1.054571817e-34,
      G: 6.67430e-11,
      g: 9.80665,
      g_acc: 9.80665,
      Na: 6.02214076e23,
      kB: 1.380649e-23,
      k_B: 1.380649e-23,
      R: 8.314462618,
      qe: 1.602176634e-19,
      q_e: 1.602176634e-19,
      me: 9.1093837015e-31,
      m_e: 9.1093837015e-31,
      mp: 1.67262192369e-27,
      m_p: 1.67262192369e-27,
      eps0: 8.8541878128e-12,
      atm: 101325,

      // Scientific functions
      ln: (x: number) => {
        if (x <= 0) throw new Error('Undefined (ln x for x ≤ 0)');
        return cleanFloat(Math.log(x));
      },
      log: (x: number) => {
        if (x <= 0) throw new Error('Undefined (log x for x ≤ 0)');
        return cleanFloat(Math.log10(x));
      },
      log10: (x: number) => {
        if (x <= 0) throw new Error('Undefined (log₁₀ x for x ≤ 0)');
        return cleanFloat(Math.log10(x));
      },
      log2: (x: number) => {
        if (x <= 0) throw new Error('Undefined (log₂ x for x ≤ 0)');
        return cleanFloat(Math.log2(x));
      },
      exp: (x: number) => cleanFloat(Math.exp(x)),
      nPr: (n: number, r: number) => math.permutations(n, r),
      nCr: (n: number, r: number) => math.combinations(n, r),
      permutations: (n: number, r: number) => math.permutations(n, r),
      combinations: (n: number, r: number) => math.combinations(n, r),
      fact: (n: number) => math.factorial(n),
      factorial: (n: number) => math.factorial(n),
      mod: (a: number, b: number) => math.mod(a, b),
      cbrt: (x: number) => cleanFloat(Math.cbrt(x)),
      nthRoot: (x: number, n: number) => {
        if (n === 0) throw new Error('Undefined (0th root)');
        if (x < 0 && n % 2 === 0) throw new Error('Complex root');
        if (x < 0) return -cleanFloat(Math.pow(-x, 1 / n));
        return cleanFloat(Math.pow(x, 1 / n));
      },
      abs: (x: number) => Math.abs(x),
      rand: () => Math.random(),
      random: () => Math.random(),
      floor: (x: number) => Math.floor(x),
      ceil: (x: number) => Math.ceil(x),
      round: (x: number, n?: number) => (n !== undefined ? math.round(x, n) : Math.round(x)),
      sinh: (x: number) => cleanFloat(Math.sinh(x)),
      cosh: (x: number) => cleanFloat(Math.cosh(x)),
      tanh: (x: number) => cleanFloat(Math.tanh(x)),
      asinh: (x: number) => cleanFloat(Math.asinh(x)),
      acosh: (x: number) => {
        if (x < 1) throw new Error('Undefined (acosh x for x < 1)');
        return cleanFloat(Math.acosh(x));
      },
      atanh: (x: number) => {
        if (Math.abs(x) >= 1) throw new Error('Undefined (atanh x for |x| ≥ 1)');
        return cleanFloat(Math.atanh(x));
      },
    };

    if (angleMode === 'deg') {
      scope.sin = (x: number) => {
        const d = normDeg(x);
        if (d === 0 || d === 180) return 0;
        if (d === 90) return 1;
        if (d === 270) return -1;
        if (d === 30 || d === 150) return 0.5;
        if (d === 210 || d === 330) return -0.5;
        return cleanFloat(Math.sin(toRadians(x)));
      };
      scope.cos = (x: number) => {
        const d = normDeg(x);
        if (d === 90 || d === 270) return 0;
        if (d === 0) return 1;
        if (d === 180) return -1;
        if (d === 60 || d === 300) return 0.5;
        if (d === 120 || d === 240) return -0.5;
        return cleanFloat(Math.cos(toRadians(x)));
      };
      scope.tan = (x: number) => {
        const d = normDeg(x);
        if (d === 90 || d === 270) throw new Error('Undefined: tan(90° + k·180°)');
        if (d === 0 || d === 180) return 0;
        if (d === 45 || d === 225) return 1;
        if (d === 135 || d === 315) return -1;
        return cleanFloat(Math.tan(toRadians(x)));
      };
      scope.asin = (x: number) => {
        if (x < -1 || x > 1) throw new Error('Domain Error: asin(x) for |x| ≤ 1');
        if (x === 1) return 90;
        if (x === -1) return -90;
        if (x === 0) return 0;
        if (x === 0.5) return 30;
        if (x === -0.5) return -30;
        return cleanFloat(toDegrees(Math.asin(x)));
      };
      scope.acos = (x: number) => {
        if (x < -1 || x > 1) throw new Error('Domain Error: acos(x) for |x| ≤ 1');
        if (x === 1) return 0;
        if (x === -1) return 180;
        if (x === 0) return 90;
        if (x === 0.5) return 60;
        if (x === -0.5) return 120;
        return cleanFloat(toDegrees(Math.acos(x)));
      };
      scope.atan = (x: number) => {
        if (x === 0) return 0;
        if (x === 1) return 45;
        if (x === -1) return -45;
        return cleanFloat(toDegrees(Math.atan(x)));
      };
      scope.atan2 = (y: number, x: number) => cleanFloat(toDegrees(Math.atan2(y, x)));
    } else {
      scope.sin = (x: number) => {
        const s = Math.sin(x);
        return Math.abs(s) < 1e-15 ? 0 : cleanFloat(s);
      };
      scope.cos = (x: number) => {
        const c = Math.cos(x);
        return Math.abs(c) < 1e-15 ? 0 : cleanFloat(c);
      };
      scope.tan = (x: number) => {
        const c = Math.cos(x);
        if (Math.abs(c) < 1e-15) throw new Error('Undefined: tan(π/2 + kπ)');
        const t = Math.tan(x);
        return Math.abs(t) < 1e-15 ? 0 : cleanFloat(t);
      };
      scope.asin = (x: number) => {
        if (x < -1 || x > 1) throw new Error('Domain Error: asin(x) for |x| ≤ 1');
        return cleanFloat(Math.asin(x));
      };
      scope.acos = (x: number) => {
        if (x < -1 || x > 1) throw new Error('Domain Error: acos(x) for |x| ≤ 1');
        return cleanFloat(Math.acos(x));
      };
      scope.atan = (x: number) => cleanFloat(Math.atan(x));
      scope.atan2 = (y: number, x: number) => cleanFloat(Math.atan2(y, x));
    }

    const compiled = math.compile(expr);
    const rawResult = compiled.evaluate(scope);

    if (typeof rawResult === 'number') {
      if (isNaN(rawResult)) return 'Error';
      if (!isFinite(rawResult)) return rawResult > 0 ? 'Infinity' : '-Infinity';
      if (Math.abs(rawResult) < 1e-14 && rawResult !== 0) return '0';
      
      // Clean up common decimal floating-point rounding artifacts
      const formatted = math.format(rawResult, { precision: 12, lowerExp: -9, upperExp: 12 });
      return formatted;
    }

    if (typeof rawResult === 'boolean') {
      return rawResult ? 'true' : 'false';
    }

    return math.format(rawResult, { precision: 12 });
  } catch (error: any) {
    if (error?.message && (error.message.includes('Undefined') || error.message.includes('Domain Error'))) {
      return error.message;
    }
    return 'Error';
  }
};

export const calculateStatistics = (data: number[]) => {
  if (data.length === 0) return null;

  const n = data.length;
  const sorted = [...data].sort((a, b) => a - b);
  const sum = data.reduce((a, b) => a + b, 0);
  const mean = sum / n;
  
  // Median
  const median = n % 2 === 0 
    ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2 
    : sorted[Math.floor(n / 2)];

  // Quartiles Q1 and Q3
  const mid = Math.floor(n / 2);
  const lowerHalf = sorted.slice(0, mid);
  const upperHalf = n % 2 === 0 ? sorted.slice(mid) : sorted.slice(mid + 1);

  const q1 = lowerHalf.length > 0 
    ? (lowerHalf.length % 2 === 0 ? (lowerHalf[lowerHalf.length / 2 - 1] + lowerHalf[lowerHalf.length / 2]) / 2 : lowerHalf[Math.floor(lowerHalf.length / 2)])
    : sorted[0];

  const q3 = upperHalf.length > 0
    ? (upperHalf.length % 2 === 0 ? (upperHalf[upperHalf.length / 2 - 1] + upperHalf[upperHalf.length / 2]) / 2 : upperHalf[Math.floor(upperHalf.length / 2)])
    : sorted[sorted.length - 1];

  const iqr = q3 - q1;

  // Mode
  const counts: Record<number, number> = {};
  data.forEach(x => counts[x] = (counts[x] || 0) + 1);
  let maxCount = 0;
  let modes: number[] = [];
  for (const k in counts) {
    if (counts[k] > maxCount) {
      maxCount = counts[k];
      modes = [Number(k)];
    } else if (counts[k] === maxCount) {
      modes.push(Number(k));
    }
  }

  const sumSq = data.reduce((a, b) => a + b * b, 0);
  const ss = data.reduce((a, b) => a + Math.pow(b - mean, 2), 0);
  
  // Sample Variance (s^2 with n-1) and Population Variance (sigma^2 with n)
  const sampleVariance = n > 1 ? ss / (n - 1) : 0;
  const sampleStdDev = Math.sqrt(sampleVariance);
  const popVariance = ss / n;
  const popStdDev = Math.sqrt(popVariance);
  const standardError = n > 0 ? sampleStdDev / Math.sqrt(n) : 0;

  return {
    count: n,
    mean,
    median,
    mode: maxCount > 1 && modes.length < n ? modes.join(', ') : 'None',
    range: sorted[sorted.length - 1] - sorted[0],
    min: sorted[0],
    max: sorted[sorted.length - 1],
    q1,
    q3,
    iqr,
    sum,
    sumSq,
    variance: sampleVariance,
    stdDev: sampleStdDev,
    popVariance,
    popStdDev,
    standardError
  };
};

const formatNum = (num: number, digits = 4): string => {
  if (!isFinite(num)) return 'Undefined';
  if (Math.abs(num) < 1e-12) return '0';
  const clean = Number(num.toFixed(digits));
  return clean.toString();
};

export const solveQuadratic = (a: number, b: number, c: number) => {
  if (a === 0) {
    // Linear equation bx + c = 0
    const root = b !== 0 ? -c / b : NaN;
    return {
      roots: isNaN(root) ? ['None'] : [formatNum(root)],
      vertex: 'None (Linear)',
      axisOfSymmetry: 'None',
      yIntercept: formatNum(c),
      turningPoint: 'None',
      discriminant: 'N/A',
      nature: 'Linear Equation',
      a, b, c
    };
  }

  const discriminant = b * b - 4 * a * c;
  const axisOfSymmetry = -b / (2 * a);
  const vertexX = axisOfSymmetry;
  const vertexY = a * vertexX * vertexX + b * vertexX + c;

  let roots: string[] = [];
  let nature = '';

  if (discriminant > 0) {
    const r1 = (-b + Math.sqrt(discriminant)) / (2 * a);
    const r2 = (-b - Math.sqrt(discriminant)) / (2 * a);
    roots = [formatNum(r1), formatNum(r2)];
    nature = 'Two distinct real roots';
  } else if (Math.abs(discriminant) < 1e-12) {
    roots = [formatNum(-b / (2 * a))];
    nature = 'One repeated real root';
  } else {
    const realPart = -b / (2 * a);
    const imagPart = Math.sqrt(-discriminant) / (2 * Math.abs(a));
    const realStr = formatNum(realPart);
    const imagStr = formatNum(imagPart);
    roots = [`${realStr} + ${imagStr}i`, `${realStr} - ${imagStr}i`];
    nature = 'Two complex conjugate roots';
  }

  const turningPoint = `(${formatNum(vertexX)}, ${formatNum(vertexY)})`;

  return {
    roots,
    vertex: turningPoint,
    turningPoint,
    axisOfSymmetry: `x = ${formatNum(axisOfSymmetry)}`,
    yIntercept: formatNum(c),
    discriminant: formatNum(discriminant, 2),
    nature,
    a, b, c
  };
};

export const solveCubic = (a: number, b: number, c: number, d: number) => {
  if (a === 0) {
    const quad = solveQuadratic(b, c, d);
    return {
      roots: quad.roots,
      yIntercept: formatNum(d),
      turningPoints: [quad.turningPoint],
      inflectionPoint: 'None',
      discriminant: quad.discriminant,
      nature: 'Degenerate Quadratic'
    };
  }

  const f = (x: number) => a * x ** 3 + b * x ** 2 + c * x + d;
  const df = (x: number) => 3 * a * x ** 2 + 2 * b * x + c;

  // Turning points (extrema): df(x) = 3ax^2 + 2bx + c = 0
  const tpDiscriminant = (2 * b) ** 2 - 4 * (3 * a) * c;
  let turningPoints: string[] = [];
  if (tpDiscriminant > 0) {
    const x1 = (-2 * b + Math.sqrt(tpDiscriminant)) / (6 * a);
    const x2 = (-2 * b - Math.sqrt(tpDiscriminant)) / (6 * a);
    turningPoints = [
      `(${formatNum(x1)}, ${formatNum(f(x1))})`,
      `(${formatNum(x2)}, ${formatNum(f(x2))})`
    ];
  } else if (Math.abs(tpDiscriminant) < 1e-12) {
    const x0 = -b / (3 * a);
    turningPoints = [`(${formatNum(x0)}, ${formatNum(f(x0))}) (Inflection)`];
  } else {
    turningPoints = ['None (Monotonic)'];
  }

  // Inflection point: d^2f/dx^2 = 6ax + 2b = 0 => x = -b/(3a)
  const infX = -b / (3 * a);
  const infY = f(infX);
  const inflectionPoint = `(${formatNum(infX)}, ${formatNum(infY)})`;

  // Cardano's analytical cubic formula
  // Substitute x = t - b/(3a) to get t^3 + pt + q = 0
  const p = (3 * a * c - b * b) / (3 * a * a);
  const q = (2 * b * b * b - 9 * a * b * c + 27 * a * a * d) / (27 * a * a * a);
  const delta = (q / 2) ** 2 + (p / 3) ** 3;

  let roots: string[] = [];
  let nature = '';

  if (delta > 1e-12) {
    // One real root and two complex conjugate roots
    const u = Math.cbrt(-q / 2 + Math.sqrt(delta));
    const v = Math.cbrt(-q / 2 - Math.sqrt(delta));
    const r1 = u + v - b / (3 * a);
    const realPart = -(u + v) / 2 - b / (3 * a);
    const imagPart = (Math.sqrt(3) / 2) * Math.abs(u - v);

    roots = [
      formatNum(r1),
      `${formatNum(realPart)} + ${formatNum(imagPart)}i`,
      `${formatNum(realPart)} - ${formatNum(imagPart)}i`
    ];
    nature = '1 Real root, 2 Complex roots';
  } else if (Math.abs(delta) <= 1e-12) {
    // All roots real, at least two are equal
    if (Math.abs(p) < 1e-12 && Math.abs(q) < 1e-12) {
      const r = -b / (3 * a);
      roots = [formatNum(r)];
      nature = 'Triple real root';
    } else {
      const u = Math.cbrt(-q / 2);
      const r1 = 2 * u - b / (3 * a);
      const r2 = -u - b / (3 * a);
      roots = [formatNum(r1), formatNum(r2)];
      nature = 'Three real roots (one repeated)';
    }
  } else {
    // delta < 0: Three distinct real roots (casus irreducibilis using trigonometry)
    const r = Math.sqrt(-(p ** 3) / 27);
    const phi = Math.acos(Math.max(-1, Math.min(1, -q / (2 * r))));
    const factor = 2 * Math.cbrt(r);
    const shift = -b / (3 * a);

    const r1 = factor * Math.cos(phi / 3) + shift;
    const r2 = factor * Math.cos((phi + 2 * Math.PI) / 3) + shift;
    const r3 = factor * Math.cos((phi + 4 * Math.PI) / 3) + shift;

    roots = [formatNum(r1), formatNum(r2), formatNum(r3)];
    nature = 'Three distinct real roots';
  }

  return {
    roots,
    yIntercept: formatNum(d),
    turningPoints,
    inflectionPoint,
    discriminant: formatNum(-108 * a * a * delta, 2),
    nature,
    a, b, c, d
  };
};

export const convertAngle = (value: number, from: 'deg' | 'rad', to: 'deg' | 'rad'): number => {
  if (from === to) return value;
  if (from === 'deg' && to === 'rad') {
    return cleanFloat(value * (Math.PI / 180));
  }
  return cleanFloat(value * (180 / Math.PI));
};

export const simplifyFraction = (input: string): { simplified: string, decimal: string, mixed?: string } | null => {
  try {
    if (!input || !input.trim()) return null;

    // Handle mixed numbers like "1 1/2" or "-2 3/4" by converting to "(1 + 1/2)" or "-(2 + 3/4)"
    let normalizedInput = input
      .trim()
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-')
      .replace(/(^|[^0-9])(-\s*)(\d+)\s+(\d+\/\d+)/g, '$1-($3 + $4)')
      .replace(/(\d+)\s+(\d+\/\d+)/g, '($1 + $2)');

    const result = math.evaluate(normalizedInput);
    if (typeof result !== 'number' || !isFinite(result)) return null;

    const f = math.fraction(result) as Fraction;
    const ratio = math.format(f, { fraction: 'ratio' });

    // Calculate mixed fraction if improper
    let mixed = '';
    const num = Math.abs(Number(f.n));
    const den = Number(f.d);
    const sign = Number(f.s) < 0 ? '-' : '';
    if (num > den && den > 1) {
      const whole = Math.floor(num / den);
      const rem = num % den;
      if (rem > 0) {
        mixed = `${sign}${whole} ${rem}/${den}`;
      }
    }

    return {
      simplified: ratio,
      decimal: cleanFloat(result, 8).toString(),
      mixed: mixed || undefined
    };
  } catch (e) {
    return null;
  }
};

