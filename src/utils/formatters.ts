import { CurrencyConfig, CurrencyCode } from '../types/energy';

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  NGN: {
    code: 'NGN',
    symbol: '₦',
    name: 'Nigerian Naira',
    ratePerKWh: 206.8, // Band A rate approx N206/kWh
    emergencyAdvanceAmount: 2500,
  },
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    ratePerKWh: 0.17,
    emergencyAdvanceAmount: 5,
  },
  KES: {
    code: 'KES',
    symbol: 'KSh',
    name: 'Kenyan Shilling',
    ratePerKWh: 32.5,
    emergencyAdvanceAmount: 400,
  },
  ZAR: {
    code: 'ZAR',
    symbol: 'R',
    name: 'South African Rand',
    ratePerKWh: 3.45,
    emergencyAdvanceAmount: 60,
  },
  GHS: {
    code: 'GHS',
    symbol: 'GH₵',
    name: 'Ghanaian Cedi',
    ratePerKWh: 1.85,
    emergencyAdvanceAmount: 35,
  },
  INR: {
    code: 'INR',
    symbol: '₹',
    name: 'Indian Rupee',
    ratePerKWh: 8.5,
    emergencyAdvanceAmount: 180,
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    ratePerKWh: 0.26,
    emergencyAdvanceAmount: 5,
  },
};

export function formatCurrency(amount: number, currency: CurrencyConfig): string {
  return `${currency.symbol}${amount.toLocaleString('en-US', {
    minimumFractionDigits: amount < 10 && currency.code === 'USD' ? 2 : 0,
    maximumFractionDigits: 2,
  })}`;
}

export function formatSTS(token: string): string {
  // 20 digits formatted into 4-digit blocks: "XXXX XXXX XXXX XXXX XXXX"
  const cleaned = token.replace(/\D/g, '');
  const chunks = cleaned.match(/.{1,4}/g);
  return chunks ? chunks.join(' ') : token;
}

export function generateRandomSTSToken(): string {
  let token = '';
  for (let i = 0; i < 20; i++) {
    token += Math.floor(Math.random() * 10).toString();
  }
  return token;
}

export function calculateTimeRemaining(unitsKWh: number, burnRateKWhPerHour: number): {
  totalHours: number;
  days: number;
  hours: number;
  minutes: number;
  estimatedExpiryDate: Date;
  urgency: 'critical' | 'warning' | 'comfortable';
} {
  const safeBurnRate = Math.max(burnRateKWhPerHour, 0.05); // prevent divide by zero
  const totalHours = unitsKWh / safeBurnRate;
  const days = Math.floor(totalHours / 24);
  const remainingHours = Math.floor(totalHours % 24);
  const minutes = Math.floor((totalHours * 60) % 60);

  const now = new Date();
  const estimatedExpiryDate = new Date(now.getTime() + totalHours * 60 * 60 * 1000);

  let urgency: 'critical' | 'warning' | 'comfortable' = 'comfortable';
  if (totalHours <= 12) {
    urgency = 'critical';
  } else if (totalHours <= 36) {
    urgency = 'warning';
  }

  return {
    totalHours,
    days,
    hours: remainingHours,
    minutes,
    estimatedExpiryDate,
    urgency,
  };
}
