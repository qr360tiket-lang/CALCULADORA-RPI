import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  ShieldCheck, 
  Calculator, 
  MapPin, 
  CheckCircle2, 
  HelpCircle,
  TrendingUp,
  Coins
} from 'lucide-react';
import { Currency } from '../types/realEstate';
import { formatCurrency } from '../utils/formatters';

interface InvestmentRangeModalProps {
  currency: Currency;
  exchangeRate: number;
  onClose: () => void;
  onApplyBudget?: (price: number) => void;
}

export const InvestmentRangeModal: React.FC<InvestmentRangeModalProps> = ({
  currency,
  exchangeRate,
  onClose,
  onApplyBudget,
}) => {
  const [userSavings, setUserSavings] = useState<number>(currency === 'PEN' ? 70000 : 20000);
  const [downPaymentTargetPct, setDownPaymentTargetPct] = useState<number>(20);

  // Estimación de gastos de cierre (~3.5% del precio si paga alcabala, o 2% si estreno)
  const estimatedClosingPct = 3.5;
  const effectiveEquityRequiredPct = (downPaymentTargetPct + estimatedClosingPct) / 100;
  const maxAffordablePrice = userSavings > 0 ? Math.round(userSavings / effectiveEquityRequiredPct) : 0;
  const estimatedMonthlyMortgage = Math.round((maxAffordablePrice * (1 - downPaymentTargetPct / 100)) * 0.0075);
  const recommendedMonthlyIncome = Math.round(estimatedMonthlyMortgage / 0.30); // Regla del 30%

  const districtsData = [
    { district: 'Jesús María', avgM2Pen: 6500, avgM2Usd: 1730, rentYield: '6.2%', bestFor: 'Familias y jóvenes profesionales' },
    { district: 'Miraflores', avgM2Pen: 8800, avgM2Usd: 2350, rentYield: '5.2%', bestFor: 'Plusvalía sólida y alquiler tradicional' },
    { district: 'Barranco', avgM2Pen: 9200, avgM2Usd: 2450, rentYield: '7.8%', bestFor: 'Renta corta vacacional (Airbnb)' },
    { district: 'San Miguel / Magdalena', avgM2Pen: 5800, avgM2Usd: 1550, rentYield: '6.5%', bestFor: 'Primera vivienda y flujo de caja' },
    { district: 'Santiago de Surco', avgM2Pen: 6800, avgM2Usd: 1810, rentYield: '5.5%', bestFor: 'Familias y departamentos amplios' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-[#DDD5C3] shadow-2xl max-w-3xl w-full p-6 sm:p-8 space-y-6 my-auto text-[#081827] animate-in fade-in zoom-in-95 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#DDD5C3]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#00875A] text-white flex items-center justify-center shadow-md">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif-title font-bold text-xl sm:text-2xl text-[#081827]">
                  Ficha: Rango de Inversión y Capacidad
                </h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Guía Principiantes
                </span>
              </div>
              <p className="text-xs text-[#6F6456] mt-0.5">
                Calcula cuánto puedes comprar según tu capital disponible y compara los tickets promedio en Lima.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto pr-1 space-y-6 flex-1 text-xs">
          
          {/* Interactive Calculator: ¿Cuánto tienes ahorrado? */}
          <div className="p-5 rounded-2xl bg-[#F8F7F3] border border-[#DDD5C3] space-y-4">
            <div className="flex items-center gap-2 font-bold text-sm text-[#081827]">
              <Coins className="w-4 h-4 text-[#D8B66D]" />
              <span>Simulador de Capacidad de Compra Inmobiliaria</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#081827] mb-1">
                  Tu capital propio ahorrado (Para cuota inicial + gastos):
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono font-bold text-[#D8B66D]">
                    {currency === 'PEN' ? 'S/.' : '$'}
                  </span>
                  <input
                    type="number"
                    min="5000"
                    step="5000"
                    value={userSavings}
                    onChange={(e) => setUserSavings(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-[#DDD5C3] font-mono text-sm font-bold text-[#081827]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#081827] mb-1">
                  Porcentaje de cuota inicial que planeas dar:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[10, 20, 30].map(pct => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => setDownPaymentTargetPct(pct)}
                      className={`py-2 text-xs font-mono font-bold rounded-xl border transition-all ${
                        downPaymentTargetPct === pct
                          ? 'bg-[#091C2C] text-[#D8B66D] border-[#091C2C]'
                          : 'bg-white text-[#081827] border-[#DDD5C3]'
                      }`}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Resulting affordable range */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-[#DDD5C3]/40">
              <div className="p-3 bg-white rounded-xl border border-[#DDD5C3]">
                <span className="text-[10px] text-[#6F6456] block uppercase font-mono">Precio Máximo Sugerido</span>
                <span className="font-mono text-base font-bold text-[#081827]">
                  {formatCurrency(maxAffordablePrice, currency)}
                </span>
                <span className="text-[10px] text-[#6F6456] block mt-0.5">
                  Incluye provisión de Notaría/Alcabala
                </span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-[#DDD5C3]">
                <span className="text-[10px] text-[#6F6456] block uppercase font-mono">Cuota Hipotecaria Estimada</span>
                <span className="font-mono text-base font-bold text-amber-800">
                  ~{formatCurrency(estimatedMonthlyMortgage, currency)} / mes
                </span>
                <span className="text-[10px] text-[#6F6456] block mt-0.5">
                  A 20 años al 8% TEA
                </span>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-300">
                <span className="text-[10px] text-emerald-800 block uppercase font-mono">Ingreso Mensual Recomendado</span>
                <span className="font-mono text-base font-bold text-emerald-950">
                  ~{formatCurrency(recommendedMonthlyIncome, currency)} / mes
                </span>
                <span className="text-[10px] text-emerald-800 block mt-0.5">
                  Regla bancaria SBS: Máx 30% de cuota
                </span>
              </div>
            </div>

            {onApplyBudget && maxAffordablePrice > 0 && (
              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={() => {
                    onApplyBudget(maxAffordablePrice);
                    onClose();
                  }}
                  className="px-4 py-2 bg-[#00875A] hover:bg-[#00704A] text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Usar este precio ({formatCurrency(maxAffordablePrice, currency)}) en la calculadora
                </button>
              </div>
            )}
          </div>

          {/* Reference Table by District in Lima */}
          <div className="space-y-2">
            <h4 className="font-bold text-xs text-[#081827] uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#D8B66D]" />
              <span>Referencias de Mercado en Lima (Precios / m² & Rentabilidad)</span>
            </h4>
            
            <div className="overflow-x-auto rounded-xl border border-[#DDD5C3]">
              <table className="w-full text-left text-xs divide-y divide-[#DDD5C3]">
                <thead className="bg-[#F8F7F3] font-mono text-[11px] text-[#6F6456]">
                  <tr>
                    <th className="p-2.5">Distrito</th>
                    <th className="p-2.5">Precio Promedio m²</th>
                    <th className="p-2.5">Rentabilidad (Cap Rate)</th>
                    <th className="p-2.5">Perfil Ideal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DDD5C3]/40">
                  {districtsData.map((d, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="p-2.5 font-bold text-[#081827]">{d.district}</td>
                      <td className="p-2.5 font-mono">
                        {currency === 'PEN' ? `S/. ${d.avgM2Pen.toLocaleString()}` : `$ ${d.avgM2Usd.toLocaleString()}`} / m²
                      </td>
                      <td className="p-2.5 font-mono font-bold text-emerald-800">{d.rentYield}</td>
                      <td className="p-2.5 text-[#6F6456]">{d.bestFor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Golden Rules for First-Time Buyers */}
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-300 text-xs text-amber-950 space-y-2">
            <h4 className="font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              <span>3 Consejos de Seguridad para tu Primera Compra en Perú:</span>
            </h4>
            <ul className="space-y-1 pl-4 list-disc">
              <li>
                <strong>Verifica si paga Alcabala:</strong> Si compras en planos o de estreno a la constructora, estás exonerado del 3% de Alcabala (ahorro sustancial de dinero).
              </li>
              <li>
                <strong>Revisa la Partida Registral en SUNARP:</strong> Solicita un CRI (Certificado Registral Inmobiliario) para descartar gravámenes, hipotecas previas o embargos.
              </li>
              <li>
                <strong>Mantén un Colchón de Emergencia:</strong> Guarda al menos 3 cuotas hipotecarias en una cuenta de ahorros para contingencias de vacancia o cambio de inquilino.
              </li>
            </ul>
          </div>

        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-[#DDD5C3]">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-[#091C2C] text-white font-bold text-xs rounded-xl hover:bg-[#1a3854] transition-colors cursor-pointer"
          >
            Cerrar Ficha
          </button>
        </div>

      </div>
    </div>
  );
};
