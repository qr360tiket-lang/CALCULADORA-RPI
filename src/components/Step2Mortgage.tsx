import React from 'react';
import { 
  Landmark, 
  CircleDollarSign, 
  Clock, 
  ShieldAlert, 
  BarChart3, 
  ChevronRight, 
  ChevronLeft,
  Info
} from 'lucide-react';
import { PropertyData, FinancialCalculationResult, FinancingMode } from '../types/realEstate';
import { formatCurrency, formatPct } from '../utils/formatters';
import { InfoTooltip } from './InfoTooltip';

interface Step2MortgageProps {
  property: PropertyData;
  results: FinancialCalculationResult;
  onChange: (updated: Partial<PropertyData>) => void;
  onPrev: () => void;
  onNext: () => void;
}

const TERM_PRESETS = [5, 10, 15, 20, 25, 30];

export const Step2Mortgage: React.FC<Step2MortgageProps> = ({
  property,
  results,
  onChange,
  onPrev,
  onNext,
}) => {
  const isContado = property.financingMode === 'contado';

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Intro Header */}
      <div className="bg-white rounded-2xl p-6 border border-[#DDD5C3] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#D8B66D] font-bold">
            Paso 2 de 4 · Estructura de Capital & Crédito
          </span>
          <h2 className="font-serif-title text-2xl font-bold text-[#091C2C] mt-1">
            Tus Números: Hipoteca y Financiamiento Bancario
          </h2>
          <p className="text-xs sm:text-sm text-[#6F6456] mt-1 max-w-2xl">
            Simula las condiciones de tu crédito hipotecario en el sistema financiero peruano con el sistema francés, seguro de desgravamen y seguro de todo riesgo.
          </p>
        </div>

        {/* Loan Balance Badge */}
        <div className="p-3 bg-[#FBF9F5] rounded-xl border border-[#DDD5C3] text-right">
          <span className="text-[11px] text-[#6F6456] block">Saldo a financiar</span>
          <span className="font-mono font-bold text-base text-[#091C2C]">
            {isContado ? 'S/. 0 (Al Contado)' : formatCurrency(results.loanAmount, property.currency)}
          </span>
        </div>
      </div>

      {/* Mode Selector: 100% Contado vs Hipoteca */}
      <div className="bg-white rounded-2xl p-6 border border-[#DDD5C3] shadow-xs">
        <label className="block text-xs font-bold text-[#091C2C] uppercase tracking-wider mb-3">
          Modalidad de Adquisición
        </label>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Option A: Contado */}
          <button
            type="button"
            onClick={() => onChange({ financingMode: 'contado' })}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              isContado
                ? 'bg-[#091C2C] text-[#F6F4EF] border-[#091C2C] shadow-md'
                : 'bg-[#FBF9F5] text-[#091C2C] border-[#DDD5C3] hover:border-[#D8B66D]'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <CircleDollarSign className={`w-5 h-5 ${isContado ? 'text-[#D8B66D]' : 'text-[#091C2C]'}`} />
                <span className="font-serif-title font-bold text-base">
                  Opción A: 100% al Contado
                </span>
              </div>
              {isContado && (
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#D8B66D] text-[#091C2C] font-bold">
                  Seleccionado
                </span>
              )}
            </div>
            <p className={`text-xs ${isContado ? 'text-[#DDD5C3]' : 'text-[#6F6456]'}`}>
              Pagas el 100% con capital propio. Cero cuota bancaria mensual, sin pago de intereses ni seguros de desgravamen.
            </p>
          </button>

          {/* Option B: Hipoteca */}
          <button
            type="button"
            onClick={() => onChange({ financingMode: 'hipoteca' })}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              !isContado
                ? 'bg-[#091C2C] text-[#F6F4EF] border-[#091C2C] shadow-md'
                : 'bg-[#FBF9F5] text-[#091C2C] border-[#DDD5C3] hover:border-[#D8B66D]'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Landmark className={`w-5 h-5 ${!isContado ? 'text-[#D8B66D]' : 'text-[#091C2C]'}`} />
                <span className="font-serif-title font-bold text-base">
                  Opción B: Crédito Hipotecario
                </span>
              </div>
              {!isContado && (
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#D8B66D] text-[#091C2C] font-bold">
                  Seleccionado
                </span>
              )}
            </div>
            <p className={`text-xs ${!isContado ? 'text-[#DDD5C3]' : 'text-[#6F6456]'}`}>
              Financiamiento bancario con cuota inicial ({property.downPaymentPct}%) y saldo restante financiado a plazos de 5 a 30 años.
            </p>
          </button>

        </div>
      </div>

      {/* If Hipoteca: Parameter Configuration */}
      {!isContado ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Card Left: Financing Terms */}
          <div className="bg-white rounded-2xl p-6 border border-[#DDD5C3] shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#DDD5C3]/40">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#D8B66D]" />
                <h3 className="font-serif-title font-bold text-lg text-[#091C2C]">
                  Condiciones del Préstamo
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-[#091C2C] bg-[#F6F4EF] px-2 py-1 rounded-md border border-[#DDD5C3]">
                {property.loanTermYears} Años ({property.loanTermYears * 12} Cuotas)
              </span>
            </div>

            {/* Loan Term presets */}
            <div>
              <label className="block text-xs font-semibold text-[#091C2C] mb-2">
                Plazo del crédito en años:
              </label>
              <div className="grid grid-cols-6 gap-1.5">
                {TERM_PRESETS.map((years) => (
                  <button
                    key={years}
                    type="button"
                    onClick={() => onChange({ loanTermYears: years })}
                    className={`py-2 text-xs font-mono font-bold rounded-lg border transition-all ${
                      property.loanTermYears === years
                        ? 'bg-[#091C2C] text-[#D8B66D] border-[#091C2C]'
                        : 'bg-[#FBF9F5] text-[#091C2C] border-[#DDD5C3] hover:border-[#D8B66D]'
                    }`}
                  >
                    {years}a
                  </button>
                ))}
              </div>
            </div>

            {/* Slider for Term */}
            <div>
              <div className="flex justify-between text-xs text-[#6F6456] mb-1">
                <span>5 años</span>
                <span className="font-bold text-[#091C2C]">{property.loanTermYears} años</span>
                <span>30 años</span>
              </div>
              <input
                type="range"
                min="5"
                max="30"
                step="1"
                value={property.loanTermYears}
                onChange={(e) => onChange({ loanTermYears: Number(e.target.value) })}
                className="w-full accent-[#091C2C] cursor-pointer"
              />
            </div>

            {/* Interest Rate (TEA / TCEA) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-[#091C2C] flex items-center gap-1">
                  Tasa Efectiva Anual (TEA)
                  <InfoTooltip 
                    title="Tasa Efectiva Anual (TEA)"
                    content="Tasa anual pactada con el banco. En Perú las hipotecas en soles actualmente rondan 7.5% - 9.5%, y en dólares 6.8% - 8.2%. La SBS exige convertirla a Tasa Efectiva Mensual (TEM) para el cronograma francés."
                  />
                </label>
                <span className="text-[10px] text-[#6F6456] font-mono">Bancos de Perú</span>
              </div>

              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="25"
                  value={property.teaPct}
                  onChange={(e) => onChange({ teaPct: Math.max(0.1, parseFloat(e.target.value) || 0) })}
                  className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-[#DDD5C3] bg-[#FBF9F5] font-mono text-base font-bold text-[#091C2C] focus:bg-white focus:outline-none focus:border-[#D8B66D]"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 font-mono font-bold text-[#D8B66D]">
                  % TEA
                </span>
              </div>
            </div>

            {/* Mandatory Bank Insurances in Peru (Desgravamen + Inmueble) */}
            <div className="pt-2 border-t border-[#DDD5C3]/40 space-y-4">
              <div className="flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-[#D8B66D]" />
                <span className="text-xs font-bold text-[#091C2C]">
                  Seguros Obligatorios del Sistema Peruano
                </span>
                <InfoTooltip 
                  title="Seguros en Créditos Hipotecarios"
                  content="En Perú, los bancos exigen dos seguros: 1) Seguro de Desgravamen (cubre el saldo insoluto en caso de fallecimiento o invalidez, ~0.04% a 0.07% mensual) y 2) Seguro de Inmueble contra todo riesgo/terremoto (~0.02% a 0.035% mensual del valor comercial)."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Desgravamen */}
                <div className="p-3 bg-[#FBF9F5] rounded-xl border border-[#DDD5C3]">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-[#6F6456]">Desgravamen mensual:</span>
                    <span className="font-mono font-bold text-[#091C2C]">{property.desgravamenPctMonthly}%</span>
                  </div>
                  <input
                    type="number"
                    step="0.005"
                    min="0"
                    max="0.3"
                    value={property.desgravamenPctMonthly}
                    onChange={(e) => onChange({ desgravamenPctMonthly: Math.max(0, parseFloat(e.target.value) || 0) })}
                    className="w-full px-2 py-1 text-xs font-mono font-semibold bg-white border border-[#DDD5C3] rounded-lg"
                  />
                  <span className="text-[10px] text-[#6F6456] mt-1 block">
                    {formatCurrency(results.monthlyDesgravamen, property.currency)} / mes
                  </span>
                </div>

                {/* Seguro Inmueble */}
                <div className="p-3 bg-[#FBF9F5] rounded-xl border border-[#DDD5C3]">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-[#6F6456]">Seguro Inmueble mensual:</span>
                    <span className="font-mono font-bold text-[#091C2C]">{property.propertyInsurancePctMonthly}%</span>
                  </div>
                  <input
                    type="number"
                    step="0.005"
                    min="0"
                    max="0.2"
                    value={property.propertyInsurancePctMonthly}
                    onChange={(e) => onChange({ propertyInsurancePctMonthly: Math.max(0, parseFloat(e.target.value) || 0) })}
                    className="w-full px-2 py-1 text-xs font-mono font-semibold bg-white border border-[#DDD5C3] rounded-lg"
                  />
                  <span className="text-[10px] text-[#6F6456] mt-1 block">
                    {formatCurrency(results.monthlyPropertyInsurance, property.currency)} / mes
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Card Right: French Payment Breakdown & Lifetime Interest */}
          <div className="bg-white rounded-2xl p-6 border border-[#DDD5C3] shadow-xs space-y-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#DDD5C3]/40">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-[#D8B66D]" />
                  <h3 className="font-serif-title font-bold text-lg text-[#091C2C]">
                    Cuota Mensual Total del Banco
                  </h3>
                </div>
                <span className="text-xs uppercase font-mono px-2 py-0.5 rounded bg-[#091C2C] text-[#D8B66D] font-bold">
                  Sistema Francés
                </span>
              </div>

              {/* Big Monthly Payment Display */}
              <div className="my-5 p-5 bg-[#091C2C] text-[#F6F4EF] rounded-2xl border border-[#091C2C] shadow-md">
                <span className="text-[11px] uppercase tracking-wider text-[#D8B66D] font-mono block mb-1">
                  Cuota Bancaria Total Estimada
                </span>
                <div className="font-mono text-3xl sm:text-4xl font-bold text-white tracking-tight">
                  {formatCurrency(results.totalMonthlyMortgagePayment, property.currency)}
                  <span className="text-sm font-normal text-[#DDD5C3] ml-1">/ mes</span>
                </div>
                
                {/* 3 components */}
                <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-white/10 text-xs">
                  <div>
                    <span className="text-[10px] text-[#DDD5C3]/70 block">Capital + Interés</span>
                    <span className="font-mono font-bold text-sm text-[#F6F4EF]">
                      {formatCurrency(results.monthlyAmortizationAndInterest, property.currency)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#DDD5C3]/70 block">Desgravamen</span>
                    <span className="font-mono font-bold text-sm text-[#D8B66D]">
                      {formatCurrency(results.monthlyDesgravamen, property.currency)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#DDD5C3]/70 block">Seguro Todo Riesgo</span>
                    <span className="font-mono font-bold text-sm text-[#D8B66D]">
                      {formatCurrency(results.monthlyPropertyInsurance, property.currency)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Lifetime Cost Summary */}
              <div className="bg-[#F6F4EF] p-4 rounded-xl border border-[#DDD5C3] space-y-3">
                <h4 className="text-xs font-bold text-[#091C2C] uppercase tracking-wider">
                  Desglose Total a lo largo de los {property.loanTermYears} Años
                </h4>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#6F6456]">Capital prestado originalmente:</span>
                  <span className="font-mono font-bold text-[#091C2C]">
                    {formatCurrency(results.loanAmount, property.currency)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#6F6456]">Intereses acumulados pagados al banco:</span>
                  <span className="font-mono font-bold text-amber-700">
                    {formatCurrency(results.totalLoanInterestPaid, property.currency)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-[#DDD5C3]/40">
                  <span className="font-bold text-[#091C2C]">Total desembolsado en amortización:</span>
                  <span className="font-mono font-bold text-sm text-[#091C2C]">
                    {formatCurrency(results.totalLoanPaid, property.currency)}
                  </span>
                </div>

                {/* Ratio Bar: Capital vs Interés */}
                <div className="space-y-1 pt-1">
                  <div className="w-full h-3 bg-[#DDD5C3] rounded-full overflow-hidden flex">
                    <div 
                      className="bg-[#091C2C] h-full" 
                      style={{ 
                        width: `${results.totalLoanPaid > 0 ? (results.loanAmount / results.totalLoanPaid) * 100 : 50}%` 
                      }}
                      title="Capital Amortizado"
                    />
                    <div 
                      className="bg-[#D8B66D] h-full" 
                      style={{ 
                        width: `${results.totalLoanPaid > 0 ? (results.totalLoanInterestPaid / results.totalLoanPaid) * 100 : 50}%` 
                      }}
                      title="Intereses Pagados"
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-[#6F6456] font-mono">
                    <span>■ Capital ({results.totalLoanPaid > 0 ? ((results.loanAmount / results.totalLoanPaid) * 100).toFixed(0) : 0}%)</span>
                    <span>■ Intereses ({results.totalLoanPaid > 0 ? ((results.totalLoanInterestPaid / results.totalLoanPaid) * 100).toFixed(0) : 0}%)</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Hint message */}
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Estrategia con el Alquiler</p>
                <p className="text-[11px] text-blue-800">
                  En el Paso 3 compararemos si la renta de esta propiedad ({property.district}) cubre íntegramente esta cuota de {formatCurrency(results.totalMonthlyMortgagePayment, property.currency)}/mes.
                </p>
              </div>
            </div>

          </div>

        </div>
      ) : (
        /* View if 100% Contado */
        <div className="bg-white rounded-2xl p-8 border border-[#DDD5C3] text-center max-w-xl mx-auto space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-800 flex items-center justify-center mx-auto">
            <CircleDollarSign className="w-7 h-7 text-emerald-700" />
          </div>
          <h3 className="font-serif-title text-xl font-bold text-[#091C2C]">
            Adquisición 100% al Contado
          </h3>
          <p className="text-xs sm:text-sm text-[#6F6456] leading-relaxed">
            Has seleccionado comprar sin crédito bancario. Tu flujo de caja mensual no tendrá deducción de hipoteca ni pago de intereses, maximizando la liquidez inmediata que ingresa a tu cuenta.
          </p>
          <div className="p-3 bg-[#F6F4EF] rounded-xl border border-[#DDD5C3] inline-block font-mono text-sm font-bold text-[#091C2C]">
            Cuota bancaria mensual: {formatCurrency(0, property.currency)}
          </div>
        </div>
      )}

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-[#DDD5C3]/40">
        <button
          type="button"
          onClick={onPrev}
          className="px-5 py-2.5 rounded-xl border border-[#DDD5C3] bg-white hover:bg-[#F6F4EF] text-[#091C2C] font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Volver al Paso 1</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="px-6 py-2.5 rounded-xl bg-[#091C2C] hover:bg-[#15344f] text-[#F6F4EF] font-bold text-xs flex items-center gap-1.5 shadow-md transition-colors cursor-pointer"
        >
          <span>Continuar al Paso 3: Renta & Gastos Operativos</span>
          <ChevronRight className="w-4 h-4 text-[#D8B66D]" />
        </button>
      </div>

    </div>
  );
};
