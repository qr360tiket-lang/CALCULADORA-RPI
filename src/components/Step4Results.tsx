import React, { useState } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Percent, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Layers, 
  Sliders, 
  FileDown, 
  Sparkles,
  ChevronLeft,
  Scale,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Info
} from 'lucide-react';
import { PropertyData, FinancialCalculationResult } from '../types/realEstate';
import { formatCurrency, formatPct } from '../utils/formatters';
import { InfoTooltip } from './InfoTooltip';

interface Step4ResultsProps {
  property: PropertyData;
  results: FinancialCalculationResult;
  onPrev: () => void;
  onOpenSensitivity: () => void;
  onOpenExport: () => void;
  onGoToComparison: () => void;
}

export const Step4Results: React.FC<Step4ResultsProps> = ({
  property,
  results,
  onPrev,
  onOpenSensitivity,
  onOpenExport,
  onGoToComparison,
}) => {
  const isPositiveCashFlow = results.netCashFlowMonthly >= 0;
  const [appreciationRatePct, setAppreciationRatePct] = useState(4.0); // 4% promedio Lima moderna

  // Simulación a 5 años
  const fiveYearProjection = Array.from({ length: 5 }, (_, i) => {
    const year = i + 1;
    const propertyValueProjected = results.purchasePrice * Math.pow(1 + appreciationRatePct / 100, year);
    const accumulatedCashFlow = results.netCashFlowAnnual * year;
    // Estimación de capital amortizado en 5 años si hay hipoteca
    const loanRepaidEstimate = property.financingMode === 'hipoteca' 
      ? (results.loanAmount * (0.025 * year * (1 + 0.05 * year)))
      : 0;
    const equityEstimate = (results.purchasePrice - Math.max(0, results.loanAmount - loanRepaidEstimate)) + (propertyValueProjected - results.purchasePrice);

    return {
      year,
      propertyValue: propertyValueProjected,
      accumulatedCashFlow,
      equityEstimate,
    };
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Intro Header */}
      <div className="bg-white rounded-2xl p-6 border border-[#DDD5C3] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#D8B66D] font-bold">
            Paso 4 de 4 · Dictamen Financiero & Métricas
          </span>
          <h2 className="font-serif-title text-2xl font-bold text-[#091C2C] mt-1">
            Resultados, Cash Flow y Rentabilidad Inmobiliaria
          </h2>
          <p className="text-xs sm:text-sm text-[#6F6456] mt-1 max-w-2xl">
            Análisis integral de rendimiento: Flujo de caja neto mensual, Cap Rate, Retorno sobre capital (CoC), cobertura de deuda y semáforo de viabilidad en el Perú.
          </p>
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenSensitivity}
            className="px-3.5 py-2 rounded-xl bg-[#F6F4EF] hover:bg-[#EBE5D8] text-[#091C2C] font-semibold text-xs border border-[#DDD5C3] flex items-center gap-1.5 transition-colors"
          >
            <Sliders className="w-3.5 h-3.5 text-[#D8B66D]" />
            <span>Simulador de Estrés</span>
          </button>
          <button
            type="button"
            onClick={onOpenExport}
            className="px-4 py-2 rounded-xl bg-[#091C2C] hover:bg-[#1a3854] text-[#F6F4EF] font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <FileDown className="w-3.5 h-3.5 text-[#D8B66D]" />
            <span>Reporte PDF</span>
          </button>
        </div>
      </div>

      {/* 1. HERO KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Cash Flow Mensual Neto */}
        <div className={`p-5 rounded-2xl border transition-all ${
          isPositiveCashFlow
            ? 'bg-gradient-to-br from-[#091C2C] to-[#122c42] text-white border-[#D8B66D]/50 shadow-md'
            : 'bg-gradient-to-br from-red-950 to-red-900 text-white border-red-500 shadow-md'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#D8B66D]">
              Cash Flow Mensual Neto
            </span>
            <InfoTooltip 
              title="Cash Flow Mensual Neto (Flujo de Caja Libre)"
              content="Es el dinero que realmente ingresa o sale de tu bolsillo cada mes después de pagar todos los gastos operativos, impuestos y la cuota hipotecaria. Si es positivo, el departamento genera superávit; si es negativo, requiere aporte de bolsillo."
            />
          </div>
          
          <div className="flex items-baseline gap-1 my-1">
            <span className="font-mono text-2xl sm:text-3xl font-bold tracking-tight">
              {formatCurrency(results.netCashFlowMonthly, property.currency)}
            </span>
            <span className="text-xs text-[#DDD5C3]/80">/ mes</span>
          </div>

          <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-xs">
            <span className="text-[#DDD5C3]">Flujo Anual:</span>
            <span className="font-mono font-bold text-[#D8B66D]">
              {formatCurrency(results.netCashFlowAnnual, property.currency)} / año
            </span>
          </div>

          <div className="mt-2 text-[11px] flex items-center gap-1 font-semibold">
            {isPositiveCashFlow ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Superávit mensual
              </span>
            ) : (
              <span className="text-red-300 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Requiere aporte mensual
              </span>
            )}
          </div>
        </div>

        {/* KPI 2: Cap Rate (Tasa de Capitalización Neta) */}
        <div className="p-5 bg-white rounded-2xl border border-[#DDD5C3] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#6F6456] font-semibold">
                Cap Rate (Rentabilidad Neta)
              </span>
              <InfoTooltip 
                title="Cap Rate (Capitalization Rate)"
                content="Mide la rentabilidad intrínseca de la propiedad sin contar la deuda: (NOI Anual / Precio de Compra) x 100. En Lima Top oscila entre 4.5% y 6.0%; en Lima Moderna entre 5.5% y 7.5%."
                badge="NOI / Precio"
              />
            </div>
            
            <div className="flex items-baseline gap-1.5 my-1">
              <span className="font-mono text-2xl sm:text-3xl font-bold text-[#091C2C]">
                {formatPct(results.capRatePct)}
              </span>
              <span className="text-xs font-semibold text-[#6F6456]">anual</span>
            </div>

            <p className="text-[11px] text-[#6F6456] mt-1">
              NOI Anual: {formatCurrency(results.netOperatingIncomeAnnual, property.currency)}
            </p>
          </div>

          <div className="mt-3 pt-2.5 border-t border-[#DDD5C3]/40 flex items-center justify-between text-xs">
            <span className="text-[#6F6456]">Benchmark Perú:</span>
            <span className="font-mono font-bold text-[#091C2C]">5.5% - 7.0%</span>
          </div>
        </div>

        {/* KPI 3: Cash-on-Cash Return (CoC) */}
        <div className="p-5 bg-white rounded-2xl border border-[#DDD5C3] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#6F6456] font-semibold">
                Cash-on-Cash Return (CoC)
              </span>
              <InfoTooltip 
                title="Cash-on-Cash Return (CoC)"
                content="Mide el retorno porcentual directo sobre tu dinero propio desembolsado: (Cash Flow Anual / Inversión Inicial Total) x 100. Refleja el poder del apalancamiento hipotecario."
                badge="Flujo / Capital Propio"
              />
            </div>
            
            <div className="flex items-baseline gap-1.5 my-1">
              <span className="font-mono text-2xl sm:text-3xl font-bold text-[#091C2C]">
                {formatPct(results.cashOnCashReturnPct)}
              </span>
              <span className="text-xs font-semibold text-[#6F6456]">anual</span>
            </div>

            <p className="text-[11px] text-[#6F6456] mt-1">
              Sobre inversión de {formatCurrency(results.totalInitialInvestmentRequired, property.currency)}
            </p>
          </div>

          <div className="mt-3 pt-2.5 border-t border-[#DDD5C3]/40 flex items-center justify-between text-xs">
            <span className="text-[#6F6456]">Eficiencia Capital:</span>
            <span className={`font-mono font-bold ${results.cashOnCashReturnPct >= 7 ? 'text-emerald-700' : 'text-[#091C2C]'}`}>
              {results.cashOnCashReturnPct >= 7 ? 'Alta' : 'Moderada'}
            </span>
          </div>
        </div>

        {/* KPI 4: Rentabilidad Bruta & Payback */}
        <div className="p-5 bg-white rounded-2xl border border-[#DDD5C3] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#6F6456] font-semibold">
                Rentabilidad Bruta (Yield)
              </span>
              <InfoTooltip 
                title="Gross Yield (Rentabilidad Bruta)"
                content="Ingresos brutos anuales entre el precio del inmueble: (Ingreso Bruto Anual / Precio Compra) x 100. No descuenta impuestos ni mantenimiento."
              />
            </div>
            
            <div className="flex items-baseline gap-1.5 my-1">
              <span className="font-mono text-2xl sm:text-3xl font-bold text-[#091C2C]">
                {formatPct(results.grossYieldPct)}
              </span>
              <span className="text-xs font-semibold text-[#6F6456]">bruta</span>
            </div>

            <p className="text-[11px] text-[#6F6456] mt-1">
              Ingreso Bruto: {formatCurrency(results.grossAnnualIncome, property.currency)}/año
            </p>
          </div>

          <div className="mt-3 pt-2.5 border-t border-[#DDD5C3]/40 flex items-center justify-between text-xs">
            <span className="text-[#6F6456]">Payback Period:</span>
            <span className="font-mono font-bold text-[#091C2C]">
              {results.paybackYears ? `${results.paybackYears} años` : 'N/A (Flujo negativo)'}
            </span>
          </div>
        </div>

      </div>

      {/* 2. SEMÁFORO DE SALUD DE LA INVERSIÓN (DIAGNÓSTICO CUALITATIVO) */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#DDD5C3] shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#DDD5C3]/40">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#D8B66D]" />
              <h3 className="font-serif-title font-bold text-xl text-[#091C2C]">
                Semáforo de Salud de la Inversión Inmobiliaria
              </h3>
            </div>
            <p className="text-xs text-[#6F6456] mt-0.5">
              Evaluación multidimensional de riesgo, liquidez y sustentabilidad frente al mercado peruano.
            </p>
          </div>

          {/* Verdict Score Badge */}
          <div className="flex items-center gap-3 bg-[#FBF9F5] p-3 rounded-xl border border-[#DDD5C3]">
            <div className="text-right">
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#6F6456] block">
                Veredicto General
              </span>
              <span className={`font-serif-title font-bold text-base ${
                results.healthScore.verdict === 'excelente' || results.healthScore.verdict === 'bueno'
                  ? 'text-emerald-800'
                  : results.healthScore.verdict === 'regular'
                    ? 'text-amber-800'
                    : 'text-red-700'
              }`}>
                {results.healthScore.title}
              </span>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-mono font-bold text-lg text-white shadow-sm ${
              results.healthScore.verdict === 'excelente'
                ? 'bg-emerald-600'
                : results.healthScore.verdict === 'bueno'
                  ? 'bg-emerald-500'
                  : results.healthScore.verdict === 'regular'
                    ? 'bg-amber-500'
                    : 'bg-red-600'
            }`}>
              {results.healthScore.score}
            </div>
          </div>
        </div>

        {/* Summary text */}
        <div className="p-4 rounded-xl bg-[#FBF9F5] border border-[#DDD5C3] text-xs sm:text-sm text-[#091C2C] leading-relaxed">
          <strong>Diagnóstico del experto: </strong>
          {results.healthScore.summary}
        </div>

        {/* 4 Health Checks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {results.healthScore.checks.map((check) => {
            const isSuccess = check.status === 'success';
            const isWarning = check.status === 'warning';

            return (
              <div 
                key={check.id} 
                className={`p-4 rounded-xl border transition-all ${
                  isSuccess 
                    ? 'bg-emerald-50/50 border-emerald-200' 
                    : isWarning 
                      ? 'bg-amber-50/50 border-amber-200' 
                      : 'bg-red-50/50 border-red-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    {isSuccess ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : isWarning ? (
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                    )}
                    <span className="font-bold text-xs text-[#091C2C]">
                      {check.label}
                    </span>
                  </div>
                  <span className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded ${
                    isSuccess 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : isWarning 
                        ? 'bg-amber-100 text-amber-800' 
                        : 'bg-red-100 text-red-800'
                  }`}>
                    {isSuccess ? 'Cumple' : isWarning ? 'Atención' : 'Crítico'}
                  </span>
                </div>
                <p className="text-xs text-[#554C41] pl-6 leading-relaxed">
                  {check.detail}
                </p>
              </div>
            );
          })}
        </div>

        {/* Actionable Recommendations */}
        {results.healthScore.recommendations.length > 0 && (
          <div className="pt-2 border-t border-[#DDD5C3]/40 space-y-2">
            <h4 className="text-xs font-bold text-[#091C2C] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#D8B66D]" />
              Recomendaciones Inmobiliarias para Optimizar tu Retorno:
            </h4>
            <ul className="space-y-1.5 pl-2">
              {results.healthScore.recommendations.map((rec, i) => (
                <li key={i} className="text-xs text-[#6F6456] flex items-start gap-2">
                  <span className="text-[#D8B66D] font-bold">›</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

      </div>

      {/* 3. CASCADA VISUAL DE CASH FLOW (WATERFALL) */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#DDD5C3] shadow-xs space-y-6">
        <div className="flex items-center gap-2 pb-3 border-b border-[#DDD5C3]/40">
          <Layers className="w-5 h-5 text-[#D8B66D]" />
          <div>
            <h3 className="font-serif-title font-bold text-lg text-[#091C2C]">
              Cascada de Flujo de Fondos (Waterfall Mensual)
            </h3>
            <p className="text-xs text-[#6F6456]">
              Desde el alquiler bruto hasta el dinero líquido que queda en tu cuenta cada mes.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          
          {/* 1. Ingreso Bruto */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#F6F4EF] border border-[#DDD5C3]">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-md bg-blue-100 text-blue-800 font-mono font-bold text-xs flex items-center justify-center">
                +
              </span>
              <div>
                <span className="text-xs font-bold text-[#091C2C] block">Ingreso Bruto Mensual de Alquiler</span>
                <span className="text-[11px] text-[#6F6456]">
                  {property.rentalStrategy === 'tradicional' ? 'Renta mensual pactada' : 'Total noches facturadas Airbnb'}
                </span>
              </div>
            </div>
            <span className="font-mono font-bold text-sm text-[#091C2C]">
              +{formatCurrency(results.grossMonthlyIncome, property.currency)}
            </span>
          </div>

          {/* 2. Vacancia / Comisiones */}
          {results.vacancyLossMonthly > 0 && (
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#FBF9F5] border border-[#DDD5C3]/60 pl-8">
              <div className="flex items-center gap-2">
                <ArrowDownRight className="w-4 h-4 text-red-500" />
                <span className="text-xs text-[#6F6456]">
                  (-) Provisión por Vacancia ({property.vacancyRatePct}%)
                </span>
              </div>
              <span className="font-mono font-semibold text-xs text-red-600">
                -{formatCurrency(results.vacancyLossMonthly, property.currency)}
              </span>
            </div>
          )}

          {/* Subtotal: Ingreso Efectivo */}
          <div className="flex items-center justify-between px-4 py-2 bg-[#F6F4EF]/60 rounded-lg text-xs font-semibold text-[#091C2C]">
            <span>= Ingreso Bruto Efectivo Disponible</span>
            <span className="font-mono font-bold">
              {formatCurrency(results.effectiveGrossMonthlyIncome, property.currency)}
            </span>
          </div>

          {/* 3. Gastos Operativos (OpEx) */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#FBF9F5] border border-[#DDD5C3]/60 pl-8">
            <div className="flex items-center gap-2">
              <ArrowDownRight className="w-4 h-4 text-red-500" />
              <div>
                <span className="text-xs text-[#6F6456] block">
                  (-) Total Gastos Operativos (Mantenimiento, SUNAT 5%, Predial, etc.)
                </span>
                <span className="text-[10px] text-[#8C7E6D]">
                  Ratio de Gastos: {results.operatingExpenseRatioPct}% sobre el ingreso
                </span>
              </div>
            </div>
            <span className="font-mono font-semibold text-xs text-red-600">
              -{formatCurrency(results.totalOperatingExpensesMonthly, property.currency)}
            </span>
          </div>

          {/* Subtotal: NOI */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#091C2C] text-white">
            <div>
              <span className="text-xs font-bold text-[#D8B66D] block">
                = Ingreso Operativo Neto (NOI Mensual)
              </span>
              <span className="text-[10px] text-[#DDD5C3]">
                Flujo neto antes de hipoteca (Base del Cap Rate: {results.capRatePct}%)
              </span>
            </div>
            <span className="font-mono font-bold text-base text-white">
              {formatCurrency(results.netOperatingIncomeMonthly, property.currency)}
            </span>
          </div>

          {/* 4. Cuota Hipotecaria (Servicio de Deuda) */}
          {property.financingMode === 'hipoteca' && results.totalMonthlyMortgagePayment > 0 && (
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#FBF9F5] border border-[#DDD5C3]/60 pl-8">
              <div className="flex items-center gap-2">
                <ArrowDownRight className="w-4 h-4 text-amber-600" />
                <div>
                  <span className="text-xs text-[#6F6456] block">
                    (-) Cuota Hipotecaria Banco (Amortización + Intereses + Seguros)
                  </span>
                  <span className="text-[10px] text-[#8C7E6D]">
                    {property.loanTermYears} años · TEA {property.teaPct}%
                  </span>
                </div>
              </div>
              <span className="font-mono font-semibold text-xs text-amber-700">
                -{formatCurrency(results.totalMonthlyMortgagePayment, property.currency)}
              </span>
            </div>
          )}

          {/* Gran Total: CASH FLOW NETO */}
          <div className={`flex items-center justify-between p-4 rounded-xl border-2 ${
            isPositiveCashFlow
              ? 'bg-emerald-50 border-emerald-500 text-emerald-950'
              : 'bg-red-50 border-red-500 text-red-950'
          }`}>
            <div>
              <span className="text-sm font-bold block">
                = CASH FLOW NETO FINAL EN TU BOLSILLO
              </span>
              <span className="text-xs opacity-80">
                {isPositiveCashFlow
                  ? 'Excedente de libre disponibilidad cada 30 días'
                  : 'Déficit mensual: debes cubrirlo de tus ingresos de trabajo'}
              </span>
            </div>
            <span className="font-mono font-bold text-xl sm:text-2xl">
              {formatCurrency(results.netCashFlowMonthly, property.currency)}
            </span>
          </div>

        </div>
      </div>

      {/* 4. PROYECCIÓN PATRIMONIAL A 5 AÑOS (EQUITY & PLUSVALÍA) */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#DDD5C3] shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#DDD5C3]/40">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#D8B66D]" />
            <div>
              <h3 className="font-serif-title font-bold text-lg text-[#091C2C]">
                Proyección Patrimonial a 5 Años
              </h3>
              <p className="text-xs text-[#6F6456]">
                Evolución estimada considerando amortización de la deuda, flujos acumulados y plusvalía inmobiliaria.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-[#FBF9F5] px-3 py-1.5 rounded-xl border border-[#DDD5C3]">
            <span className="text-xs font-semibold text-[#091C2C]">Plusvalía anual estimada:</span>
            <input
              type="number"
              step="0.5"
              min="0"
              max="15"
              value={appreciationRatePct}
              onChange={(e) => setAppreciationRatePct(parseFloat(e.target.value) || 0)}
              className="w-14 px-1.5 py-0.5 text-xs font-mono font-bold text-right bg-white border border-[#DDD5C3] rounded"
            />
            <span className="text-xs font-bold text-[#091C2C]">%</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#DDD5C3] text-[#6F6456] font-mono uppercase text-[11px]">
                <th className="py-2.5 pr-4 font-semibold">Año</th>
                <th className="py-2.5 px-4 font-semibold">Valor Estimado del Inmueble</th>
                <th className="py-2.5 px-4 font-semibold">Cash Flow Acumulado</th>
                <th className="py-2.5 pl-4 font-semibold text-right">Patrimonio Neto Estimado (Equity)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDD5C3]/30 font-mono">
              {fiveYearProjection.map((item) => (
                <tr key={item.year} className="hover:bg-[#FBF9F5] transition-colors">
                  <td className="py-3 pr-4 font-bold text-[#091C2C]">
                    Año {item.year}
                  </td>
                  <td className="py-3 px-4 text-[#091C2C]">
                    {formatCurrency(item.propertyValue, property.currency)}
                  </td>
                  <td className={`py-3 px-4 font-semibold ${item.accumulatedCashFlow >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                    {formatCurrency(item.accumulatedCashFlow, property.currency)}
                  </td>
                  <td className="py-3 pl-4 text-right font-bold text-[#091C2C]">
                    {formatCurrency(item.equityEstimate, property.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-[#DDD5C3]/40">
        <button
          type="button"
          onClick={onPrev}
          className="px-5 py-2.5 rounded-xl border border-[#DDD5C3] bg-white hover:bg-[#F6F4EF] text-[#091C2C] font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Volver al Paso 3: Renta</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onGoToComparison}
            className="px-4 py-2.5 rounded-xl border border-[#D8B66D] bg-[#FBF9F5] hover:bg-[#F6F4EF] text-[#091C2C] font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Scale className="w-4 h-4 text-[#D8B66D]" />
            <span>Comparar con otra propiedad</span>
          </button>

          <button
            type="button"
            onClick={onOpenExport}
            className="px-6 py-2.5 rounded-xl bg-[#D8B66D] hover:bg-[#c8a557] text-[#091C2C] font-bold text-xs flex items-center gap-1.5 shadow-md transition-colors cursor-pointer"
          >
            <FileDown className="w-4 h-4" />
            <span>Exportar Reporte Ejecutivo</span>
          </button>
        </div>
      </div>

    </div>
  );
};
