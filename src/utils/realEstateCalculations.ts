import { 
  PropertyData, 
  FinancialCalculationResult, 
  SensitivityParams 
} from '../types/realEstate';

/**
 * Calcula el impuesto de Alcabala según la Ley de Tributación Municipal del Perú:
 * - Base imponible: Precio de compra menos las primeras 10 UIT inafectas.
 * - Tasa: 3% sobre el exceso.
 * - Exonerado si es primera venta realizada por el constructor (inmueble de estreno).
 */
export function calculateAlcabala(
  purchasePrice: number,
  currency: 'USD' | 'PEN',
  exchangeRate: number,
  uitValuePen: number = 5500,
  isFirstSaleConstructor: boolean = false,
  manualAlcabala: number | null = null,
  manualEnabled: boolean = false
): { alcabalaAmount: number; exemptUitAmountInCurrency: number } {
  if (manualEnabled && manualAlcabala !== null && !isNaN(manualAlcabala)) {
    return {
      alcabalaAmount: Math.max(0, manualAlcabala),
      exemptUitAmountInCurrency: (10 * uitValuePen) / (currency === 'USD' ? exchangeRate : 1),
    };
  }

  // Si es primera venta del constructor, la Alcabala es S/. 0
  if (isFirstSaleConstructor || purchasePrice <= 0) {
    const exemptInCur = (10 * uitValuePen) / (currency === 'USD' ? exchangeRate : 1);
    return { alcabalaAmount: 0, exemptUitAmountInCurrency: exemptInCur };
  }

  // Convertir precio a PEN para comparar con las 10 UIT
  const priceInPen = currency === 'PEN' ? purchasePrice : purchasePrice * exchangeRate;
  const exempt10UitPen = 10 * uitValuePen;

  // Monto imponible
  const taxableSurplusPen = Math.max(0, priceInPen - exempt10UitPen);
  const alcabalaPen = taxableSurplusPen * 0.03;

  // Convertir de regreso a la moneda de la propiedad
  const alcabalaInCurrency = currency === 'PEN' ? alcabalaPen : alcabalaPen / exchangeRate;
  const exemptInCur = currency === 'PEN' ? exempt10UitPen : exempt10UitPen / exchangeRate;

  return {
    alcabalaAmount: Math.round(alcabalaInCurrency * 100) / 100,
    exemptUitAmountInCurrency: Math.round(exemptInCur * 100) / 100,
  };
}

/**
 * Calcula la cuota mensual de crédito hipotecario según el sistema francés:
 * Tasa Efectiva Mensual (TEM) = (1 + TEA)^(1/12) - 1
 * Cuota = Capital * [TEM * (1 + TEM)^n] / [(1 + TEM)^n - 1]
 */
export function calculateFrenchMortgage(
  principal: number,
  teaPct: number,
  years: number
): {
  monthlyAmortizationAndInterest: number;
  totalInterestPaid: number;
  totalPaid: number;
} {
  if (principal <= 0 || years <= 0 || teaPct <= 0) {
    return {
      monthlyAmortizationAndInterest: 0,
      totalInterestPaid: 0,
      totalPaid: principal,
    };
  }

  const tea = teaPct / 100;
  // Tasa efectiva mensual en el sistema financiero peruano
  const tem = Math.pow(1 + tea, 1 / 12) - 1;
  const n = Math.round(years * 12);

  const factor = Math.pow(1 + tem, n);
  const monthlyPayment = principal * ((tem * factor) / (factor - 1));

  const totalPaid = monthlyPayment * n;
  const totalInterestPaid = Math.max(0, totalPaid - principal);

  return {
    monthlyAmortizationAndInterest: Math.round(monthlyPayment * 100) / 100,
    totalInterestPaid: Math.round(totalInterestPaid * 100) / 100,
    totalPaid: Math.round(totalPaid * 100) / 100,
  };
}

/**
 * Estimación automática de gastos de Notaría y Registros Públicos (SUNARP)
 * cuando el usuario los desconoce.
 */
export function estimateNotaryFee(price: number, currency: 'USD' | 'PEN', exchangeRate: number): number {
  // En Perú, una notaría para compraventa inmobiliaria típica ronda S/. 1,500 - S/. 2,200
  const feeInPen = 1600;
  return currency === 'PEN' ? feeInPen : Math.round((feeInPen / exchangeRate) * 100) / 100;
}

