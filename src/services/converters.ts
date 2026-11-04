/**
 * Poran Smart Calculator - Unit & Currency Converter Service
 */

export interface UnitCategory {
  id: string;
  nameEn: string;
  nameBn: string;
  baseUnit: string;
  units: {
    id: string;
    nameEn: string;
    nameBn: string;
    symbol: string;
    toBase: (val: number) => number;
    fromBase: (val: number) => number;
  }[];
}

export const UNIT_CATEGORIES: UnitCategory[] = [
  {
    id: 'length',
    nameEn: 'Length',
    nameBn: 'দৈর্ঘ্য',
    baseUnit: 'm',
    units: [
      { id: 'km', nameEn: 'Kilometer', nameBn: 'কিলোমিটার', symbol: 'km', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      { id: 'm', nameEn: 'Meter', nameBn: 'মিটার', symbol: 'm', toBase: (v) => v, fromBase: (v) => v },
      { id: 'cm', nameEn: 'Centimeter', nameBn: 'সেন্টিমিটার', symbol: 'cm', toBase: (v) => v * 0.01, fromBase: (v) => v / 0.01 },
      { id: 'mm', nameEn: 'Millimeter', nameBn: 'মিলিমিটার', symbol: 'mm', toBase: (v) => v * 0.001, fromBase: (v) => v / 0.001 },
      { id: 'mi', nameEn: 'Mile', nameBn: 'মাইল', symbol: 'mi', toBase: (v) => v * 1609.344, fromBase: (v) => v / 1609.344 },
      { id: 'yd', nameEn: 'Yard', nameBn: 'গজ', symbol: 'yd', toBase: (v) => v * 0.9144, fromBase: (v) => v / 0.9144 },
      { id: 'ft', nameEn: 'Foot', nameBn: 'ফুট', symbol: 'ft', toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
      { id: 'in', nameEn: 'Inch', nameBn: 'ইঞ্চি', symbol: 'in', toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
    ],
  },
  {
    id: 'weight',
    nameEn: 'Weight & Mass',
    nameBn: 'ওজন ও ভর',
    baseUnit: 'kg',
    units: [
      { id: 'ton', nameEn: 'Metric Ton', nameBn: 'মেট্রিক টন', symbol: 't', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      { id: 'kg', nameEn: 'Kilogram', nameBn: 'কিলোগ্রাম', symbol: 'kg', toBase: (v) => v, fromBase: (v) => v },
      { id: 'g', nameEn: 'Gram', nameBn: 'গ্রাম', symbol: 'g', toBase: (v) => v * 0.001, fromBase: (v) => v / 0.001 },
      { id: 'mg', nameEn: 'Milligram', nameBn: 'মিলিগ্রাম', symbol: 'mg', toBase: (v) => v * 1e-6, fromBase: (v) => v / 1e-6 },
      { id: 'lb', nameEn: 'Pound', nameBn: 'পাউন্ড', symbol: 'lb', toBase: (v) => v * 0.45359237, fromBase: (v) => v / 0.45359237 },
      { id: 'oz', nameEn: 'Ounce', nameBn: 'আউন্স', symbol: 'oz', toBase: (v) => v * 0.0283495, fromBase: (v) => v / 0.0283495 },
    ],
  },
  {
    id: 'temperature',
    nameEn: 'Temperature',
    nameBn: 'তাপমাত্রা',
    baseUnit: 'C',
    units: [
      { id: 'C', nameEn: 'Celsius', nameBn: 'সেলসিয়াস', symbol: '°C', toBase: (v) => v, fromBase: (v) => v },
      { id: 'F', nameEn: 'Fahrenheit', nameBn: 'ফারেনহাইট', symbol: '°F', toBase: (v) => ((v - 32) * 5) / 9, fromBase: (v) => (v * 9) / 5 + 32 },
      { id: 'K', nameEn: 'Kelvin', nameBn: 'কেলভিন', symbol: 'K', toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
    ],
  },
  {
    id: 'area',
    nameEn: 'Area',
    nameBn: 'ক্ষেত্রফল',
    baseUnit: 'sqm',
    units: [
      { id: 'sqm', nameEn: 'Square Meter', nameBn: 'বর্গমিটার', symbol: 'm²', toBase: (v) => v, fromBase: (v) => v },
      { id: 'sqkm', nameEn: 'Square Km', nameBn: 'বর্গকিলোমিটার', symbol: 'km²', toBase: (v) => v * 1e6, fromBase: (v) => v / 1e6 },
      { id: 'sqft', nameEn: 'Square Foot', nameBn: 'বর্গফুট', symbol: 'ft²', toBase: (v) => v * 0.092903, fromBase: (v) => v / 0.092903 },
      { id: 'acre', nameEn: 'Acre', nameBn: 'একর', symbol: 'ac', toBase: (v) => v * 4046.86, fromBase: (v) => v / 4046.86 },
      { id: 'hectare', nameEn: 'Hectare', nameBn: 'হেক্টর', symbol: 'ha', toBase: (v) => v * 10000, fromBase: (v) => v / 10000 },
      { id: 'bigha', nameEn: 'Bigha (BD)', nameBn: 'বিঘা', symbol: 'bigha', toBase: (v) => v * 1337.8, fromBase: (v) => v / 1337.8 },
    ],
  },
  {
    id: 'speed',
    nameEn: 'Speed',
    nameBn: 'গতিবেগ',
    baseUnit: 'mps',
    units: [
      { id: 'kmh', nameEn: 'Km per Hour', nameBn: 'কিমি/ঘণ্টা', symbol: 'km/h', toBase: (v) => v / 3.6, fromBase: (v) => v * 3.6 },
      { id: 'mps', nameEn: 'Meters per Sec', nameBn: 'মিটার/সেকেন্ড', symbol: 'm/s', toBase: (v) => v, fromBase: (v) => v },
      { id: 'mph', nameEn: 'Miles per Hour', nameBn: 'মাইল/ঘণ্টা', symbol: 'mph', toBase: (v) => v * 0.44704, fromBase: (v) => v / 0.44704 },
      { id: 'knot', nameEn: 'Knot', nameBn: 'নট', symbol: 'kn', toBase: (v) => v * 0.514444, fromBase: (v) => v / 0.514444 },
    ],
  },
  {
    id: 'digital',
    nameEn: 'Data Storage',
    nameBn: 'ডাটা স্টোরেজ',
    baseUnit: 'MB',
    units: [
      { id: 'B', nameEn: 'Byte', nameBn: 'বাইট', symbol: 'B', toBase: (v) => v / (1024 * 1024), fromBase: (v) => v * (1024 * 1024) },
      { id: 'KB', nameEn: 'Kilobyte', nameBn: 'কিলোবাইট', symbol: 'KB', toBase: (v) => v / 1024, fromBase: (v) => v * 1024 },
      { id: 'MB', nameEn: 'Megabyte', nameBn: 'মেগাবাইট', symbol: 'MB', toBase: (v) => v, fromBase: (v) => v },
      { id: 'GB', nameEn: 'Gigabyte', nameBn: 'গিগাবাইট', symbol: 'GB', toBase: (v) => v * 1024, fromBase: (v) => v / 1024 },
      { id: 'TB', nameEn: 'Terabyte', nameBn: 'টেরাবাইট', symbol: 'TB', toBase: (v) => v * 1024 * 1024, fromBase: (v) => v / (1024 * 1024) },
    ],
  },
];

export interface CurrencyItem {
  code: string;
  nameEn: string;
  nameBn: string;
  symbol: string;
  ratePerUSD: number; // USD is base = 1.0
}

export const INITIAL_CURRENCIES: CurrencyItem[] = [
  { code: 'USD', nameEn: 'US Dollar', nameBn: 'মার্কিন ডলার', symbol: '$', ratePerUSD: 1.0 },
  { code: 'BDT', nameEn: 'Bangladeshi Taka', nameBn: 'বাংলাদেশী টাকা', symbol: '৳', ratePerUSD: 122.50 },
  { code: 'EUR', nameEn: 'Euro', nameBn: 'ইউরো', symbol: '€', ratePerUSD: 0.92 },
  { code: 'GBP', nameEn: 'British Pound', nameBn: 'ব্রিটিশ পাউন্ড', symbol: '£', ratePerUSD: 0.79 },
  { code: 'INR', nameEn: 'Indian Rupee', nameBn: 'ভারতীয় রুপি', symbol: '₹', ratePerUSD: 86.40 },
  { code: 'SAR', nameEn: 'Saudi Riyal', nameBn: 'সৌদি রিয়াল', symbol: '﷼', ratePerUSD: 3.75 },
  { code: 'AED', nameEn: 'UAE Dirham', nameBn: 'আমিরাত দিরহাম', symbol: 'د.إ', ratePerUSD: 3.67 },
  { code: 'CAD', nameEn: 'Canadian Dollar', nameBn: 'কানাডিয়ান ডলার', symbol: 'C$', ratePerUSD: 1.41 },
  { code: 'AUD', nameEn: 'Australian Dollar', nameBn: 'অস্ট্রেলিয়ান ডলার', symbol: 'A$', ratePerUSD: 1.56 },
  { code: 'JPY', nameEn: 'Japanese Yen', nameBn: 'জাপানি ইয়েন', symbol: '¥', ratePerUSD: 154.20 },
  { code: 'CNY', nameEn: 'Chinese Yuan', nameBn: 'চাইনিজ ইউয়ান', symbol: '¥', ratePerUSD: 7.24 },
  { code: 'SGD', nameEn: 'Singapore Dollar', nameBn: 'সিঙ্গাপুর ডলার', symbol: 'S$', ratePerUSD: 1.35 },
  { code: 'MYR', nameEn: 'Malaysian Ringgit', nameBn: 'মালয়েশিয়ান রিঙ্গিত', symbol: 'RM', ratePerUSD: 4.45 },
];

export function convertUnits(
  categoryId: string,
  fromUnitId: string,
  toUnitId: string,
  value: number
): { result: number; formatted: string } {
  const cat = UNIT_CATEGORIES.find((c) => c.id === categoryId);
  if (!cat) return { result: value, formatted: String(value) };

  const from = cat.units.find((u) => u.id === fromUnitId);
  const to = cat.units.find((u) => u.id === toUnitId);

  if (!from || !to) return { result: value, formatted: String(value) };

  const base = from.toBase(value);
  const final = to.fromBase(base);
  const rounded = Number(final.toPrecision(8));

  return {
    result: rounded,
    formatted: rounded.toString(),
  };
}

export function convertCurrency(
  fromCode: string,
  toCode: string,
  amount: number,
  currencyList: CurrencyItem[] = INITIAL_CURRENCIES
): { result: number; formatted: string; rate: number } {
  const from = currencyList.find((c) => c.code === fromCode) || currencyList[0];
  const to = currencyList.find((c) => c.code === toCode) || currencyList[1];

  // from USD base: 1 USD = from.ratePerUSD => amount in USD = amount / from.ratePerUSD
  // result in target = amountInUSD * to.ratePerUSD
  const amountInUSD = amount / from.ratePerUSD;
  const result = amountInUSD * to.ratePerUSD;
  const unitRate = to.ratePerUSD / from.ratePerUSD;

  return {
    result: Number(result.toFixed(4)),
    formatted: result.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 }),
    rate: unitRate,
  };
}
