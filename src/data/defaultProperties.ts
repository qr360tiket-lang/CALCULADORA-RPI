import { PropertyData } from '../types/realEstate';

export function createCleanBlankProperty(): PropertyData {
  return {
    id: `prop-clean-${Date.now()}`,
    title: '',
    district: '',
    propertyType: 'departamento',
    areaM2: 0,
    pricePending: false,
    purchasePrice: 0,
    currency: 'PEN',
    exchangeRate: 3.75,
    downPaymentPct: 20,
    isFirstSaleConstructor: false,
    uitValuePen: 5350,
    customAlcabala: null,
    manualAlcabalaEnabled: false,
    notaryFee: 0,
    notaryRatePct: 0.3,
    notaryUsePercentage: true,
    notaryIsUnknown: false,
    sunarpFee: 0,
    sunarpRatePct: 0.2,
    sunarpUsePercentage: false,
    sunarpIsUnknown: false,
    extraInitialExpenses: [],
    financingMode: 'hipoteca',
    loanTermYears: 20,
    teaPct: 8.5,
    desgravamenPctMonthly: 0.052,
    propertyInsurancePctMonthly: 0.025,
    rentalStrategy: 'tradicional',
    traditionalRentMonthly: 0,
    vacancyRatePct: 6,
    airbnbPricePerNight: 0,
    airbnbOccupancyPct: 70,
    airbnbCleaningFeePerMonth: 0,
    airbnbPlatformFeePct: 3,
    maintenanceFeeMonthly: 0,
    propertyTaxAndArbitriosMonthly: 0,
    repairsReservePct: 5,
    managementFeePct: 0,
    sunatFirstCatTaxEnabled: true,
    utilitiesMonthly: 0,
    customRecurringExpenses: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

export const SAMPLE_FICTITIOUS_PROPERTY: PropertyData = {
  id: 'proyecto-salaverry-sample',
  title: 'proyecto salaverry',
  district: 'jesus maria',
  propertyType: 'departamento',
  areaM2: 72,
  pricePending: false,
  purchasePrice: 385000,
  currency: 'PEN',
  exchangeRate: 3.75,
  downPaymentPct: 20,
  isFirstSaleConstructor: false,
  uitValuePen: 5350,
  customAlcabala: null,
  manualAlcabalaEnabled: false,
  notaryFee: 1155,
  notaryRatePct: 0.3,
  notaryUsePercentage: true,
  notaryIsUnknown: false,
  sunarpFee: 920,
  sunarpRatePct: 0.2,
  sunarpUsePercentage: false,
  sunarpIsUnknown: false,
  extraInitialExpenses: [
    { id: 'extra-gas', name: 'Conexión Gas Natural Cálidda', amount: 800, isCustom: true }
  ],
  financingMode: 'hipoteca',
  loanTermYears: 20,
  teaPct: 8.2,
  desgravamenPctMonthly: 0.052,
  propertyInsurancePctMonthly: 0.025,
  rentalStrategy: 'tradicional',
  traditionalRentMonthly: 2350,
  vacancyRatePct: 6,
  airbnbPricePerNight: 140,
  airbnbOccupancyPct: 68,
  airbnbCleaningFeePerMonth: 200,
  airbnbPlatformFeePct: 3,
  maintenanceFeeMonthly: 230,
  propertyTaxAndArbitriosMonthly: 95,
  repairsReservePct: 5,
  managementFeePct: 0,
  sunatFirstCatTaxEnabled: true,
  utilitiesMonthly: 0,
  customRecurringExpenses: [],
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

export const INITIAL_CLEAN_PROPERTY: PropertyData = {
  id: 'mi-propiedad-limpia',
  title: '',
  district: '',
  propertyType: 'departamento',
  areaM2: 0,
  pricePending: false,
  purchasePrice: 0,
  currency: 'PEN',
  exchangeRate: 3.75,
  downPaymentPct: 20,
  isFirstSaleConstructor: false,
  uitValuePen: 5350,
  customAlcabala: null,
  manualAlcabalaEnabled: false,
  notaryFee: 0,
  notaryRatePct: 0.3,
  notaryUsePercentage: true,
  notaryIsUnknown: false,
  sunarpFee: 0,
  sunarpRatePct: 0.2,
  sunarpUsePercentage: false,
  sunarpIsUnknown: false,
  extraInitialExpenses: [],
  financingMode: 'hipoteca',
  loanTermYears: 20,
  teaPct: 8.5,
  desgravamenPctMonthly: 0.052,
  propertyInsurancePctMonthly: 0.025,
  rentalStrategy: 'tradicional',
  traditionalRentMonthly: 0,
  vacancyRatePct: 6,
  airbnbPricePerNight: 0,
  airbnbOccupancyPct: 70,
  airbnbCleaningFeePerMonth: 0,
  airbnbPlatformFeePct: 3,
  maintenanceFeeMonthly: 0,
  propertyTaxAndArbitriosMonthly: 0,
  repairsReservePct: 5,
  managementFeePct: 0,
  sunatFirstCatTaxEnabled: true,
  utilitiesMonthly: 0,
  customRecurringExpenses: [],
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

export const DEFAULT_PROPERTIES: PropertyData[] = [
  INITIAL_CLEAN_PROPERTY,
  SAMPLE_FICTITIOUS_PROPERTY,
  {
    id: 'miraflores-tradicional-2dorm',
    title: 'Depa 2 dorm Miraflores (Renta Tradicional)',
    district: 'Miraflores',
    propertyType: 'departamento',
    areaM2: 68,
    pricePending: false,
    purchasePrice: 148000,
    currency: 'USD',
    exchangeRate: 3.75,
    downPaymentPct: 20,
    isFirstSaleConstructor: false,
    uitValuePen: 5350,
    customAlcabala: null,
    manualAlcabalaEnabled: false,
    notaryFee: 420,
    notaryRatePct: 0.3,
    notaryUsePercentage: true,
    notaryIsUnknown: false,
    sunarpFee: 370,
    sunarpRatePct: 0.2,
    sunarpUsePercentage: false,
    sunarpIsUnknown: false,
    extraInitialExpenses: [
      { id: 'extra-1', name: 'Pintura y arreglos menores', amount: 800, isCustom: true },
      { id: 'extra-2', name: 'Tasación bancaria', amount: 180, isCustom: true },
    ],
    financingMode: 'hipoteca',
    loanTermYears: 20,
    teaPct: 7.9,
    desgravamenPctMonthly: 0.052,
    propertyInsurancePctMonthly: 0.024,
    rentalStrategy: 'tradicional',
    traditionalRentMonthly: 880,
    vacancyRatePct: 6, // ~0.7 meses al año
    airbnbPricePerNight: 55,
    airbnbOccupancyPct: 70,
    airbnbCleaningFeePerMonth: 80,
    airbnbPlatformFeePct: 3,
    maintenanceFeeMonthly: 85,
    propertyTaxAndArbitriosMonthly: 35,
    repairsReservePct: 5,
    managementFeePct: 0,
    sunatFirstCatTaxEnabled: true,
    utilitiesMonthly: 0,
    customRecurringExpenses: [],
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now() - 86400000,
  },
  {
    id: 'barranco-airbnb-studio',
    title: 'Studio Boutique Barranco (Airbnb)',
    district: 'Barranco',
    propertyType: 'departamento',
    areaM2: 40,
    pricePending: false,
    purchasePrice: 108000,
    currency: 'USD',
    exchangeRate: 3.75,
    downPaymentPct: 25,
    isFirstSaleConstructor: true, // Estreno: Sin Alcabala
    uitValuePen: 5350,
    customAlcabala: null,
    manualAlcabalaEnabled: false,
    notaryFee: 380,
    notaryRatePct: 0.3,
    notaryUsePercentage: true,
    notaryIsUnknown: false,
    sunarpFee: 290,
    sunarpRatePct: 0.2,
    sunarpUsePercentage: false,
    sunarpIsUnknown: false,
    extraInitialExpenses: [
      { id: 'airbnb-furnish', name: 'Amoblado full & deco Airbnb', amount: 4500, isCustom: true },
      { id: 'smart-lock', name: 'Cerradura inteligente digital', amount: 200, isCustom: true },
    ],
    financingMode: 'hipoteca',
    loanTermYears: 20,
    teaPct: 8.1,
    desgravamenPctMonthly: 0.052,
    propertyInsurancePctMonthly: 0.024,
    rentalStrategy: 'airbnb',
    traditionalRentMonthly: 650,
    vacancyRatePct: 5,
    airbnbPricePerNight: 52,
    airbnbOccupancyPct: 74,
    airbnbCleaningFeePerMonth: 120,
    airbnbPlatformFeePct: 3,
    maintenanceFeeMonthly: 70,
    propertyTaxAndArbitriosMonthly: 25,
    repairsReservePct: 5,
    managementFeePct: 15, // Co-anfitrión / Property Manager
    sunatFirstCatTaxEnabled: true,
    utilitiesMonthly: 85, // Luz, internet alta velocidad, agua
    customRecurringExpenses: [],
    createdAt: Date.now() - 43200000,
    updatedAt: Date.now() - 43200000,
  },
  {
    id: 'jesus-maria-familiar-pen',
    title: 'Depa 3 dorm Jesús María (Soles - Crédito BCP)',
    district: 'Jesús María',
    propertyType: 'departamento',
    areaM2: 76,
    pricePending: false,
    purchasePrice: 420000,
    currency: 'PEN',
    exchangeRate: 3.75,
    downPaymentPct: 15,
    isFirstSaleConstructor: false,
    uitValuePen: 5350,
    customAlcabala: null,
    manualAlcabalaEnabled: false,
    notaryFee: 1260,
    notaryRatePct: 0.3,
    notaryUsePercentage: true,
    notaryIsUnknown: false,
    sunarpFee: 1100,
    sunarpRatePct: 0.2,
    sunarpUsePercentage: false,
    sunarpIsUnknown: false,
    extraInitialExpenses: [
      { id: 'gas-natural', name: 'Habilitación de Cálidda (Gas)', amount: 650, isCustom: true },
    ],
    financingMode: 'hipoteca',
    loanTermYears: 25,
    teaPct: 8.6,
    desgravamenPctMonthly: 0.055,
    propertyInsurancePctMonthly: 0.025,
    rentalStrategy: 'tradicional',
    traditionalRentMonthly: 2450,
    vacancyRatePct: 6,
    airbnbPricePerNight: 160,
    airbnbOccupancyPct: 65,
    airbnbCleaningFeePerMonth: 250,
    airbnbPlatformFeePct: 3,
    maintenanceFeeMonthly: 260,
    propertyTaxAndArbitriosMonthly: 110,
    repairsReservePct: 5,
    managementFeePct: 0,
    sunatFirstCatTaxEnabled: true,
    utilitiesMonthly: 0,
    customRecurringExpenses: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

const STORAGE_KEY = 'calculadora_inmobiliaria_peru_properties_v2';
const ACTIVE_PROP_KEY = 'calculadora_inmobiliaria_peru_active_id_v2';

export function loadSavedProperties(): PropertyData[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROPERTIES;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (e) {
    console.error('Error loading properties from storage:', e);
  }
  return DEFAULT_PROPERTIES;
}

export function savePropertiesToStorage(properties: PropertyData[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(properties));
  } catch (e) {
    console.error('Error saving properties to storage:', e);
  }
}

export function getActivePropertyId(): string {
  try {
    const id = localStorage.getItem(ACTIVE_PROP_KEY);
    if (id) return id;
  } catch (e) {
    console.error(e);
  }
  return DEFAULT_PROPERTIES[0].id;
}

export function setActivePropertyId(id: string) {
  try {
    localStorage.setItem(ACTIVE_PROP_KEY, id);
  } catch (e) {
    console.error(e);
  }
}
