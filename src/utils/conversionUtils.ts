// Comprehensive Unit Conversion System for Malawi Scientific Calculator

export interface UnitDef {
  id: string;
  name: string;
  symbol: string;
  ratio?: number; // Multiply by ratio to convert from this unit to the base unit
  toBase?: (val: number) => number;
  fromBase?: (val: number) => number;
  description?: string;
}

export interface UnitCategory {
  id: string;
  name: string;
  iconName: string;
  description: string;
  baseUnitId: string;
  units: UnitDef[];
  presets: Array<{ label: string; value: number; fromUnit: string; toUnit: string; note?: string }>;
}

export const UNIT_CATEGORIES: UnitCategory[] = [
  {
    id: 'length',
    name: 'Length & Distance',
    iconName: 'Ruler',
    description: 'Metric (SI) and Imperial/US customary length & distance units',
    baseUnitId: 'm',
    units: [
      { id: 'nm', name: 'Nanometer', symbol: 'nm', ratio: 1e-9, description: '10⁻⁹ m' },
      { id: 'um', name: 'Micrometer (Micron)', symbol: 'µm', ratio: 1e-6, description: '10⁻⁶ m' },
      { id: 'mm', name: 'Millimeter', symbol: 'mm', ratio: 0.001, description: '0.001 m' },
      { id: 'cm', name: 'Centimeter', symbol: 'cm', ratio: 0.01, description: '0.01 m' },
      { id: 'm', name: 'Meter', symbol: 'm', ratio: 1, description: 'SI Base Unit' },
      { id: 'km', name: 'Kilometer', symbol: 'km', ratio: 1000, description: '1,000 m' },
      { id: 'in', name: 'Inch', symbol: 'in', ratio: 0.0254, description: '2.54 cm' },
      { id: 'ft', name: 'Foot', symbol: 'ft', ratio: 0.3048, description: '12 inches (0.3048 m)' },
      { id: 'yd', name: 'Yard', symbol: 'yd', ratio: 0.9144, description: '3 feet (0.9144 m)' },
      { id: 'mi', name: 'Mile', symbol: 'mi', ratio: 1609.344, description: '5,280 feet (1.609 km)' },
      { id: 'nmi', name: 'Nautical Mile', symbol: 'nmi', ratio: 1852, description: '1,852 m (International)' }
    ],
    presets: [
      { label: '1 meter', value: 1, fromUnit: 'm', toUnit: 'ft', note: '1 m = 3.28084 ft' },
      { label: '1 foot', value: 1, fromUnit: 'ft', toUnit: 'cm', note: '1 ft = 30.48 cm' },
      { label: '1 inch', value: 1, fromUnit: 'in', toUnit: 'mm', note: '1 in = 25.4 mm' },
      { label: '100 meters', value: 100, fromUnit: 'm', toUnit: 'yd', note: 'Sprint track distance' },
      { label: '1 mile', value: 1, fromUnit: 'mi', toUnit: 'km', note: '1 mi = 1.60934 km' },
      { label: '5 kilometers', value: 5, fromUnit: 'km', toUnit: 'mi', note: 'Standard 5K run' },
      { label: '10 kilometers', value: 10, fromUnit: 'km', toUnit: 'mi', note: 'Standard 10K run' },
      { label: 'Marathon (42.195 km)', value: 42.195, fromUnit: 'km', toUnit: 'mi', note: '26.219 miles' }
    ]
  },
  {
    id: 'mass',
    name: 'Mass & Weight',
    iconName: 'Scale',
    description: 'Metric grams & kilograms, Imperial pounds, ounces, stones & tons',
    baseUnitId: 'kg',
    units: [
      { id: 'ug', name: 'Microgram', symbol: 'µg', ratio: 1e-9, description: '10⁻⁶ g' },
      { id: 'mg', name: 'Milligram', symbol: 'mg', ratio: 1e-6, description: '0.001 g' },
      { id: 'g', name: 'Gram', symbol: 'g', ratio: 0.001, description: '0.001 kg' },
      { id: 'kg', name: 'Kilogram', symbol: 'kg', ratio: 1, description: 'SI Base Unit' },
      { id: 't', name: 'Metric Ton (Tonne)', symbol: 't', ratio: 1000, description: '1,000 kg' },
      { id: 'oz', name: 'Ounce (Avoirdupois)', symbol: 'oz', ratio: 0.028349523125, description: '1/16 lb (28.35 g)' },
      { id: 'lb', name: 'Pound', symbol: 'lb', ratio: 0.45359237, description: '16 oz (0.4536 kg)' },
      { id: 'st', name: 'Stone', symbol: 'st', ratio: 6.35029318, description: '14 lb (6.35 kg)' },
      { id: 'ton_us', name: 'Short Ton (US)', symbol: 'ton (US)', ratio: 907.18474, description: '2,000 lb' },
      { id: 'ton_uk', name: 'Long Ton (Imperial)', symbol: 'ton (UK)', ratio: 1016.0469088, description: '2,240 lb' },
      { id: 'ct', name: 'Carat', symbol: 'ct', ratio: 0.0002, description: '200 mg (gemstones)' }
    ],
    presets: [
      { label: '1 kilogram', value: 1, fromUnit: 'kg', toUnit: 'lb', note: '1 kg = 2.20462 lb' },
      { label: '1 pound', value: 1, fromUnit: 'lb', toUnit: 'kg', note: '1 lb = 0.45359 kg' },
      { label: '1 ounce', value: 1, fromUnit: 'oz', toUnit: 'g', note: '1 oz = 28.3495 g' },
      { label: '1 stone', value: 1, fromUnit: 'st', toUnit: 'kg', note: '1 st = 6.35029 kg' },
      { label: '50 kg (Bag of Maize)', value: 50, fromUnit: 'kg', toUnit: 'lb', note: 'Standard Malawi grain bag' },
      { label: '1 metric tonne', value: 1, fromUnit: 't', toUnit: 'kg', note: '1,000 kg' },
      { label: '150 lb (Person)', value: 150, fromUnit: 'lb', toUnit: 'kg', note: '68.04 kg' }
    ]
  },
  {
    id: 'temperature',
    name: 'Temperature',
    iconName: 'Thermometer',
    description: 'Celsius, Fahrenheit, Kelvin, and Rankine scales',
    baseUnitId: 'c',
    units: [
      {
        id: 'c',
        name: 'Celsius',
        symbol: '°C',
        toBase: (v) => v,
        fromBase: (v) => v,
        description: 'Water freezes at 0°C, boils at 100°C'
      },
      {
        id: 'f',
        name: 'Fahrenheit',
        symbol: '°F',
        toBase: (v) => ((v - 32) * 5) / 9,
        fromBase: (v) => (v * 9) / 5 + 32,
        description: 'Water freezes at 32°F, boils at 212°F'
      },
      {
        id: 'k',
        name: 'Kelvin',
        symbol: 'K',
        toBase: (v) => v - 273.15,
        fromBase: (v) => v + 273.15,
        description: 'Absolute zero is 0 K (-273.15°C)'
      },
      {
        id: 'r',
        name: 'Rankine',
        symbol: '°R',
        toBase: (v) => ((v - 491.67) * 5) / 9,
        fromBase: (v) => ((v + 273.15) * 9) / 5,
        description: 'Absolute Fahrenheit scale (0°R = -459.67°F)'
      }
    ],
    presets: [
      { label: '0°C (Freezing Point)', value: 0, fromUnit: 'c', toUnit: 'f', note: '0°C = 32°F = 273.15 K' },
      { label: '20°C (Room Temp)', value: 20, fromUnit: 'c', toUnit: 'f', note: '20°C = 68°F' },
      { label: '37°C (Human Body)', value: 37, fromUnit: 'c', toUnit: 'f', note: '37°C = 98.6°F' },
      { label: '100°C (Boiling Point)', value: 100, fromUnit: 'c', toUnit: 'f', note: '100°C = 212°F = 373.15 K' },
      { label: '72°F (Comfort Air)', value: 72, fromUnit: 'f', toUnit: 'c', note: '72°F = 22.2°C' },
      { label: '0 K (Absolute Zero)', value: 0, fromUnit: 'k', toUnit: 'c', note: '0 K = -273.15°C = -459.67°F' }
    ]
  },
  {
    id: 'area',
    name: 'Area',
    iconName: 'Grid',
    description: 'Square meters, hectares, acres, square kilometers, and square feet',
    baseUnitId: 'm2',
    units: [
      { id: 'mm2', name: 'Square Millimeter', symbol: 'mm²', ratio: 1e-6, description: '10⁻⁶ m²' },
      { id: 'cm2', name: 'Square Centimeter', symbol: 'cm²', ratio: 0.0001, description: '10⁻⁴ m²' },
      { id: 'm2', name: 'Square Meter', symbol: 'm²', ratio: 1, description: 'SI Base Unit' },
      { id: 'ha', name: 'Hectare', symbol: 'ha', ratio: 10000, description: '10,000 m² (100m × 100m)' },
      { id: 'km2', name: 'Square Kilometer', symbol: 'km²', ratio: 1000000, description: '100 hectares' },
      { id: 'in2', name: 'Square Inch', symbol: 'in²', ratio: 0.00064516, description: '6.4516 cm²' },
      { id: 'ft2', name: 'Square Foot', symbol: 'ft²', ratio: 0.09290304, description: '144 in²' },
      { id: 'yd2', name: 'Square Yard', symbol: 'yd²', ratio: 0.83612736, description: '9 ft²' },
      { id: 'ac', name: 'Acre', symbol: 'ac', ratio: 4046.8564224, description: '43,560 ft² (0.4047 ha)' },
      { id: 'mi2', name: 'Square Mile', symbol: 'mi²', ratio: 2589988.110336, description: '640 acres (2.59 km²)' }
    ],
    presets: [
      { label: '1 Hectare', value: 1, fromUnit: 'ha', toUnit: 'ac', note: '1 ha = 2.47105 acres' },
      { label: '1 Acre', value: 1, fromUnit: 'ac', toUnit: 'm2', note: '1 ac = 4,046.86 m²' },
      { label: '1 Square Meter', value: 1, fromUnit: 'm2', toUnit: 'ft2', note: '1 m² = 10.7639 ft²' },
      { label: '1 Square Kilometer', value: 1, fromUnit: 'km2', toUnit: 'ha', note: '1 km² = 100 ha' },
      { label: '1000 sq ft (Apartment)', value: 1000, fromUnit: 'ft2', toUnit: 'm2', note: '92.90 m²' }
    ]
  },
  {
    id: 'volume',
    name: 'Volume & Capacity',
    iconName: 'Beaker',
    description: 'Liters, milliliters, cubic meters, gallons, quarts, pints & cups',
    baseUnitId: 'l',
    units: [
      { id: 'ml', name: 'Milliliter (cm³ / cc)', symbol: 'mL', ratio: 0.001, description: '0.001 L = 1 cm³' },
      { id: 'cl', name: 'Centiliter', symbol: 'cL', ratio: 0.01, description: '10 mL' },
      { id: 'l', name: 'Liter', symbol: 'L', ratio: 1, description: '1 dm³ = 1,000 mL' },
      { id: 'm3', name: 'Cubic Meter', symbol: 'm³', ratio: 1000, description: '1,000 L' },
      { id: 'tsp', name: 'Teaspoon (US)', symbol: 'tsp', ratio: 0.00492892, description: '4.93 mL' },
      { id: 'tbsp', name: 'Tablespoon (US)', symbol: 'tbsp', ratio: 0.0147868, description: '3 tsp (14.79 mL)' },
      { id: 'floz', name: 'Fluid Ounce (US)', symbol: 'fl oz', ratio: 0.0295735295625, description: '29.57 mL' },
      { id: 'cup', name: 'Cup (US Customary)', symbol: 'cup', ratio: 0.2365882365, description: '8 fl oz (236.6 mL)' },
      { id: 'pt', name: 'Pint (US Liquid)', symbol: 'pt', ratio: 0.473176473, description: '2 cups (473.2 mL)' },
      { id: 'qt', name: 'Quart (US Liquid)', symbol: 'qt', ratio: 0.946352946, description: '2 pints (0.946 L)' },
      { id: 'gal_us', name: 'Gallon (US Liquid)', symbol: 'gal (US)', ratio: 3.785411784, description: '3.785 L (128 fl oz)' },
      { id: 'gal_uk', name: 'Gallon (Imperial)', symbol: 'gal (UK)', ratio: 4.54609, description: '4.546 L' }
    ],
    presets: [
      { label: '1 Liter', value: 1, fromUnit: 'l', toUnit: 'ml', note: '1 L = 1,000 mL' },
      { label: '1 US Gallon', value: 1, fromUnit: 'gal_us', toUnit: 'l', note: '1 gal = 3.78541 L' },
      { label: '1 Imperial Gallon', value: 1, fromUnit: 'gal_uk', toUnit: 'l', note: '1 gal (UK) = 4.54609 L' },
      { label: '1 US Pint', value: 1, fromUnit: 'pt', toUnit: 'ml', note: '1 pt = 473.18 mL' },
      { label: '1 Cup (Cooking)', value: 1, fromUnit: 'cup', toUnit: 'ml', note: '1 cup = 236.59 mL' },
      { label: '1 Cubic Meter (1 m³)', value: 1, fromUnit: 'm3', toUnit: 'l', note: '1 m³ = 1,000 L' }
    ]
  },
  {
    id: 'speed',
    name: 'Speed & Velocity',
    iconName: 'Gauge',
    description: 'Kilometers per hour, miles per hour, meters per second, knots',
    baseUnitId: 'mps',
    units: [
      { id: 'mps', name: 'Meter per second', symbol: 'm/s', ratio: 1, description: 'SI Base Unit' },
      { id: 'kph', name: 'Kilometer per hour', symbol: 'km/h', ratio: 1 / 3.6, description: '3.6 km/h = 1 m/s' },
      { id: 'mph', name: 'Mile per hour', symbol: 'mph', ratio: 0.44704, description: '1 mph = 1.609 km/h' },
      { id: 'kn', name: 'Knot (Nautical mi/h)', symbol: 'kn', ratio: 1852 / 3600, description: '1.852 km/h' },
      { id: 'fps', name: 'Foot per second', symbol: 'ft/s', ratio: 0.3048, description: '0.3048 m/s' },
      { id: 'mach', name: 'Mach (at sea level)', symbol: 'Mach', ratio: 340.29, description: 'Speed of sound (~340 m/s)' }
    ],
    presets: [
      { label: '100 km/h (Highway)', value: 100, fromUnit: 'kph', toUnit: 'mph', note: '100 km/h = 62.14 mph' },
      { label: '60 mph', value: 60, fromUnit: 'mph', toUnit: 'kph', note: '60 mph = 96.56 km/h' },
      { label: '30 m/s', value: 30, fromUnit: 'mps', toUnit: 'kph', note: '30 m/s = 108 km/h' },
      { label: '1 Knot (Aviation/Marine)', value: 1, fromUnit: 'kn', toUnit: 'kph', note: '1 kn = 1.852 km/h' },
      { label: 'Mach 1 (Speed of Sound)', value: 1, fromUnit: 'mach', toUnit: 'kph', note: 'Mach 1 = 1,225 km/h' }
    ]
  },
  {
    id: 'time',
    name: 'Time',
    iconName: 'Clock',
    description: 'Seconds, minutes, hours, days, weeks, months, years',
    baseUnitId: 's',
    units: [
      { id: 'ns', name: 'Nanosecond', symbol: 'ns', ratio: 1e-9, description: '10⁻⁹ s' },
      { id: 'us', name: 'Microsecond', symbol: 'µs', ratio: 1e-6, description: '10⁻⁶ s' },
      { id: 'ms', name: 'Millisecond', symbol: 'ms', ratio: 0.001, description: '0.001 s' },
      { id: 's', name: 'Second', symbol: 's', ratio: 1, description: 'SI Base Unit' },
      { id: 'min', name: 'Minute', symbol: 'min', ratio: 60, description: '60 seconds' },
      { id: 'h', name: 'Hour', symbol: 'h', ratio: 3600, description: '60 minutes = 3,600 s' },
      { id: 'd', name: 'Day', symbol: 'd', ratio: 86400, description: '24 hours = 86,400 s' },
      { id: 'wk', name: 'Week', symbol: 'wk', ratio: 604800, description: '7 days' },
      { id: 'mo', name: 'Month (Average)', symbol: 'mo', ratio: 2629800, description: '30.4375 days' },
      { id: 'yr', name: 'Year (Calendar)', symbol: 'yr', ratio: 31557600, description: '365.25 days' }
    ],
    presets: [
      { label: '1 Hour', value: 1, fromUnit: 'h', toUnit: 's', note: '1 h = 3,600 s' },
      { label: '1 Day', value: 1, fromUnit: 'd', toUnit: 'h', note: '1 d = 24 h = 1,440 min' },
      { label: '1 Week', value: 1, fromUnit: 'wk', toUnit: 'h', note: '1 wk = 168 hours' },
      { label: '1 Year', value: 1, fromUnit: 'yr', toUnit: 'd', note: '1 yr = 365.25 days' },
      { label: '1,000,000 Seconds', value: 1000000, fromUnit: 's', toUnit: 'd', note: '11.57 days' }
    ]
  },
  {
    id: 'pressure',
    name: 'Pressure',
    iconName: 'Compass',
    description: 'Pascals, bars, atmospheres, psi, and mmHg / Torr',
    baseUnitId: 'pa',
    units: [
      { id: 'pa', name: 'Pascal', symbol: 'Pa', ratio: 1, description: 'SI Base Unit (N/m²)' },
      { id: 'kpa', name: 'Kilopascal', symbol: 'kPa', ratio: 1000, description: '1,000 Pa' },
      { id: 'mpa', name: 'Megapascal', symbol: 'MPa', ratio: 1000000, description: '10⁶ Pa' },
      { id: 'bar', name: 'Bar', symbol: 'bar', ratio: 100000, description: '100,000 Pa' },
      { id: 'mbar', name: 'Millibar / hPa', symbol: 'mbar', ratio: 100, description: '100 Pa (1 hPa)' },
      { id: 'atm', name: 'Standard Atmosphere', symbol: 'atm', ratio: 101325, description: '101,325 Pa' },
      { id: 'psi', name: 'Pounds per sq inch', symbol: 'psi', ratio: 6894.757293168, description: '6,894.76 Pa' },
      { id: 'torr', name: 'Torr (mmHg)', symbol: 'mmHg', ratio: 133.322368421, description: '1/760 atm (133.32 Pa)' }
    ],
    presets: [
      { label: '1 Atmosphere (1 atm)', value: 1, fromUnit: 'atm', toUnit: 'kpa', note: '1 atm = 101.325 kPa' },
      { label: '1 Atmosphere in psi', value: 1, fromUnit: 'atm', toUnit: 'psi', note: '1 atm = 14.6959 psi' },
      { label: '32 psi (Car Tire)', value: 32, fromUnit: 'psi', toUnit: 'bar', note: '32 psi = 2.206 bar' },
      { label: '1 Bar', value: 1, fromUnit: 'bar', toUnit: 'kpa', note: '1 bar = 100 kPa' },
      { label: '760 mmHg', value: 760, fromUnit: 'torr', toUnit: 'atm', note: '760 mmHg = 1 atm' }
    ]
  },
  {
    id: 'energy',
    name: 'Energy & Work',
    iconName: 'Zap',
    description: 'Joules, calories, watt-hours, electron-volts & BTU',
    baseUnitId: 'j',
    units: [
      { id: 'j', name: 'Joule', symbol: 'J', ratio: 1, description: 'SI Base Unit (N·m)' },
      { id: 'kj', name: 'Kilojoule', symbol: 'kJ', ratio: 1000, description: '1,000 J' },
      { id: 'mj', name: 'Megajoule', symbol: 'MJ', ratio: 1000000, description: '10⁶ J' },
      { id: 'cal', name: 'Calorie (Thermochemical)', symbol: 'cal', ratio: 4.184, description: '4.184 J' },
      { id: 'kcal', name: 'Kilocalorie (Food Cal)', symbol: 'kcal', ratio: 4184, description: '1,000 cal = 4.184 kJ' },
      { id: 'wh', name: 'Watt-hour', symbol: 'Wh', ratio: 3600, description: '3,600 J' },
      { id: 'kwh', name: 'Kilowatt-hour', symbol: 'kWh', ratio: 3600000, description: '3.6 MJ (Electricity Unit)' },
      { id: 'ev', name: 'Electronvolt', symbol: 'eV', ratio: 1.602176634e-19, description: '1.602 × 10⁻¹⁹ J' },
      { id: 'btu', name: 'British Thermal Unit', symbol: 'BTU', ratio: 1055.05585262, description: '1,055.06 J' },
      { id: 'ftlb', name: 'Foot-pound', symbol: 'ft⋅lbf', ratio: 1.3558179483314, description: '1.3558 J' }
    ],
    presets: [
      { label: '1 kWh (Electricity)', value: 1, fromUnit: 'kwh', toUnit: 'mj', note: '1 kWh = 3.6 MJ' },
      { label: '2,000 kcal (Daily Diet)', value: 2000, fromUnit: 'kcal', toUnit: 'kj', note: '8,368 kJ' },
      { label: '1 Calorie', value: 1, fromUnit: 'cal', toUnit: 'j', note: '1 cal = 4.184 J' },
      { label: '1 BTU', value: 1, fromUnit: 'btu', toUnit: 'j', note: '1 BTU = 1,055.06 J' },
      { label: '1 eV', value: 1, fromUnit: 'ev', toUnit: 'j', note: '1 eV = 1.602 × 10⁻¹⁹ J' }
    ]
  },
  {
    id: 'power',
    name: 'Power',
    iconName: 'Flame',
    description: 'Watts, kilowatts, horsepower, and metric horsepower',
    baseUnitId: 'w',
    units: [
      { id: 'w', name: 'Watt', symbol: 'W', ratio: 1, description: 'SI Base Unit (J/s)' },
      { id: 'kw', name: 'Kilowatt', symbol: 'kW', ratio: 1000, description: '1,000 W' },
      { id: 'mw', name: 'Megawatt', symbol: 'MW', ratio: 1000000, description: '10⁶ W' },
      { id: 'hp', name: 'Mechanical Horsepower', symbol: 'hp', ratio: 745.69987158227022, description: '745.7 W (550 ft·lb/s)' },
      { id: 'ps', name: 'Metric Horsepower (PS)', symbol: 'PS', ratio: 735.49875, description: '735.5 W (Cavallo vapore)' },
      { id: 'btu_h', name: 'BTU per hour', symbol: 'BTU/h', ratio: 0.29307107, description: '0.293 W' }
    ],
    presets: [
      { label: '1 Horsepower (1 hp)', value: 1, fromUnit: 'hp', toUnit: 'w', note: '1 hp = 745.70 W' },
      { label: '1 Kilowatt (1 kW)', value: 1, fromUnit: 'kw', toUnit: 'hp', note: '1 kW = 1.341 hp' },
      { label: '100 hp (Car Engine)', value: 100, fromUnit: 'hp', toUnit: 'kw', note: '100 hp = 74.57 kW' },
      { label: '12,000 BTU/h (1 Ton AC)', value: 12000, fromUnit: 'btu_h', toUnit: 'kw', note: '3.517 kW cooling capacity' }
    ]
  },
  {
    id: 'digital',
    name: 'Digital Data & Storage',
    iconName: 'HardDrive',
    description: 'Bytes, Kilobytes, Megabytes, Gigabytes, Terabytes (Decimal & Binary)',
    baseUnitId: 'b',
    units: [
      { id: 'bit', name: 'Bit', symbol: 'b', ratio: 0.125, description: '1/8 Byte' },
      { id: 'b', name: 'Byte', symbol: 'B', ratio: 1, description: '8 bits' },
      { id: 'kb', name: 'Kilobyte (Decimal)', symbol: 'KB', ratio: 1000, description: '1,000 Bytes (10³)' },
      { id: 'mb', name: 'Megabyte (Decimal)', symbol: 'MB', ratio: 1000000, description: '10⁶ Bytes' },
      { id: 'gb', name: 'Gigabyte (Decimal)', symbol: 'GB', ratio: 1000000000, description: '10⁹ Bytes' },
      { id: 'tb', name: 'Terabyte (Decimal)', symbol: 'TB', ratio: 1000000000000, description: '10¹² Bytes' },
      { id: 'pb', name: 'Petabyte (Decimal)', symbol: 'PB', ratio: 1000000000000000, description: '10¹⁵ Bytes' },
      { id: 'kib', name: 'Kibibyte (Binary)', symbol: 'KiB', ratio: 1024, description: '1,024 Bytes (2¹⁰)' },
      { id: 'mib', name: 'Mebibyte (Binary)', symbol: 'MiB', ratio: 1048576, description: '1,024 KiB (2²⁰)' },
      { id: 'gib', name: 'Gibibyte (Binary)', symbol: 'GiB', ratio: 1073741824, description: '1,024 MiB (2³⁰)' },
      { id: 'tib', name: 'Tebibyte (Binary)', symbol: 'TiB', ratio: 1099511627776, description: '1,024 GiB (2⁴⁰)' }
    ],
    presets: [
      { label: '1 Gigabyte (1 GB)', value: 1, fromUnit: 'gb', toUnit: 'mb', note: '1 GB = 1,000 MB' },
      { label: '1 Gibibyte (1 GiB)', value: 1, fromUnit: 'gib', toUnit: 'mib', note: '1 GiB = 1,024 MiB' },
      { label: '1 Terabyte (1 TB)', value: 1, fromUnit: 'tb', toUnit: 'gb', note: '1 TB = 1,000 GB' },
      { label: '1 Byte', value: 1, fromUnit: 'b', toUnit: 'bit', note: '1 Byte = 8 bits' },
      { label: '500 GB Drive in GiB', value: 500, fromUnit: 'gb', toUnit: 'gib', note: '500 GB ≈ 465.66 GiB (usable OS size)' }
    ]
  },
  {
    id: 'angle',
    name: 'Angle',
    iconName: 'Compass',
    description: 'Degrees, Radians, Gradians, Arcminutes, Arcseconds & Revolutions',
    baseUnitId: 'deg',
    units: [
      { id: 'deg', name: 'Degree', symbol: '°', ratio: 1, description: '1/360 of a circle' },
      { id: 'rad', name: 'Radian', symbol: 'rad', ratio: 180 / Math.PI, description: '1 rad = 180° / π ≈ 57.2958°' },
      { id: 'grad', name: 'Gradian (Gon)', symbol: 'grad', ratio: 0.9, description: '1/400 of a circle (400 grad = 360°)' },
      { id: 'arcmin', name: 'Arcminute', symbol: '′', ratio: 1 / 60, description: '1/60 of a degree' },
      { id: 'arcsec', name: 'Arcsecond', symbol: '″', ratio: 1 / 3600, description: '1/3600 of a degree' },
      { id: 'rev', name: 'Revolution (Turn / Circle)', symbol: 'rev', ratio: 360, description: '1 full turn = 360° = 2π rad' }
    ],
    presets: [
      { label: '45°', value: 45, fromUnit: 'deg', toUnit: 'rad', note: '45° = π/4 rad (0.7854 rad)' },
      { label: '90° (Right Angle)', value: 90, fromUnit: 'deg', toUnit: 'rad', note: '90° = π/2 rad (1.5708 rad)' },
      { label: '180° (Straight Angle)', value: 180, fromUnit: 'deg', toUnit: 'rad', note: '180° = π rad (3.14159 rad)' },
      { label: '360° (Full Circle)', value: 360, fromUnit: 'deg', toUnit: 'rad', note: '360° = 2π rad (6.28318 rad)' },
      { label: '1 Radian', value: 1, fromUnit: 'rad', toUnit: 'deg', note: '1 rad ≈ 57.2958°' },
      { label: '100 Gradians', value: 100, fromUnit: 'grad', toUnit: 'deg', note: '100 grad = 90°' }
    ]
  }
];