export function estimateSunarpFee(price: number, currency: 'USD' | 'PEN', exchangeRate: number): number {
  // SUNARP cobra aproximadamente 1.5 a 3 por mil del valor de transferencia + derechos de calificación (típico S/. 1,200 - S/. 1,800)
  const priceInPen = currency === 'PEN' ? price : price * exchangeRate;
  const feeInPen = Math.min(3000, Math.max(850, priceInPen * 0.0025));
  return currency === 'PEN' ? Math.round(feeInPen) : Math.round((feeInPen / exchangeRate) * 100) / 100;
}

/**
 * Orquestador principal de cálculos inmobiliarios y financieros
 */
export function calculateRealEstateMetrics(
  property: PropertyData,
  sensitivity?: SensitivityParams
): FinancialCalculationResult {
  const {
    currency,
    exchangeRate,
    purchasePrice: rawPurchasePrice,
    areaM2,
    downPaymentPct,
    isFirstSaleConstructor,
    uitValuePen,
    manualAlcabalaEnabled,
    customAlcabala,
    notaryFee,
    notaryRatePct = 0.3,
    notaryUsePercentage = true,
    notaryIsUnknown,
    sunarpFee,
    sunarpRatePct = 0.2,
    sunarpUsePercentage = false,
    sunarpIsUnknown,
    extraInitialExpenses,
    financingMode,
    loanTermYears,
    teaPct,
    desgravamenPctMonthly,
    propertyInsurancePctMonthly,
    rentalStrategy,
    traditionalRentMonthly: rawTraditionalRent,
    vacancyRatePct: rawVacancyRate,
    airbnbPricePerNight,
    airbnbOccupancyPct: rawAirbnbOccupancy,
    airbnbCleaningFeePerMonth,
    airbnbPlatformFeePct,
    maintenanceFeeMonthly,
    propertyTaxAndArbitriosMonthly,
    repairsReservePct,
    managementFeePct,
    sunatFirstCatTaxEnabled,
    utilitiesMonthly,
    customRecurringExpenses,
  } = property;

  // Aplicar sensibilidad si existe
  let purchasePrice = rawPurchasePrice;
  if (sensitivity && sensitivity.purchasePriceDiscountPct !== 0) {
    purchasePrice = Math.max(0, purchasePrice * (1 + sensitivity.purchasePriceDiscountPct / 100));
  }

  // Precios en ambas monedas
  const purchasePriceUsd = currency === 'USD' ? purchasePrice : purchasePrice / exchangeRate;
  const purchasePricePen = currency === 'PEN' ? purchasePrice : purchasePrice * exchangeRate;
  const pricePerM2 = areaM2 > 0 ? Math.round((purchasePrice / areaM2) * 100) / 100 : 0;

  // Cuota inicial y préstamo
  const downPaymentAmount = Math.round(purchasePrice * (downPaymentPct / 100) * 100) / 100;
  const loanAmount = Math.max(0, Math.round((purchasePrice - downPaymentAmount) * 100) / 100);

  // Gastos iniciales
  const { alcabalaAmount, exemptUitAmountInCurrency } = calculateAlcabala(
    purchasePrice,
    currency,
    exchangeRate,
    uitValuePen,
    isFirstSaleConstructor,
    customAlcabala,
    manualAlcabalaEnabled
  );

  const notaryAmount = notaryIsUnknown 
    ? estimateNotaryFee(purchasePrice, currency, exchangeRate) 
    : notaryUsePercentage 
      ? Math.round(purchasePrice * ((notaryRatePct || 0.3) / 100) * 100) / 100
      : (notaryFee || 0);

  const sunarpAmount = sunarpIsUnknown 
    ? estimateSunarpFee(purchasePrice, currency, exchangeRate) 
    : sunarpUsePercentage 
      ? Math.round(purchasePrice * ((sunarpRatePct || 0.2) / 100) * 100) / 100
      : (sunarpFee || 0);

  const extraInitialExpensesTotal = extraInitialExpenses.reduce((sum, item) => sum + (item.amount || 0), 0);

  const totalInitialExpenses = Math.round((alcabalaAmount + notaryAmount + sunarpAmount + extraInitialExpensesTotal) * 100) / 100;
  const totalInitialInvestmentRequired = Math.round((downPaymentAmount + totalInitialExpenses) * 100) / 100;

  // Financiamiento
  let effectiveTea = teaPct;
  if (sensitivity && sensitivity.teaDeltaPct !== 0) {
    effectiveTea = Math.max(1, effectiveTea + sensitivity.teaDeltaPct);
  }

  let monthlyAmortizationAndInterest = 0;
  let totalLoanInterestPaid = 0;
  let totalLoanPaid = 0;
  let monthlyDesgravamen = 0;
  let monthlyPropertyInsurance = 0;
  let totalMonthlyMortgagePayment = 0;

  if (financingMode === 'hipoteca' && loanAmount > 0) {
    const mortgageCalc = calculateFrenchMortgage(loanAmount, effectiveTea, loanTermYears);
    monthlyAmortizationAndInterest = mortgageCalc.monthlyAmortizationAndInterest;
    totalLoanInterestPaid = mortgageCalc.totalInterestPaid;
    totalLoanPaid = mortgageCalc.totalPaid;

    // Seguros mensuales bancarios en Perú
    monthlyDesgravamen = Math.round(loanAmount * (desgravamenPctMonthly / 100) * 100) / 100;
    monthlyPropertyInsurance = Math.round(purchasePrice * (propertyInsurancePctMonthly / 100) * 100) / 100;
    totalMonthlyMortgagePayment = Math.round((monthlyAmortizationAndInterest + monthlyDesgravamen + monthlyPropertyInsurance) * 100) / 100;
  }

  // Ingresos
  let grossMonthlyIncome = 0;
  let vacancyLossMonthly = 0;
  let effectiveGrossMonthlyIncome = 0;

  if (rentalStrategy === 'tradicional') {
    let rent = rawTraditionalRent;
    if (sensitivity && sensitivity.rentVariationPct !== 0) {
      rent = Math.max(0, rent * (1 + sensitivity.rentVariationPct / 100));
    }
    grossMonthlyIncome = Math.round(rent * 100) / 100;

    let vacPct = rawVacancyRate;
    if (sensitivity && sensitivity.vacancyRatePct !== undefined) {
      vacPct = sensitivity.vacancyRatePct;
    }
    vacancyLossMonthly = Math.round(grossMonthlyIncome * (vacPct / 100) * 100) / 100;
    effectiveGrossMonthlyIncome = Math.max(0, grossMonthlyIncome - vacancyLossMonthly);
  } else {
    // Airbnb
    let pricePerNight = airbnbPricePerNight;
    if (sensitivity && sensitivity.rentVariationPct !== 0) {
      pricePerNight = Math.max(0, pricePerNight * (1 + sensitivity.rentVariationPct / 100));
    }
    
    let occupancy = rawAirbnbOccupancy;
    if (sensitivity && sensitivity.vacancyRatePct !== undefined) {
      // Sensibilidad de vacancia inversa para ocupación
      occupancy = Math.max(10, 100 - sensitivity.vacancyRatePct);
    }

    const nightsInMonth = 30.4;
    const occupiedNights = (nightsInMonth * occupancy) / 100;
    const accommodationRevenue = occupiedNights * pricePerNight;
    
    grossMonthlyIncome = Math.round((accommodationRevenue + (airbnbCleaningFeePerMonth || 0)) * 100) / 100;
    const platformFee = accommodationRevenue * (airbnbPlatformFeePct / 100);
    vacancyLossMonthly = 0; // Ya descontado en la tasa de ocupación
    effectiveGrossMonthlyIncome = Math.max(0, Math.round((grossMonthlyIncome - platformFee) * 100) / 100);
  }

  const grossAnnualIncome = Math.round(grossMonthlyIncome * 12 * 100) / 100;
  const effectiveGrossAnnualIncome = Math.round(effectiveGrossMonthlyIncome * 12 * 100) / 100;

  // Gastos Operativos
  const buildingMaintenanceMonthly = maintenanceFeeMonthly || 0;
  const municipalTaxMonthly = propertyTaxAndArbitriosMonthly || 0;
  const repairsReserveMonthly = Math.round(effectiveGrossMonthlyIncome * (repairsReservePct / 100) * 100) / 100;
  const managementFeeMonthly = Math.round(effectiveGrossMonthlyIncome * (managementFeePct / 100) * 100) / 100;
  
  // Impuesto a la Renta 1ra Categoría (5% de los ingresos efectivos)
  const sunatTaxMonthly = sunatFirstCatTaxEnabled 
    ? Math.round(effectiveGrossMonthlyIncome * 0.05 * 100) / 100 
    : 0;

  const utilitiesMonthlyVal = utilitiesMonthly || 0;
  const extraRecurringMonthly = customRecurringExpenses
    .filter(e => e.enabled)
    .reduce((sum, item) => sum + (item.amount || 0), 0);

  const totalOperatingExpensesMonthly = Math.round(
    (buildingMaintenanceMonthly +
      municipalTaxMonthly +
      repairsReserveMonthly +
      managementFeeMonthly +
      sunatTaxMonthly +
      utilitiesMonthlyVal +
      extraRecurringMonthly) * 100
  ) / 100;

  const totalOperatingExpensesAnnual = Math.round(totalOperatingExpensesMonthly * 12 * 100) / 100;

  // Rentabilidad y Flujo de Caja
  // NOI = Ingreso Efectivo - Gastos Operativos (sin considerar hipoteca)
  const netOperatingIncomeMonthly = Math.round((effectiveGrossMonthlyIncome - totalOperatingExpensesMonthly) * 100) / 100;
  const netOperatingIncomeAnnual = Math.round(netOperatingIncomeMonthly * 12 * 100) / 100;

  // Cash Flow Neto = NOI - Cuota Hipotecaria
  const netCashFlowMonthly = Math.round((netOperatingIncomeMonthly - totalMonthlyMortgagePayment) * 100) / 100;
  const netCashFlowAnnual = Math.round(netCashFlowMonthly * 12 * 100) / 100;

  // Indicadores Porcentuales
  const capRatePct = purchasePrice > 0 
    ? Math.round((netOperatingIncomeAnnual / purchasePrice) * 10000) / 100 
    : 0;

  const cashOnCashReturnPct = totalInitialInvestmentRequired > 0 
    ? Math.round((netCashFlowAnnual / totalInitialInvestmentRequired) * 10000) / 100 
    : 0;

  const grossYieldPct = purchasePrice > 0 
    ? Math.round((grossAnnualIncome / purchasePrice) * 10000) / 100 
    : 0;

  const paybackYears = (netCashFlowAnnual > 0 && totalInitialInvestmentRequired > 0)
    ? Math.round((totalInitialInvestmentRequired / netCashFlowAnnual) * 10) / 10
    : null;

  const grossRentMultiplier = grossAnnualIncome > 0 
    ? Math.round((purchasePrice / grossAnnualIncome) * 10) / 10 
    : 0;

  const debtServiceCoverageRatio = totalMonthlyMortgagePayment > 0 
    ? Math.round((netOperatingIncomeMonthly / totalMonthlyMortgagePayment) * 100) / 100 
    : null;

  const operatingExpenseRatioPct = effectiveGrossMonthlyIncome > 0
    ? Math.round((totalOperatingExpensesMonthly / effectiveGrossMonthlyIncome) * 1000) / 10
    : 0;

  // Semáforo de Salud y Recomendaciones
  const healthScore = evaluateHealthScore({
    netCashFlowMonthly,
    capRatePct,
    cashOnCashReturnPct,
    debtServiceCoverageRatio,
    financingMode,
    currency,
  });

  return {
    currency,
    exchangeRate,
    purchasePrice,
    purchasePriceUsd,
    purchasePricePen,
    pricePerM2,
    downPaymentAmount,
    loanAmount,
    alcabalaAmount,
    alcabalaExemptUitAmount: exemptUitAmountInCurrency,
    notaryAmount,
    sunarpAmount,
    extraInitialExpensesTotal,
    totalInitialExpenses,
    totalInitialInvestmentRequired,
    monthlyAmortizationAndInterest,
    monthlyDesgravamen,
    monthlyPropertyInsurance,
    totalMonthlyMortgagePayment,
    totalLoanInterestPaid,
    totalLoanPaid,
    grossMonthlyIncome,
    vacancyLossMonthly,
    effectiveGrossMonthlyIncome,
    grossAnnualIncome,
    effectiveGrossAnnualIncome,
    buildingMaintenanceMonthly,
    municipalTaxMonthly,
    repairsReserveMonthly,
    managementFeeMonthly,
    sunatTaxMonthly,
    utilitiesMonthly: utilitiesMonthlyVal,
    extraRecurringMonthly,
    totalOperatingExpensesMonthly,
    totalOperatingExpensesAnnual,
    netOperatingIncomeMonthly,
    netOperatingIncomeAnnual,
    netCashFlowMonthly,
    netCashFlowAnnual,
    capRatePct,
    cashOnCashReturnPct,
    grossYieldPct,
    paybackYears,
    grossRentMultiplier,
    debtServiceCoverageRatio,
    operatingExpenseRatioPct,
    healthScore,
  };
}

