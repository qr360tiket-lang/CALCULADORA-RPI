import React from 'react';
import { 
  Building2, 
  Landmark, 
  Receipt, 
  TrendingUp, 
  ShieldCheck, 
  Coins, 
  Clock, 
  Sliders, 
  FileDown, 
  Edit3,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { PropertyData, FinancialCalculationResult } from '../types/realEstate';
import { formatCurrency, formatPct } from '../utils/formatters';
import { InfoTooltip } from './InfoTooltip';

interface DashboardOverviewProps {
  property: PropertyData;
  results: FinancialCalculationResult;
  onGoToStep: (step: number) => void;
  onOpenSensitivity: () => void;
  onOpenExport: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  property,
  results,
  onGoToStep,
  onOpenSensitivity,
  onOpenExport,
}) => {
  const isPositiveCashFlow = results.netCashFlowMonthly >= 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#091C2C] to-[#15344f] text-[#F6F4EF] rounded-2xl p-6 sm:p-8 border border-[#D8B66D]/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs uppercase font-mono tracking-widest text-[#D8B66D] font-bold">
              Dashboard Resumen Ejecutivo
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-[#DDD5C3] font-mono">
              {property.district} · {property.currency}
            </span>
          </div>
          <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-white">
            {property.title}
          </h2>
          <p className="text-xs sm:text-sm text-[#DDD5C3] mt-1 max-w-xl">
            Visión panorámica de la inversión inmobiliaria: costo de adquisición, servicio de deuda, gastos operativos y rendimiento del capital en el Perú.
          </p>
        </div>

        {/* Big Health Badge & Action */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
          <div className="p-3 bg-white/10 rounded-xl border border-white/20 text-right backdrop-blur-xs">
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#D8B66D] block">
              Salud Inmobiliaria
            </span>
            <span className="font-serif-title font-bold text-base text-white block">
              {results.healthScore.title}
            </span>
            <span className="text-xs font-mono text-[#DDD5C3]">
              Score: {results.healthScore.score}/100
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={onOpenSensitivity}
              className="px-3.5 py-2 rounded-xl bg-[#F6F4EF]/15 hover:bg-[#F6F4EF]/25 text-white font-semibold text-xs border border-white/20 flex items-center justify-center gap-1.5 transition-colors"
            >
              <Sliders className="w-3.5 h-3.5 text-[#D8B66D]" />
              <span>Sensibilidad</span>
            </button>
            <button
              type="button"
              onClick={onOpenExport}
              className="px-4 py-2 rounded-xl bg-[#D8B66D] hover:bg-[#c9a656] text-[#091C2C] font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-colors"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Reporte PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* TOP METRICS STRIP */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Cash Flow */}
        <div className={`p-4 rounded-xl border ${
          isPositiveCashFlow 
            ? 'bg-emerald-50/60 border-emerald-300' 
            : 'bg-red-50/60 border-red-300'
        }`}>
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#6F6456] block mb-1">
            Cash Flow Mensual
          </span>
          <div className={`font-mono text-xl sm:text-2xl font-bold ${
            isPositiveCashFlow ? 'text-emerald-900' : 'text-red-900'
          }`}>
            {formatCurrency(results.netCashFlowMonthly, property.currency)}
          </div>
          <span className="text-[11px] text-[#6F6456]">
            {formatCurrency(results.netCashFlowAnnual, property.currency)} / año
          </span>
        </div>

        {/* Cap Rate */}
        <div className="p-4 bg-white rounded-xl border border-[#DDD5C3] shadow-xs">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#6F6456] block mb-1">
            Cap Rate Anual
          </span>
          <div className="font-mono text-xl sm:text-2xl font-bold text-[#091C2C]">
            {formatPct(results.capRatePct)}
          </div>
          <span className="text-[11px] text-[#6F6456]">
            NOI: {formatCurrency(results.netOperatingIncomeAnnual, property.currency)}
          </span>
        </div>

        {/* Cash-on-Cash */}
        <div className="p-4 bg-white rounded-xl border border-[#DDD5C3] shadow-xs">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#6F6456] block mb-1">
            Cash-on-Cash Return
          </span>
          <div className="font-mono text-xl sm:text-2xl font-bold text-[#091C2C]">
            {formatPct(results.cashOnCashReturnPct)}
          </div>
          <span className="text-[11px] text-[#6F6456]">
            Sobre capital propio
          </span>
        </div>

        {/* Inversión Inicial Total */}
        <div className="p-4 bg-white rounded-xl border border-[#DDD5C3] shadow-xs">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#6F6456] block mb-1">
            Capital Propio Requerido
          </span>
          <div className="font-mono text-xl sm:text-2xl font-bold text-[#091C2C]">
            {formatCurrency(results.totalInitialInvestmentRequired, property.currency)}
          </div>
          <span className="text-[11px] text-[#6F6456]">
            Inicial + Gastos de cierre
          </span>
        </div>

      </div>

      {/* 3-COLUMN DETAILED SNAPSHOT */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Column 1: Adquisición & Cierre */}
        <div className="bg-white rounded-2xl p-5 border border-[#DDD5C3] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#DDD5C3]/40">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#D8B66D]" />
              <h3 className="font-serif-title font-bold text-sm text-[#091C2C]">
                1. Compra & Gastos de Cierre
              </h3>
            </div>
            <button
              type="button"
              onClick={() => onGoToStep(1)}
              className="text-[#6F6456] hover:text-[#091C2C] p-1"
              title="Editar Paso 1"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-[#6F6456]">Precio de Compra:</span>
              <span className="font-mono font-bold text-[#091C2C]">
                {formatCurrency(results.purchasePrice, property.currency)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6F6456]">Área Techada:</span>
              <span className="font-mono font-semibold text-[#091C2C]">
                {property.areaM2} m² ({formatCurrency(results.pricePerM2, property.currency)}/m²)
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6F6456]">Cuota Inicial ({property.downPaymentPct}%):</span>
              <span className="font-mono font-bold text-[#091C2C]">
                {formatCurrency(results.downPaymentAmount, property.currency)}
              </span>
            </div>
            <div className="flex justify-between text-amber-900 pt-1 border-t border-[#DDD5C3]/30">
              <span>Alcabala (10 UIT inafectas):</span>
              <span className="font-mono font-bold">
                {property.isFirstSaleConstructor ? 'S/. 0 (Estreno)' : formatCurrency(results.alcabalaAmount, property.currency)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6F6456]">Notaría & Registros SUNARP:</span>
              <span className="font-mono text-[#091C2C]">
                {formatCurrency(results.notaryAmount + results.sunarpAmount, property.currency)}
              </span>
            </div>
            {results.extraInitialExpensesTotal > 0 && (
              <div className="flex justify-between">
                <span className="text-[#6F6456]">Gastos adicionales:</span>
                <span className="font-mono text-[#091C2C]">
                  {formatCurrency(results.extraInitialExpensesTotal, property.currency)}
                </span>
              </div>
            )}
            <div className="flex justify-between pt-2 border-t border-[#091C2C] font-bold text-[#091C2C]">
              <span>Inversión Total Desembolsada:</span>
              <span className="font-mono text-sm">
                {formatCurrency(results.totalInitialInvestmentRequired, property.currency)}
              </span>
            </div>
          </div>
        </div>

        {/* Column 2: Financiamiento Bancario */}
        <div className="bg-white rounded-2xl p-5 border border-[#DDD5C3] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#DDD5C3]/40">
            <div className="flex items-center gap-2">
              <Landmark className="w-4 h-4 text-[#D8B66D]" />
              <h3 className="font-serif-title font-bold text-sm text-[#091C2C]">
                2. Hipoteca & Crédito Bancario
              </h3>
            </div>
            <button
              type="button"
              onClick={() => onGoToStep(2)}
              className="text-[#6F6456] hover:text-[#091C2C] p-1"
              title="Editar Paso 2"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-[#6F6456]">Modalidad:</span>
              <span className="font-semibold text-[#091C2C] uppercase font-mono">
                {property.financingMode === 'contado' ? '100% Contado' : 'Hipotecario'}
              </span>
            </div>
            {property.financingMode === 'hipoteca' ? (
              <>
                <div className="flex justify-between">
                  <span className="text-[#6F6456]">Saldo Financiado:</span>
                  <span className="font-mono font-bold text-[#091C2C]">
                    {formatCurrency(results.loanAmount, property.currency)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6F6456]">Plazo / TEA:</span>
                  <span className="font-mono font-semibold text-[#091C2C]">
                    {property.loanTermYears} años · {property.teaPct}% TEA
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6F6456]">Cuota Francesa (Cap+Int):</span>
                  <span className="font-mono text-[#091C2C]">
                    {formatCurrency(results.monthlyAmortizationAndInterest, property.currency)}/m
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6F6456]">Seguros (Desgravamen+Inm.):</span>
                  <span className="font-mono text-[#091C2C]">
                    {formatCurrency(results.monthlyDesgravamen + results.monthlyPropertyInsurance, property.currency)}/m
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#091C2C] font-bold text-[#091C2C]">
                  <span>Cuota Total Bancaria:</span>
                  <span className="font-mono text-sm text-amber-800">
                    {formatCurrency(results.totalMonthlyMortgagePayment, property.currency)}/m
                  </span>
                </div>
              </>
            ) : (
              <div className="py-6 text-center text-[#6F6456]">
                <p className="font-medium">Compra al Contado</p>
                <p className="text-[11px] text-[#8C7E6D] mt-1">Sin endeudamiento ni pago de cuotas mensuales.</p>
              </div>
            )}
          </div>
        </div>

        {/* Column 3: Operación & Renta */}
        <div className="bg-white rounded-2xl p-5 border border-[#DDD5C3] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#DDD5C3]/40">
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4 text-[#D8B66D]" />
              <h3 className="font-serif-title font-bold text-sm text-[#091C2C]">
                3. Operación & Flujo Mensual
              </h3>
            </div>
            <button
              type="button"
              onClick={() => onGoToStep(3)}
              className="text-[#6F6456] hover:text-[#091C2C] p-1"
              title="Editar Paso 3"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-[#6F6456]">Estrategia:</span>
              <span className="font-semibold text-[#091C2C] capitalize">
                {property.rentalStrategy === 'tradicional' ? 'Renta Tradicional' : 'Renta Airbnb'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6F6456]">Ingreso Bruto Mensual:</span>
              <span className="font-mono font-bold text-emerald-800">
                +{formatCurrency(results.grossMonthlyIncome, property.currency)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6F6456]">Ingreso Efectivo (Neto vacancia):</span>
              <span className="font-mono font-semibold text-[#091C2C]">
                {formatCurrency(results.effectiveGrossMonthlyIncome, property.currency)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6F6456]">Gastos Op. (Mantenimiento, etc.):</span>
              <span className="font-mono text-red-600">
                -{formatCurrency(results.totalOperatingExpensesMonthly, property.currency)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6F6456]">SUNAT 1ra Cat. (5%):</span>
              <span className="font-mono text-[#091C2C]">
                {formatCurrency(results.sunatTaxMonthly, property.currency)}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-[#091C2C] font-bold">
              <span>Flujo Neto Mensual:</span>
              <span className={`font-mono text-sm ${isPositiveCashFlow ? 'text-emerald-800' : 'text-red-700'}`}>
                {formatCurrency(results.netCashFlowMonthly, property.currency)}
              </span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
