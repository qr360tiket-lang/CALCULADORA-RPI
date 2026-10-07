import React from 'react';
import { 
  Scale, 
  Trophy, 
  Building2, 
  CheckCircle2, 
  ArrowRight, 
  Plus, 
  Trash2,
  Sparkles
} from 'lucide-react';
import { PropertyData } from '../types/realEstate';
import { calculateRealEstateMetrics } from '../utils/realEstateCalculations';
import { formatCurrency, formatPct } from '../utils/formatters';

interface ComparisonViewProps {
  properties: PropertyData[];
  activePropertyId: string;
  onSelectProperty: (id: string) => void;
  onNewProperty: () => void;
  onDeleteProperty: (id: string) => void;
  onCloseComparison: () => void;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({
  properties,
  activePropertyId,
  onSelectProperty,
  onNewProperty,
  onDeleteProperty,
  onCloseComparison,
}) => {
  // Calcular métricas para cada propiedad
  const comparedList = properties.map((prop) => ({
    prop,
    res: calculateRealEstateMetrics(prop),
  }));

  // Encontrar mejores en métricas clave
  const highestCapRate = Math.max(...comparedList.map(c => c.res.capRatePct));
  const highestCashFlow = Math.max(...comparedList.map(c => c.res.netCashFlowMonthly));
  const highestCoC = Math.max(...comparedList.map(c => c.res.cashOnCashReturnPct));

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-[#DDD5C3] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Scale className="w-5 h-5 text-[#D8B66D]" />
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#D8B66D] font-bold">
              Análisis Comparativo Multi-Inmueble
            </span>
          </div>
          <h2 className="font-serif-title text-2xl font-bold text-[#091C2C]">
            Comparativa de Propiedades Guardadas ({properties.length})
          </h2>
          <p className="text-xs sm:text-sm text-[#6F6456] mt-0.5">
            Compara lado a lado tus alternativas de inversión inmobiliaria para tomar la mejor decisión de compra.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onNewProperty}
            className="px-4 py-2 bg-[#D8B66D] hover:bg-[#c9a656] text-[#091C2C] font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Agregar Inmueble</span>
          </button>
          <button
            type="button"
            onClick={onCloseComparison}
            className="px-4 py-2 bg-[#F6F4EF] hover:bg-[#EBE5D8] text-[#091C2C] font-semibold text-xs rounded-xl border border-[#DDD5C3] transition-colors cursor-pointer"
          >
            Volver a la Calculadora
          </button>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-white rounded-2xl border border-[#DDD5C3] shadow-xs overflow-x-auto">
        <table className="w-full text-left text-xs divide-y divide-[#DDD5C3]">
          
          {/* Header Row */}
          <thead className="bg-[#FBF9F5]">
            <tr>
              <th className="p-4 w-56 font-bold text-[#091C2C] text-sm">
                Criterio / Propiedad
              </th>
              {comparedList.map(({ prop }) => (
                <th key={prop.id} className={`p-4 min-w-[240px] align-top ${prop.id === activePropertyId ? 'bg-[#D8B66D]/10' : ''}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#D8B66D] font-bold block">
                        {prop.district} · {prop.currency}
                      </span>
                      <h4 className="font-serif-title font-bold text-base text-[#091C2C]">
                        {prop.title}
                      </h4>
                      <span className="text-[11px] text-[#6F6456] capitalize">
                        {prop.propertyType} • {prop.rentalStrategy === 'tradicional' ? 'Renta tradicional' : 'Renta Airbnb'}
                      </span>
                    </div>
                    {properties.length > 1 && (
                      <button
                        type="button"
                        onClick={() => onDeleteProperty(prop.id)}
                        className="text-gray-400 hover:text-red-500 p-1"
                        title="Eliminar propiedad"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="mt-3">
                    {prop.id === activePropertyId ? (
                      <span className="inline-block px-2.5 py-1 rounded-md bg-[#091C2C] text-[#D8B66D] text-[10px] font-bold uppercase font-mono">
                        Propiedad Activa
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          onSelectProperty(prop.id);
                          onCloseComparison();
                        }}
                        className="text-[11px] font-bold text-[#091C2C] hover:text-[#D8B66D] underline flex items-center gap-1"
                      >
                        <span>Cargar en calculadora</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Body Rows */}
          <tbody className="divide-y divide-[#DDD5C3]/40">
            
            {/* 1. Precio de Compra */}
            <tr className="hover:bg-[#FBF9F5]/50">
              <td className="p-4 font-semibold text-[#091C2C]">
                Precio de Compra Pactado
              </td>
              {comparedList.map(({ prop, res }) => (
                <td key={prop.id} className={`p-4 font-mono font-bold text-sm ${prop.id === activePropertyId ? 'bg-[#D8B66D]/5' : ''}`}>
                  {formatCurrency(res.purchasePrice, prop.currency)}
                </td>
              ))}
            </tr>

            {/* 2. Precio por m2 */}
            <tr className="hover:bg-[#FBF9F5]/50">
              <td className="p-4 font-semibold text-[#091C2C]">
                Área Techada y Precio / m²
              </td>
              {comparedList.map(({ prop, res }) => (
                <td key={prop.id} className={`p-4 font-mono ${prop.id === activePropertyId ? 'bg-[#D8B66D]/5' : ''}`}>
                  {prop.areaM2} m² ({formatCurrency(res.pricePerM2, prop.currency)}/m²)
                </td>
              ))}
            </tr>

            {/* 3. Inversión Inicial Total */}
            <tr className="hover:bg-[#FBF9F5]/50">
              <td className="p-4 font-semibold text-[#091C2C]">
                Capital Propio Desembolsado
                <span className="text-[10px] text-[#6F6456] block">Inicial + Notaría + SUNARP + Alcabala</span>
              </td>
              {comparedList.map(({ prop, res }) => (
                <td key={prop.id} className={`p-4 font-mono font-bold ${prop.id === activePropertyId ? 'bg-[#D8B66D]/5' : ''}`}>
                  {formatCurrency(res.totalInitialInvestmentRequired, prop.currency)}
                  <span className="text-[11px] text-[#6F6456] block font-normal">
                    Inicial: {prop.downPaymentPct}% ({formatCurrency(res.downPaymentAmount, prop.currency)})
                  </span>
                </td>
              ))}
            </tr>

            {/* 4. Modalidad y Cuota Bancaria */}
            <tr className="hover:bg-[#FBF9F5]/50">
              <td className="p-4 font-semibold text-[#091C2C]">
                Cuota Mensual Hipotecaria
              </td>
              {comparedList.map(({ prop, res }) => (
                <td key={prop.id} className={`p-4 font-mono ${prop.id === activePropertyId ? 'bg-[#D8B66D]/5' : ''}`}>
                  {prop.financingMode === 'contado' ? (
                    <span className="text-emerald-700 font-bold">S/. 0 (Al Contado)</span>
                  ) : (
                    <>
                      <span className="font-bold text-amber-900 block">
                        {formatCurrency(res.totalMonthlyMortgagePayment, prop.currency)} / mes
                      </span>
                      <span className="text-[10px] text-[#6F6456]">
                        {prop.loanTermYears} años · TEA {prop.teaPct}%
                      </span>
                    </>
                  )}
                </td>
              ))}
            </tr>

            {/* 5. Ingreso Efectivo Mensual */}
            <tr className="hover:bg-[#FBF9F5]/50">
              <td className="p-4 font-semibold text-[#091C2C]">
                Ingreso Bruto Efectivo
                <span className="text-[10px] text-[#6F6456] block">Descontada vacancia</span>
              </td>
              {comparedList.map(({ prop, res }) => (
                <td key={prop.id} className={`p-4 font-mono font-bold text-emerald-800 ${prop.id === activePropertyId ? 'bg-[#D8B66D]/5' : ''}`}>
                  +{formatCurrency(res.effectiveGrossMonthlyIncome, prop.currency)} / mes
                </td>
              ))}
            </tr>

            {/* 6. Cash Flow Mensual Neto (HIGHLIGHT) */}
            <tr className="bg-[#F6F4EF]/80 font-bold">
              <td className="p-4 text-[#091C2C]">
                <div className="flex items-center gap-1">
                  <span>Cash Flow Mensual Neto</span>
                  <Sparkles className="w-3.5 h-3.5 text-[#D8B66D]" />
                </div>
              </td>
              {comparedList.map(({ prop, res }) => {
                const isWinner = res.netCashFlowMonthly === highestCashFlow && properties.length > 1;
                return (
                  <td key={prop.id} className={`p-4 ${prop.id === activePropertyId ? 'bg-[#D8B66D]/15' : ''}`}>
                    <div className="flex items-center gap-1.5">
                      <span className={`font-mono text-base ${res.netCashFlowMonthly >= 0 ? 'text-emerald-800' : 'text-red-700'}`}>
                        {formatCurrency(res.netCashFlowMonthly, prop.currency)}
                      </span>
                      {isWinner && (
                        <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-mono">
                          Mayor flujo
                        </span>
                      )}
                    </div>
                  </td>
                );
              })}
            </tr>

            {/* 7. Cap Rate Anual */}
            <tr className="hover:bg-[#FBF9F5]/50">
              <td className="p-4 font-semibold text-[#091C2C]">
                Cap Rate Anual
              </td>
              {comparedList.map(({ prop, res }) => {
                const isWinner = res.capRatePct === highestCapRate && properties.length > 1;
                return (
                  <td key={prop.id} className={`p-4 font-mono font-bold text-sm ${prop.id === activePropertyId ? 'bg-[#D8B66D]/5' : ''}`}>
                    <div className="flex items-center gap-1.5">
                      <span>{formatPct(res.capRatePct)}</span>
                      {isWinner && (
                        <span className="px-1.5 py-0.5 rounded bg-[#D8B66D] text-[#091C2C] text-[10px]">
                          Líder
                        </span>
                      )}
                    </div>
                  </td>
                );
              })}
            </tr>

            {/* 8. Cash-on-Cash Return */}
            <tr className="hover:bg-[#FBF9F5]/50">
              <td className="p-4 font-semibold text-[#091C2C]">
                Cash-on-Cash Return (CoC)
              </td>
              {comparedList.map(({ prop, res }) => {
                const isWinner = res.cashOnCashReturnPct === highestCoC && properties.length > 1;
                return (
                  <td key={prop.id} className={`p-4 font-mono font-bold ${prop.id === activePropertyId ? 'bg-[#D8B66D]/5' : ''}`}>
                    <div className="flex items-center gap-1.5">
                      <span>{formatPct(res.cashOnCashReturnPct)}</span>
                      {isWinner && (
                        <span className="px-1.5 py-0.5 rounded bg-[#D8B66D] text-[#091C2C] text-[10px]">
                          Mayor CoC
                        </span>
                      )}
                    </div>
                  </td>
                );
              })}
            </tr>

            {/* 9. Payback Period */}
            <tr className="hover:bg-[#FBF9F5]/50">
              <td className="p-4 font-semibold text-[#091C2C]">
                Años para Recuperar Inversión (Payback)
              </td>
              {comparedList.map(({ prop, res }) => (
                <td key={prop.id} className={`p-4 font-mono ${prop.id === activePropertyId ? 'bg-[#D8B66D]/5' : ''}`}>
                  {res.paybackYears ? `${res.paybackYears} años` : 'N/A (Flujo negativo)'}
                </td>
              ))}
            </tr>

            {/* 10. Salud & Veredicto */}
            <tr className="hover:bg-[#FBF9F5]/50">
              <td className="p-4 font-semibold text-[#091C2C]">
                Diagnóstico de Salud
              </td>
              {comparedList.map(({ prop, res }) => (
                <td key={prop.id} className={`p-4 ${prop.id === activePropertyId ? 'bg-[#D8B66D]/5' : ''}`}>
                  <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-bold ${
                    res.healthScore.verdict === 'excelente' || res.healthScore.verdict === 'bueno'
                      ? 'bg-emerald-100 text-emerald-800'
                      : res.healthScore.verdict === 'regular'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-red-800'
                  }`}>
                    {res.healthScore.title} ({res.healthScore.score}/100)
                  </span>
                </td>
              ))}
            </tr>

          </tbody>
        </table>
      </div>

    </div>
  );
};