/**
 * Evaluación del semáforo de salud financiera adaptada al mercado peruano
 */
function evaluateHealthScore(params: {
  netCashFlowMonthly: number;
  capRatePct: number;
  cashOnCashReturnPct: number;
  debtServiceCoverageRatio: number | null;
  financingMode: 'contado' | 'hipoteca';
  currency: 'USD' | 'PEN';
}) {
  const { netCashFlowMonthly, capRatePct, cashOnCashReturnPct, debtServiceCoverageRatio, financingMode, currency } = params;

  const checks = [
    {
      id: 'cashflow',
      label: 'Flujo de Caja Mensual',
      passed: netCashFlowMonthly > 0,
      status: (netCashFlowMonthly > 100 ? 'success' : netCashFlowMonthly >= 0 ? 'warning' : 'danger') as 'success' | 'warning' | 'danger',
      detail: netCashFlowMonthly > 0 
        ? `Genera un superávit neto de ${currency === 'USD' ? '$' : 'S/.'} ${Math.round(netCashFlowMonthly).toLocaleString()} mensual tras pagar todos los gastos e hipoteca.`
        : `Déficit de ${currency === 'USD' ? '$' : 'S/.'} ${Math.abs(Math.round(netCashFlowMonthly)).toLocaleString()} mensual. Requiere inyectar capital de bolsillo cada mes.`,
    },
    {
      id: 'dscr',
      label: 'Cobertura del Crédito (DSCR)',
      passed: financingMode === 'contado' || (debtServiceCoverageRatio !== null && debtServiceCoverageRatio >= 1.15),
      status: financingMode === 'contado' 
        ? 'success' 
        : (debtServiceCoverageRatio !== null && debtServiceCoverageRatio >= 1.25 
            ? 'success' 
            : (debtServiceCoverageRatio !== null && debtServiceCoverageRatio >= 1.0 ? 'warning' : 'danger')) as 'success' | 'warning' | 'danger',
      detail: financingMode === 'contado'
        ? 'Inversión 100% al contado. Sin riesgo de cuota hipotecaria.'
        : debtServiceCoverageRatio !== null
          ? debtServiceCoverageRatio >= 1.25
            ? `DSCR óptimo (${debtServiceCoverageRatio}x). El alquiler holgadamente cubre la cuota bancaria dejando margen seguro.`
            : debtServiceCoverageRatio >= 1.0
              ? `DSCR ajustado (${debtServiceCoverageRatio}x). La renta apenas cubre la cuota bancaria; poca tolerancia a vacancia.`
              : `DSCR insuficiente (${debtServiceCoverageRatio}x). El inmueble no genera lo suficiente para sostener su préstamo.`
          : 'Sin deuda',
    },
    {
      id: 'caprate',
      label: 'Cap Rate vs Benchmark Perú',
      passed: capRatePct >= 5.5,
      status: (capRatePct >= 6.8 ? 'success' : capRatePct >= 5.0 ? 'warning' : 'danger') as 'success' | 'warning' | 'danger',
      detail: capRatePct >= 6.8
        ? `Excelente Cap Rate (${capRatePct}%). Supera el promedio de Lima Top (4.5% - 5.5%) y los depósitos a plazo bancarios.`
        : capRatePct >= 5.0
          ? `Cap Rate competitivo (${capRatePct}%). En línea con el promedio residencial de Lima Moderna (5.0% - 6.5%).`
          : `Cap Rate conservador (${capRatePct}%). Rendimiento por debajo de instrumentos financieros de renta fija en Perú.`,
    },
    {
      id: 'coc',
      label: 'Retorno sobre Capital Propio (Cash-on-Cash)',
      passed: financingMode === 'contado' ? cashOnCashReturnPct >= 5 : cashOnCashReturnPct >= 7,
      status: (cashOnCashReturnPct >= 8.5 ? 'success' : cashOnCashReturnPct >= 4.0 ? 'warning' : 'danger') as 'success' | 'warning' | 'danger',
      detail: cashOnCashReturnPct >= 8.5
        ? `CoC sobresaliente (${cashOnCashReturnPct}%). Tu capital propio desembolsado trabaja con alta eficiencia.`
        : cashOnCashReturnPct > 0
          ? `CoC moderado (${cashOnCashReturnPct}%). El apalancamiento genera retornos positivos pero moderados.`
          : `CoC negativo (${cashOnCashReturnPct}%). El capital inicial no produce flujo libre en el año 1.`,
    },
  ];

  const passedCount = checks.filter(c => c.passed).length;
  let verdict: 'excelente' | 'bueno' | 'regular' | 'riesgoso' | 'deficit' = 'regular';
  let score = 50;
  let title = 'Inversión Equilibrada';
  let summary = 'La propiedad tiene métricas aceptables pero requiere monitorear la vacancia y gastos operativos.';

  if (netCashFlowMonthly < 0) {
    verdict = 'deficit';
    score = Math.max(20, Math.round(35 + capRatePct * 3));
    title = 'Flujo de Caja Negativo';
    summary = 'Atención: El inmueble no se autofinancia mensualmente. Deberás aportar dinero de tus ingresos personales para cubrir la hipoteca o gastos.';
  } else if (passedCount === 4 && capRatePct >= 6.5) {
    verdict = 'excelente';
    score = 95;
    title = 'Oportunidad Inmobiliaria Destacada';
    summary = 'Métricas sobresalientes: flujo de caja positivo, sólida cobertura bancaria y retorno superior al promedio del mercado peruano.';
  } else if (passedCount >= 3) {
    verdict = 'bueno';
    score = 80;
    title = 'Inversión Sólida y Segura';
    summary = 'Buena estructura financiera. El inmueble cubre sus obligaciones y genera excedente de efectivo.';
  } else if (passedCount >= 2) {
    verdict = 'regular';
    score = 62;
    title = 'Inversión Conservadora';
    summary = 'Rendimiento modesto. Puede justificarse si apuestas fuertemente a la plusvalía a largo plazo del distrito.';
  } else {
    verdict = 'riesgoso';
    score = 40;
    title = 'Alto Riesgo Financiero';
    summary = 'La estructura de costos o financiamiento presiona fuertemente la rentabilidad. Se recomienda renegociar el precio de compra o aumentar la cuota inicial.';
  }

  const recommendations: string[] = [];
  if (netCashFlowMonthly < 0) {
    recommendations.push('Aumenta el porcentaje de cuota inicial (ej. del 20% al 30%) para reducir la cuota hipotecaria mensual.');
    recommendations.push('Evalúa ampliar el plazo del crédito a 25 o 30 años para disminuir el pago mensual y lograr cash flow positivo.');
    recommendations.push('Explora el modelo de renta corta / Airbnb si el reglamento del edificio lo permite, para elevar los ingresos brutos.');
  } else {
    recommendations.push('Mantén una cuenta de contingencia equivalente a 3 meses de gastos e hipoteca para contingencias de vacancia.');
  }

  if (capRatePct < 5.0) {
    recommendations.push('Negocia un descuento en el precio de compra del inmueble entre 5% y 8% para subir el Cap Rate a niveles superiores al 5.5%.');
  }

  recommendations.push('Verifica si la propiedad califica para exoneración de Alcabala (primera venta de constructora o bien futuro).');

  return {
    verdict,
    score,
    title,
    summary,
    checks,
    recommendations,
  };
}
