export type Currency = 'USD' | 'PEN';

export type PropertyType = 
  | 'departamento' 
  | 'casa' 
  | 'oficina' 
  | 'comercial' 
  | 'terreno';

export type FinancingMode = 'contado' | 'hipoteca';

export type RentalStrategyType = 'tradicional' | 'airbnb';

export interface InitialExpenseItem {
  id: string;
  name: string;
  amount: number; // in property's currency
  isCustom?: boolean;
}

export interface RecurringExpenseItem {
  id: string;
  name: string;
  amount: number; // in property's currency
  enabled: boolean;
}

export interface PropertyData {
  id: string;
  title: string;
  district: string;
  propertyType: PropertyType;
  areaM2: number;
  pricePending: boolean;
  purchasePrice: number; // in current currency
  currency: Currency;
  exchangeRate: number; // PEN per 1 USD (e.g. 3.75)
  downPaymentPct: number; // e.g. 20 (for 20%)

  // Peruvian Closing Costs (Paso 1)
  isFirstSaleConstructor: boolean; // Si es primera venta de constructora / bien futuro, está exonerado de Alcabala
  uitValuePen: number; // Valor UIT (ej. S/. 5,350)
  customAlcabala: number | null; // Si el usuario prefiere ingresar monto manual
  manualAlcabalaEnabled: boolean;
  notaryFee: number;
  notaryRatePct: number; // Porcentaje según ley/arancel peruano (ej. 0.3%)
  notaryUsePercentage: boolean;
  notaryIsUnknown: boolean;
  sunarpFee: number;
  sunarpRatePct: number;
  sunarpUsePercentage: boolean;
  sunarpIsUnknown: boolean;
  extraInitialExpenses: InitialExpenseItem[];

  // Financing (Paso 2)
  financingMode: FinancingMode;
  loanTermYears: number; // 5, 10, 15, 20, 25, 30
  teaPct: number; // Tasa Efectiva Anual (ej. 8.2%)
  desgravamenPctMonthly: number; // Seguro de desgravamen mensual (ej. 0.05%)
  propertyInsurancePctMonthly: number; // Seguro del inmueble mensual (ej. 0.025%)

  // Rental Strategy & Operating (Paso 3)
  rentalStrategy: RentalStrategyType;
  
  // Traditional rental
  traditionalRentMonthly: number;
  vacancyRatePct: number; // e.g. 6% (~0.7 meses vacante/año)

  // Short term / Airbnb
  airbnbPricePerNight: number;
  airbnbOccupancyPct: number; // e.g. 70%
  airbnbCleaningFeePerMonth: number;
  airbnbPlatformFeePct: number; // e.g. 3% host fee or 15%

  // Operating Expenses
  maintenanceFeeMonthly: number; // Mantenimiento edificio/condominio
  propertyTaxAndArbitriosMonthly: number; // Predial y arbitrios prorrateados
  repairsReservePct: number; // % sobre renta bruta para reserva de imprevistos (ej. 5%)
  managementFeePct: number; // % comisión administrador/property manager (ej. 0% - 15%)
  sunatFirstCatTaxEnabled: boolean; // Impuesto 5% Renta 1ra Categoría SUNAT
  utilitiesMonthly: number; // Luz, agua, internet (típico en Airbnb)
  customRecurringExpenses: RecurringExpenseItem[];

  createdAt: number;
  updatedAt: number;
}

export interface FinancialCalculationResult {
  currency: Currency;
  exchangeRate: number;
  purchasePrice: number;
  purchasePriceUsd: number;
  purchasePricePen: number;
  pricePerM2: number;

  // Paso 1: Inversión Inicial
  downPaymentAmount: number;
  loanAmount: number;
  alcabalaAmount: number;
  alcabalaExemptUitAmount: number; // Monto exonerado (10 UIT en moneda local)
  notaryAmount: number;
  sunarpAmount: number;
  extraInitialExpensesTotal: number;
  totalInitialExpenses: number; // Alcabala + Notaría + SUNARP + Extras
  totalInitialInvestmentRequired: number; // Cuota Inicial + Gastos de Cierre

  // Paso 2: Servicio de Deuda
  monthlyAmortizationAndInterest: number;
  monthlyDesgravamen: number;
  monthlyPropertyInsurance: number;
  totalMonthlyMortgagePayment: number;
  totalLoanInterestPaid: number;
  totalLoanPaid: number;

  // Paso 3: Ingresos y Gastos Operativos
  grossMonthlyIncome: number;
  vacancyLossMonthly: number;
  effectiveGrossMonthlyIncome: number; // Bruto - Vacancia
  grossAnnualIncome: number;
  effectiveGrossAnnualIncome: number;

  buildingMaintenanceMonthly: number;
  municipalTaxMonthly: number;
  repairsReserveMonthly: number;
  managementFeeMonthly: number;
  sunatTaxMonthly: number;
  utilitiesMonthly: number;
  extraRecurringMonthly: number;
  totalOperatingExpensesMonthly: number;
  totalOperatingExpensesAnnual: number;

  // Paso 4: Rentabilidad y Cash Flow
  netOperatingIncomeMonthly: number; // NOI = Ingreso Efectivo - Gastos Operativos (antes de hipoteca)
  netOperatingIncomeAnnual: number;
  netCashFlowMonthly: number; // Cash Flow = Ingreso Efectivo - Gastos Operativos - Cuota Hipoteca
  netCashFlowAnnual: number;

  capRatePct: number; // (NOI Anual / Precio Compra) * 100
  cashOnCashReturnPct: number; // (Cash Flow Anual / Inversión Inicial Total) * 100
  grossYieldPct: number; // (Ingreso Bruto Anual / Precio Compra) * 100
  paybackYears: number | null; // Inversión Inicial Total / Cash Flow Anual
  grossRentMultiplier: number; // Precio Compra / Ingreso Bruto Anual
  debtServiceCoverageRatio: number | null; // NOI Mensual / Cuota Hipoteca Mensual
  operatingExpenseRatioPct: number; // (Gastos Op / Ingreso Efectivo) * 100

  // Diagnóstico / Semáforo de Salud
  healthScore: {
    verdict: 'excelente' | 'bueno' | 'regular' | 'riesgoso' | 'deficit';
    score: number; // 0 a 100
    title: string;
    summary: string;
    checks: {
      id: string;
      label: string;
      passed: boolean;
      status: 'success' | 'warning' | 'danger';
      detail: string;
    }[];
    recommendations: string[];
  };
}

export interface SensitivityParams {
  rentVariationPct: number; // -30% a +30%
  vacancyRatePct: number; // 0% a 30%
  teaDeltaPct: number; // -3% a +3%
  purchasePriceDiscountPct: number; // -20% a +10%
}
