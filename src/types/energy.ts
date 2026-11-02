export type CurrencyCode = 'NGN' | 'USD' | 'KES' | 'ZAR' | 'GHS' | 'INR' | 'GBP';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  ratePerKWh: number; // local cost per kWh
  emergencyAdvanceAmount: number;
}

export interface UtilityProvider {
  id: string;
  name: string;
  shortCode: string;
  region: string;
  defaultFeeder: string;
  tariffBandSample: string;
}

export interface PaymentShortcut {
  provider: string;
  code: string;
  instruction: string;
}

export interface CountryProfile {
  id: string;
  name: string;
  flag: string;
  code: string;
  currency: CurrencyConfig;
  utilities: UtilityProvider[];
  defaultUtilityId: string;
  paymentShortcuts: PaymentShortcut[];
  outageReports: CommunityOutageReport[];
}

export interface NigeriaDisco {
  id: string;
  name: string;
  shortCode: string;
  coverage: string;
  feederSample: string;
}

export interface Appliance {
  id: string;
  name: string;
  category: 'cooling' | 'kitchen' | 'water' | 'entertainment' | 'health' | 'work';
  watts: number;
  dailyHours: number;
  isActive: boolean;
  priority: 'critical' | 'essential' | 'comfort' | 'luxury';
  healthLinked?: boolean;
}

export interface HealthSafeguard {
  enabled: boolean;
  medicalItem: string; // e.g. "Insulin Cold Chain", "CPAP Therapy", "Baby Formula Refrigeration", "Oxygen Concentrator"
  reserveKWh: number; // locked reserve buffer
  caregiverName: string;
  caregiverPhone: string;
  alertThresholdHours: number;
}

export interface MeterData {
  meterNumber: string;
  meterType: 'prepaid' | 'smart_sts' | 'solar_hybrid';
  provider: string; // e.g., "Ikeja Electric (IKEDC)", "Eko Electric (EKEDC)", "KPLC", "Eskom"
  currentUnitsKWh: number;
  totalCapacityKWh: number;
  lastUpdated: string;
  tariffBand: string; // e.g., "Band A (20+ hrs guaranteed)", "Band B", "Domestic"
  hourlyBurnRate: number; // kWh/hour based on active appliances
}

export interface CommunityOutageReport {
  id: string;
  neighborhood: string;
  area: string;
  status: 'outage' | 'restored' | 'generator_high_noise' | 'transformer_fault' | 'solar_hub_open';
  title: string;
  details: string;
  reportedMinutesAgo: number;
  upvotes: number;
  isOfficialFeederAlert?: boolean;
  hasSolarBeacon?: boolean; // offers free device charging to neighbors
}

export interface TopUpTransaction {
  id: string;
  timestamp: string;
  amount: number;
  kwhPurchased: number;
  token: string; // 20-digit STS token
  status: 'success' | 'pending';
  method: string;
  meterNumber: string;
}

export interface SafetyNetStatus {
  isEligible: boolean;
  creditLimitKWh: number;
  currentAdvanceKWh: number;
  hasActiveAdvance: boolean;
  dueDate: string;
  repaymentFeePercent: number; // 0% strictly transparent
}
