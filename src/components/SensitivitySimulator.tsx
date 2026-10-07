import React, { useState } from 'react';
import { 
  X, 
  Sliders, 
  RotateCcw, 
  TrendingUp, 
  TrendingDown, 
  ArrowRight,
  ShieldAlert,
  Percent,
  DollarSign
} from 'lucide-react';
import { PropertyData, FinancialCalculationResult, SensitivityParams } from '../types/realEstate';
import { calculateRealEstateMetrics } from '../utils/realEstateCalculations';
import { formatCurrency, formatPct } from '../utils/formatters';

interface SensitivitySimulatorProps {
  property: PropertyData;
  baseResults: FinancialCalculationResult;
  onClose: () => void;
}

const DEFAULT_SENSITIVITY: SensitivityParams = {
  rentVariationPct: 0,
  vacancyRatePct: 6,
  teaDeltaPct: 0,
  purchasePriceDiscountPct: 0,
};

export const SensitivitySimulator: React.FC<SensitivitySimulatorProps> = ({
  property,
  baseResults,
  onClose,
}) => {
  const [params, setParams] = useState<SensitivityParams>({
    rentVariationPct: 0,
    vacancyRatePct: property.vacancyRatePct,
    teaDeltaPct: 0,
    purchasePriceDiscountPct: 0,
  });

  const stressedResults = calculateRealEstateMetrics(property, params);

  const cashFlowDiff = stressedResults.netCashFlowMonthly - baseResults.netCashFlowMonthly;
  const capRateDiff = stressedResults.capRatePct - baseResults.capRatePct;
  const cocDiff = stressedResults.cashOnCashReturnPct - baseResults.cashOnCashReturnPct;

  const handleReset = () => {
    setParams({
      rentVariationPct: 0,
      vacancyRatePct: property.vacancyRatePct,
      teaDeltaPct: 0,
      purchasePriceDiscountPct: 0,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-[#DDD5C3] shadow-2xl max-w-4xl w-full p-6 sm:p-8 space-y-6 my-auto text-[#091C2C] animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#DDD5C3]/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#091C2C] text-[#D8B66D] flex items-center justify-center">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-title font-bold text-xl sm:text-2xl text-[#091C2C]">
                Simulador de Sensibilidad & Estrés Financiero
              </h3>
              <p className="text-xs sm:text-sm text-[#6F6456]">
                Evalúa qué sucede ante cambios en la renta, vacancia, tasa bancaria o precio negociado.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="text-xs font-semibold text-[#6F6456] hover:text-[#091C2C] flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#DDD5C3] bg-[#FBF9F5] transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restablecer</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 4 Interactive Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#FBF9F5] p-5 rounded-2xl border border-[#DDD5C3]">
          
          {/* Slider 1: Renta (+/- %) */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="font-semibold text-[#091C2C]">
                Variación de la Renta Mensual:
              </span>
              <span className={`font-mono font-bold ${params.rentVariationPct >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                {params.rentVariationPct >= 0 ? `+${params.rentVariationPct}%` : `${params.rentVariationPct}%`}
              </span>
            </div>
            <input
              type="range"
              min="-25"
              max="25"
              step="5"
              value={params.rentVariationPct}
              onChange={(e) => setParams({ ...params, rentVariationPct: Number(e.target.value) })}
              className="w-full accent-[#091C2C] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#6F6456] font-mono mt-0.5">
              <span>-25% (Crisis)</span>
              <span>0% (Base)</span>
              <span>+25% (Optimista)</span>
            </div>
          </div>

          {/* Slider 2: Vacancia */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="font-semibold text-[#091C2C]">
                Tasa de Vacancia Anual:
              </span>
              <span className="font-mono font-bold text-[#091C2C]">
                {params.vacancyRatePct}% ({((params.vacancyRatePct / 100) * 12).toFixed(1)} meses/año)
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="25"
              step="1"
              value={params.vacancyRatePct}
              onChange={(e) => setParams({ ...params, vacancyRatePct: Number(e.target.value) })}
              className="w-full accent-[#091C2C] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#6F6456] font-mono mt-0.5">
              <span>0% (Ocupación total)</span>
              <span>8% (~1 mes)</span>
              <span>25% (3 meses vacante)</span>
            </div>
          </div>

          {/* Slider 3: TEA Bancaria (+/- %) */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="font-semibold text-[#091C2C]">
                Variación de Tasa Bancaria (TEA):
              </span>
              <span className="font-mono font-bold text-[#091C2C]">
                {(property.teaPct + params.teaDeltaPct).toFixed(1)}% ({params.teaDeltaPct >= 0 ? `+${params.teaDeltaPct.toFixed(1)}%` : `${params.teaDeltaPct.toFixed(1)}%`})
              </span>
            </div>
            <input
              type="range"
              min="-2"
              max="3"
              step="0.5"
              disabled={property.financingMode === 'contado'}
              value={params.teaDeltaPct}
              onChange={(e) => setParams({ ...params, teaDeltaPct: Number(e.target.value) })}
              className="w-full accent-[#091C2C] cursor-pointer disabled:opacity-50"
            />
            <div className="flex justify-between text-[10px] text-[#6F6456] font-mono mt-0.5">
              <span>-2.0% (Baja tasas)</span>
              <span>0.0% (Base)</span>
              <span>+3.0% (Alza tasas)</span>
            </div>
          </div>

          {/* Slider 4: Descuento en Precio de Compra */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="font-semibold text-[#091C2C]">
                Descuento Negociado en Compra:
              </span>
              <span className={`font-mono font-bold ${params.purchasePriceDiscountPct <= 0 ? 'text-emerald-700' : 'text-[#091C2C]'}`}>
                {params.purchasePriceDiscountPct}% ({formatCurrency(stressedResults.purchasePrice, property.currency)})
              </span>
            </div>
            <input
              type="range"
              min="-20"
              max="5"
              step="1"
              value={params.purchasePriceDiscountPct}
              onChange={(e) => setParams({ ...params, purchasePriceDiscountPct: Number(e.target.value) })}
              className="w-full accent-[#091C2C] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#6F6456] font-mono mt-0.5">
              <span>-20% (Gran descuento)</span>
              <span>0% (Precio lista)</span>
              <span>+5% (Sobreprecio)</span>
            </div>
          </div>

        </div>

        {/* COMPARISON RESULT: Base vs Stressed */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {/* Card 1: Cash Flow Mensual */}
          <div className="p-4 rounded-xl border border-[#DDD5C3] bg-[#F6F4EF]">
            <span className="text-[11px] font-mono uppercase text-[#6F6456] block mb-1">
              Cash Flow Mensual Neto
            </span>
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs text-[#6F6456] block">Base:</span>
                <span className="font-mono font-bold text-sm text-[#091C2C]">
                  {formatCurrency(baseResults.netCashFlowMonthly, property.currency)}
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-[#DDD5C3]" />
              <div className="text-right">
                <span className="text-xs text-[#6F6456] block">Simulado:</span>
                <span className={`font-mono font-bold text-base ${
                  stressedResults.netCashFlowMonthly >= 0 ? 'text-emerald-800' : 'text-red-700'
                }`}>
                  {formatCurrency(stressedResults.netCashFlowMonthly, property.currency)}
                </span>
              </div>
            </div>
            <div className="mt-2 pt-1.5 border-t border-[#DDD5C3]/40 flex justify-between text-[11px] font-mono">
              <span className="text-[#6F6456]">Diferencia:</span>
              <span className={`font-bold ${cashFlowDiff >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                {cashFlowDiff >= 0 ? `+${formatCurrency(cashFlowDiff, property.currency)}` : formatCurrency(cashFlowDiff, property.currency)}
              </span>
            </div>
          </div>

          {/* Card 2: Cap Rate */}
          <div className="p-4 rounded-xl border border-[#DDD5C3] bg-[#F6F4EF]">
            <span className="text-[11px] font-mono uppercase text-[#6F6456] block mb-1">
              Cap Rate Anual
            </span>
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs text-[#6F6456] block">Base:</span>
                <span className="font-mono font-bold text-sm text-[#091C2C]">
                  {formatPct(baseResults.capRatePct)}
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-[#DDD5C3]" />
              <div className="text-right">
                <span className="text-xs text-[#6F6456] block">Simulado:</span>
                <span className="font-mono font-bold text-base text-[#091C2C]">
                  {formatPct(stressedResults.capRatePct)}
                </span>
              </div>
            </div>
            <div className="mt-2 pt-1.5 border-t border-[#DDD5C3]/40 flex justify-between text-[11px] font-mono">
              <span className="text-[#6F6456]">Diferencia:</span>
              <span className={`font-bold ${capRateDiff >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                {capRateDiff >= 0 ? `+${capRateDiff.toFixed(2)}%` : `${capRateDiff.toFixed(2)}%`}
              </span>
            </div>
          </div>

          {/* Card 3: Cash-on-Cash */}
          <div className="p-4 rounded-xl border border-[#DDD5C3] bg-[#F6F4EF]">
            <span className="text-[11px] font-mono uppercase text-[#6F6456] block mb-1">
              Cash-on-Cash Return
            </span>
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs text-[#6F6456] block">Base:</span>
                <span className="font-mono font-bold text-sm text-[#091C2C]">
                  {formatPct(baseResults.cashOnCashReturnPct)}
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-[#DDD5C3]" />
              <div className="text-right">
                <span className="text-xs text-[#6F6456] block">Simulado:</span>
                <span className={`font-mono font-bold text-base ${
                  stressedResults.cashOnCashReturnPct >= 7 ? 'text-emerald-800' : 'text-[#091C2C]'
                }`}>
                  {formatPct(stressedResults.cashOnCashReturnPct)}
                </span>
              </div>
            </div>
            <div className="mt-2 pt-1.5 border-t border-[#DDD5C3]/40 flex justify-between text-[11px] font-mono">
              <span className="text-[#6F6456]">Diferencia:</span>
              <span className={`font-bold ${cocDiff >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                {cocDiff >= 0 ? `+${cocDiff.toFixed(2)}%` : `${cocDiff.toFixed(2)}%`}
              </span>
            </div>
          </div>

        </div>

        {/* Close Button */}
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 bg-[#091C2C] text-[#F6F4EF] font-bold text-xs rounded-xl hover:bg-[#1a3854] transition-colors"
          >
            Cerrar Simulador
          </button>
        </div>

      </div>
    </div>
  );
};