export const formatConversionNumber = (num: number, maxDecimals = 8): string => {
  if (isNaN(num) || !isFinite(num)) return '0';
  if (num === 0) return '0';
  
  const abs = Math.abs(num);
  if (abs >= 1e10 || (abs < 1e-6 && abs > 0)) {
    return num.toExponential(6).replace(/e\+?/, 'e');
  }

  // Round smartly to maxDecimals without floating-point artifacts (e.g. 0.30000000000000004)
  const precisionNum = Number(num.toPrecision(10));
  const fixed = precisionNum.toFixed(maxDecimals);
  return fixed.replace(/\.?0+$/, '');
};

export interface ConversionResult {
  categoryId: string;
  categoryName: string;
  fromUnit: UnitDef;
  toUnit: UnitDef;
  inputValue: number;
  resultValue: number;
  formattedResult: string;
  formula: string;
  allConversions: Array<{
    unit: UnitDef;
    value: number;
    formatted: string;
    isCurrentTarget: boolean;
    isCurrentSource: boolean;
  }>;
}

export const executeUnitConversion = (
  categoryId: string,
  fromUnitId: string,
  toUnitId: string,
  value: number
): ConversionResult | null => {
  const category = UNIT_CATEGORIES.find((c) => c.id === categoryId) || UNIT_CATEGORIES[0];
  if (!category) return null;

  const fromUnit = category.units.find((u) => u.id === fromUnitId) || category.units[0];
  const toUnit = category.units.find((u) => u.id === toUnitId) || (category.units[1] || category.units[0]);

  // Convert input value to base unit
  let baseValue: number;
  if (fromUnit.toBase) {
    baseValue = fromUnit.toBase(value);
  } else if (fromUnit.ratio !== undefined) {
    baseValue = value * fromUnit.ratio;
  } else {
    baseValue = value;
  }

  // Convert base unit to target unit
  let targetValue: number;
  if (toUnit.fromBase) {
    targetValue = toUnit.fromBase(baseValue);
  } else if (toUnit.ratio !== undefined) {
    targetValue = baseValue / toUnit.ratio;
  } else {
    targetValue = baseValue;
  }

  // Generate formula explanation
  let formula = '';
  if (category.id === 'temperature') {
    if (fromUnit.id === 'c' && toUnit.id === 'f') formula = '°F = (°C × 9/5) + 32';
    else if (fromUnit.id === 'f' && toUnit.id === 'c') formula = '°C = (°F - 32) × 5/9';
    else if (fromUnit.id === 'c' && toUnit.id === 'k') formula = 'K = °C + 273.15';
    else if (fromUnit.id === 'k' && toUnit.id === 'c') formula = '°C = K - 273.15';
    else if (fromUnit.id === 'f' && toUnit.id === 'k') formula = 'K = (°F - 32) × 5/9 + 273.15';
    else if (fromUnit.id === 'k' && toUnit.id === 'f') formula = '°F = (K - 273.15) × 9/5 + 32';
    else formula = `${toUnit.name} = Conversion from ${fromUnit.name}`;
  } else if (fromUnit.ratio && toUnit.ratio) {
    const factor = fromUnit.ratio / toUnit.ratio;
    formula = `1 ${fromUnit.symbol} = ${formatConversionNumber(factor)} ${toUnit.symbol}`;
  } else {
    formula = `${toUnit.symbol} = direct unit transformation`;
  }

  // Compute all conversions in this category for live matrix comparison
  const allConversions = category.units.map((u) => {
    let uVal: number;
    if (u.fromBase) {
      uVal = u.fromBase(baseValue);
    } else if (u.ratio !== undefined) {
      uVal = baseValue / u.ratio;
    } else {
      uVal = baseValue;
    }

    return {
      unit: u,
      value: uVal,
      formatted: formatConversionNumber(uVal),
      isCurrentTarget: u.id === toUnit.id,
      isCurrentSource: u.id === fromUnit.id
    };
  });

  return {
    categoryId: category.id,
    categoryName: category.name,
    fromUnit,
    toUnit,
    inputValue: value,
    resultValue: targetValue,
    formattedResult: formatConversionNumber(targetValue),
    formula,
    allConversions
  };
};
