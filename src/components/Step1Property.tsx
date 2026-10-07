import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Percent, 
  Coins, 
  HelpCircle, 
  Plus, 
  Trash2, 
  Sparkles, 
  ShieldCheck, 
  Scale, 
  AlertCircle,
  ChevronRight
} from 'lucide-react';
import { PropertyData, FinancialCalculationResult, PropertyType } from '../types/realEstate';
import { formatCurrency, formatNumber, PERUVIAN_DISTRICTS } from '../utils/formatters';
import { InfoTooltip } from './InfoTooltip';

interface Step1PropertyProps {
  property: PropertyData;
  results: FinancialCalculationResult;
  onChange: (updated: Partial<PropertyData>) => void;
  onNext: () => void;
}

export const Step1Property: React.FC<Step1PropertyProps> = ({
  property,
  results,
  onChange,
  onNext,
}) => {
  const [newExpenseName, setNewExpenseName] = useState('');
  const [newExpenseAmount, setNewExpenseAmount] = useState('');
  const [showAddExpense, setShowAddExpense] = useState(false);

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpenseName.trim() || isNaN(Number(newExpenseAmount))) return;
    
    const newItems = [
      ...property.extraInitialExpenses,
      {
        id: `extra-${Date.now()}`,
        name: newExpenseName.trim(),
        amount: Math.max(0, Number(newExpenseAmount)),
        isCustom: true,
      },
    ];
    onChange({ extraInitialExpenses: newItems });
    setNewExpenseName('');
    setNewExpenseAmount('');
    setShowAddExpense(false);
  };

  const handleRemoveExpense = (id: string) => {
    const newItems = property.extraInitialExpenses.filter(item => item.id !== id);
    onChange({ extraInitialExpenses: newItems });
  };

  const quickDownPaymentOptions = [10, 20, 30, 50];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Dark Navy Step Header Banner (Exact design from screenshot) */}
      <div className="bg-[#091C2C] text-[#F6F4EF] rounded-2xl p-6 sm:p-7 border border-[#D8B66D]/30 shadow-md">
        <div className="inline-block px-3 py-1 rounded-md bg-white/10 text-[#D8B66D] font-mono text-xs font-bold uppercase tracking-wider mb-2.5">
          PASO 1 DE 3
        </div>
        <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Datos de la Propiedad e Inversión Inicial
        </h2>
        <p className="text-xs sm:text-sm text-[#DDD5C3]/90 mt-1.5 max-w-3xl leading-relaxed">
          Ingresa la información base del inmueble. Los impuestos y trámites no se asumen automáticamente: introdúcelos según tus cotizaciones o marca <strong className="text-[#D8B66D]">“No lo sé todavía”</strong> para recordar validarlos.
        </p>
      </div>

      {/* Main 2-Column Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
        {/* LEFT COLUMN: IDENTIFICACIÓN DEL INMUEBLE */}
        <div className="bg-white rounded-2xl p-6 border border-[#DDD5C3] shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#DDD5C3]/40">
            <h3 className="font-serif-title font-bold text-base sm:text-lg text-[#081827] uppercase tracking-wide">
              IDENTIFICACIÓN DEL INMUEBLE
            </h3>
            <InfoTooltip
              title="Identificación del Inmueble"
              content="Datos referenciales para registrar el proyecto inmobiliario en tu portafolio."
            />
          </div>

          {/* Nombre o referencia de la propiedad */}
          <div>
            <label className="block text-xs font-bold text-[#081827] mb-1.5 flex items-center gap-1">
              <span>Nombre o referencia de la propiedad</span>
              <InfoTooltip
                title="Nombre o Referencia"
                content="Nombre comercial del proyecto o apodo interno (ej. 'proyecto salaverry', 'depa miraflores')."
              />
            </label>
            <input
              type="text"
              value={property.title}
              onChange={(e) => onChange({ title: e.target.value })}
              placeholder="ej. proyecto salaverry"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD5C3] bg-[#FBF9F5] text-sm text-[#081827] focus:bg-white focus:outline-none focus:border-[#D8B66D] transition-colors"
            />
          </div>

          {/* Ubicación (Distrito, ciudad o zona) */}
          <div>
            <label className="block text-xs font-bold text-[#081827] mb-1.5 flex items-center gap-1">
              <span>Ubicación (Distrito, ciudad o zona)</span>
              <InfoTooltip
                title="Ubicación"
                content="Distrito de Lima u otra ciudad del Perú donde se ubica el predio (ej. jesus maria, miraflores, surco)."
              />
            </label>
            <div className="relative">
              <input
                type="text"
                list="peru-districts-list"
                value={property.district}
                onChange={(e) => onChange({ district: e.target.value })}
                placeholder="ej. jesus maria"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD5C3] bg-[#FBF9F5] text-sm text-[#081827] focus:bg-white focus:outline-none focus:border-[#D8B66D] transition-colors"
              />
              <datalist id="peru-districts-list">
                {PERUVIAN_DISTRICTS.map(d => (
                  <option key={d} value={d} />
                ))}
              </datalist>
            </div>
          </div>

          {/* Tipo de Inmueble & Área Techada */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#081827] mb-1.5">
                Tipo de Inmueble
              </label>
              <select
                value={property.propertyType}
                onChange={(e) => onChange({ propertyType: e.target.value as PropertyType })}
                className="w-full px-3 py-2.5 rounded-xl border border-[#DDD5C3] bg-[#FBF9F5] text-sm text-[#081827] focus:bg-white focus:outline-none focus:border-[#D8B66D]"
              >
                <option value="departamento">Departamento</option>
                <option value="casa">Casa</option>
                <option value="oficina">Oficina</option>
                <option value="comercial">Local Comercial</option>
                <option value="terreno">Terreno</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#081827] mb-1.5">
                Área techada (m²)
              </label>
              <input
                type="number"
                min="0"
                value={property.areaM2 || ''}
                onChange={(e) => onChange({ areaM2: Math.max(0, parseFloat(e.target.value) || 0) })}
                placeholder="ej. 72"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD5C3] bg-[#FBF9F5] font-mono text-sm font-semibold text-[#081827] focus:bg-white focus:outline-none focus:border-[#D8B66D]"
              />
            </div>
          </div>

          {/* Precio de compra pactado */}
          <div className="pt-2 border-t border-[#DDD5C3]/40 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#081827] flex items-center gap-1">
                <span>Precio de compra pactado</span>
                <InfoTooltip
                  title="Precio de Compra"
                  content="Valor total acordado con el vendedor en la minuta de compraventa."
                />
              </label>
              
              {/* Currency badge switch */}
              <div className="flex items-center gap-1 text-[11px] font-mono">
                <span className="text-[#6F6456]">Moneda:</span>
                <span className="font-bold text-[#081827]">
                  {property.currency === 'PEN' ? 'Soles (S/.)' : 'Dólares ($)'}
                </span>
              </div>
            </div>

            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono font-bold text-base text-[#D8B66D]">
                {property.currency === 'PEN' ? 'S/.' : '$'}
              </span>
              <input
                type="number"
                min="0"
                step="1000"
                value={property.purchasePrice || ''}
                onChange={(e) => onChange({ purchasePrice: Math.max(0, parseFloat(e.target.value) || 0) })}
                placeholder="ej. 385000"
                className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-[#DDD5C3] bg-[#FBF9F5] font-mono text-lg font-bold text-[#081827] focus:bg-white focus:outline-none focus:border-[#D8B66D]"
              />
            </div>

            {/* Calculated price per m2 */}
            <div className="flex items-center justify-between text-xs text-[#6F6456] font-mono px-1">
              <span>Precio calculado por m²:</span>
              <span className="font-semibold text-[#081827]">
                {formatCurrency(results.pricePerM2, property.currency)} / m²
              </span>
            </div>
          </div>

          {/* Cuota Inicial (%) y Saldo a Financiar */}
          <div className="pt-2 border-t border-[#DDD5C3]/40 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#081827]">
                Cuota Inicial (%)
              </label>
              <span className="text-xs font-mono font-bold text-[#081827] bg-[#F6F4EF] px-2 py-0.5 rounded border border-[#DDD5C3]">
                {property.downPaymentPct}%
              </span>
            </div>

            {/* Quick buttons */}
            <div className="grid grid-cols-4 gap-2">
              {quickDownPaymentOptions.map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => onChange({ downPaymentPct: pct })}
                  className={`py-1.5 text-xs font-mono font-bold rounded-lg border transition-all cursor-pointer ${
                    property.downPaymentPct === pct
                      ? 'bg-[#091C2C] text-[#D8B66D] border-[#091C2C]'
                      : 'bg-[#FBF9F5] text-[#081827] border-[#DDD5C3] hover:border-[#D8B66D]'
                  }`}
                >
                  {pct}%
                </button>
              ))}
            </div>

            {/* Slider */}
            <input
              type="range"
              min="0"
              max="100"
              value={property.downPaymentPct}
              onChange={(e) => onChange({ downPaymentPct: Number(e.target.value) })}
              className="w-full accent-[#091C2C] cursor-pointer"
            />

            {/* Summary split box */}
            <div className="bg-[#F8F7F3] p-3.5 rounded-xl border border-[#DDD5C3] space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="font-semibold text-[#081827]">Cuota Inicial (Capital Propio):</span>
                <span className="font-mono font-bold text-[#081827]">
                  {formatCurrency(results.downPaymentAmount, property.currency)}
                </span>
              </div>
              <div className="flex justify-between pt-1 border-t border-[#DDD5C3]/40 text-[#6F6456]">
                <span>Saldo a Financiar (Hipoteca):</span>
                <span className="font-mono font-bold">
                  {formatCurrency(results.loanAmount, property.currency)}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: GASTOS INICIALES DE CIERRE (Matches exact screenshot layout) */}
        <div className="bg-white rounded-2xl p-6 border border-[#DDD5C3] shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#DDD5C3]/40">
            <div>
              <h3 className="font-serif-title font-bold text-base sm:text-lg text-[#081827] uppercase tracking-wide">
                GASTOS INICIALES DE CIERRE
              </h3>
              <p className="text-xs text-[#6F6456] mt-0.5">
                Costos notariales, registrales y tributarios que asume el comprador.
              </p>
            </div>
            <InfoTooltip
              title="Gastos Iniciales de Cierre"
              content="En el Perú, para formalizar una compraventa se incurre en Notaría (elaboración y firma de escritura), Registros Públicos SUNARP (inscripción de dominio) e Impuesto de Alcabala (si aplica)."
            />
          </div>

          {/* ITEM 1: Gastos Notariales (Escritura pública) */}
          <div className="p-4 rounded-xl border border-[#DDD5C3] bg-[#FBF9F5] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#081827] flex items-center gap-1">
                <span>Gastos Notariales (Escritura pública)</span>
                <InfoTooltip
                  title="Gastos Notariales"
                  content="Arancel que cobra el notario por la elevación a escritura pública. Suele calcularse como un arancel porcentual (~0.2% - 0.4%) o tarifa plana (~S/. 1,200 - S/. 2,000)."
                />
              </span>

              {/* "No lo sé todavía" Checkbox */}
              <label className="flex items-center gap-1.5 text-xs text-[#6F6456] cursor-pointer">
                <input
                  type="checkbox"
                  checked={property.notaryIsUnknown}
                  onChange={(e) => onChange({ notaryIsUnknown: e.target.checked })}
                  className="rounded text-[#091C2C] focus:ring-[#D8B66D]"
                />
                <span>No lo sé todavía</span>
              </label>
            </div>

            {/* Inner Calculation Card (like blue/light box in screenshot) */}
            <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-950">
                  <Scale className="w-3.5 h-3.5 text-blue-700" />
                  <span>Porcentaje según ley/arancel peruano:</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    step="0.05"
                    min="0"
                    max="5"
                    disabled={property.notaryIsUnknown}
                    value={property.notaryRatePct || 0.3}
                    onChange={(e) => onChange({ 
                      notaryRatePct: parseFloat(e.target.value) || 0.3,
                      notaryUsePercentage: true 
                    })}
                    className="w-16 px-2 py-1 text-xs font-mono font-bold text-right bg-white rounded border border-blue-300 disabled:opacity-50"
                  />
                  <span className="text-xs font-bold text-blue-950">%</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-blue-900 font-mono pt-1 border-t border-blue-200/60">
                <span>Aplica {property.notaryRatePct || 0.3}% sobre {formatCurrency(property.purchasePrice, property.currency)}:</span>
                <span className="font-bold text-sm text-blue-950">
                  = {formatCurrency(results.notaryAmount, property.currency)}
                </span>
              </div>
            </div>
          </div>

          {/* ITEM 2: Registros Públicos (SUNARP) */}
          <div className="p-4 rounded-xl border border-[#DDD5C3] bg-[#FBF9F5] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#081827] flex items-center gap-1">
                <span>Registros Públicos (SUNARP - Inscripción)</span>
                <InfoTooltip
                  title="SUNARP (Registros Públicos)"
                  content="Derechos registrales de calificación e inscripción de compraventa y de hipoteca en la partida registral del predio."
                />
              </span>

              {/* "No lo sé todavía" Checkbox */}
              <label className="flex items-center gap-1.5 text-xs text-[#6F6456] cursor-pointer">
                <input
                  type="checkbox"
                  checked={property.sunarpIsUnknown}
                  onChange={(e) => onChange({ sunarpIsUnknown: e.target.checked })}
                  className="rounded text-[#091C2C] focus:ring-[#D8B66D]"
                />
                <span>No lo sé todavía</span>
              </label>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-[#6F6456]">
                {property.sunarpIsUnknown ? 'Estimado provisional inteligente:' : 'Tasa registral:'}
              </span>
              <div className="relative w-36">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 font-mono font-bold text-[#D8B66D]">
                  {property.currency === 'PEN' ? 'S/.' : '$'}
                </span>
                <input
                  type="number"
                  min="0"
                  disabled={property.sunarpIsUnknown}
                  value={property.sunarpIsUnknown ? results.sunarpAmount : (property.sunarpFee || '')}
                  onChange={(e) => onChange({ sunarpFee: Math.max(0, parseFloat(e.target.value) || 0) })}
                  className="w-full pl-8 pr-2.5 py-1.5 rounded-lg border border-[#DDD5C3] bg-white font-mono text-xs font-bold text-right text-[#081827] disabled:bg-gray-100"
                />
              </div>
            </div>
          </div>

          {/* ITEM 3: Impuesto de Alcabala (10 UIT Exoneradas) */}
          <div className="p-4 rounded-xl border border-[#DDD5C3] bg-[#FBF9F5] space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-xs font-bold text-[#081827] flex items-center gap-1">
                <span>Impuesto de Alcabala (Municipalidad)</span>
                <InfoTooltip
                  title="Impuesto de Alcabala (Perú)"
                  content="Tributo del 3% sobre el valor de transferencia que exceda las 10 UIT (S/. 53,500 en 2026). La primera venta del constructor (estreno) está totalmente inafecta."
                  badge="Ley D. Leg. 776"
                />
              </span>

              {/* Toggle Primera venta constructor */}
              <label className="flex items-center gap-1.5 text-xs text-[#081827] cursor-pointer">
                <input
                  type="checkbox"
                  checked={property.isFirstSaleConstructor}
                  onChange={(e) => onChange({ isFirstSaleConstructor: e.target.checked })}
                  className="rounded text-[#091C2C] focus:ring-[#D8B66D]"
                />
                <span className="font-semibold text-emerald-800">Primera venta (Estreno - 0 Alcabala)</span>
              </label>
            </div>

            {property.isFirstSaleConstructor ? (
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Exonerado de Alcabala por ley (primera venta de constructora o bien futuro).</span>
              </div>
            ) : (
              <div className="p-3 bg-white rounded-xl border border-[#DDD5C3] space-y-2 text-xs">
                <div className="flex justify-between text-[#6F6456]">
                  <span>Primeras 10 UIT inafectas:</span>
                  <span className="font-mono font-semibold text-[#081827]">
                    -{formatCurrency(results.alcabalaExemptUitAmount, property.currency)}
                  </span>
                </div>
                <div className="flex justify-between pt-1 border-t border-[#DDD5C3]/40">
                  <span className="font-bold text-[#081827]">Tasa del 3% sobre el exceso:</span>
                  <span className="font-mono font-bold text-sm text-[#081827]">
                    = {formatCurrency(results.alcabalaAmount, property.currency)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* ITEM 4: Partidas Adicionales (Remodelación, amoblado, gas) */}
          <div className="space-y-2 pt-1 border-t border-[#DDD5C3]/40">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#081827]">
                Gastos adicionales ({property.extraInitialExpenses.length})
              </span>
              <button
                type="button"
                onClick={() => setShowAddExpense(!showAddExpense)}
                className="text-xs font-semibold text-[#081827] hover:text-[#D8B66D] flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Agregar gasto inicial</span>
              </button>
            </div>

            {property.extraInitialExpenses.map((exp) => (
              <div
                key={exp.id}
                className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-[#FBF9F5] border border-[#DDD5C3] text-xs"
              >
                <span className="font-medium text-[#081827]">{exp.name}</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-[#081827]">
                    {formatCurrency(exp.amount, property.currency)}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveExpense(exp.id)}
                    className="text-gray-400 hover:text-red-500 p-0.5"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}

            {showAddExpense && (
              <form onSubmit={handleAddExpense} className="p-3 bg-[#FBF9F5] rounded-xl border border-[#D8B66D] space-y-2">
                <span className="text-xs font-semibold text-[#081827] block">
                  Nuevo gasto inicial (ej. Amoblado, Conexión Gas Natural, Tasación)
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Nombre"
                    value={newExpenseName}
                    onChange={(e) => setNewExpenseName(e.target.value)}
                    className="px-2.5 py-1.5 text-xs rounded-lg border border-[#DDD5C3] bg-white"
                    autoFocus
                  />
                  <input
                    type="number"
                    placeholder="Monto"
                    value={newExpenseAmount}
                    onChange={(e) => setNewExpenseAmount(e.target.value)}
                    className="px-2.5 py-1.5 text-xs font-mono rounded-lg border border-[#DDD5C3] bg-white"
                  />
                </div>
                <div className="flex justify-end gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddExpense(false)}
                    className="px-2.5 py-1 text-xs text-[#6F6456]"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-3.5 py-1 text-xs bg-[#081827] text-white font-bold rounded-lg cursor-pointer"
                  >
                    Agregar
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>

      </div>

      {/* TARJETA DESTACADA DE CONCLUSIÓN DEL PASO 1 (ECUACIÓN VISUAL DE 3 BLOQUES) */}
      <div className="bg-[#081827] text-[#F6F4EF] rounded-2xl p-6 sm:p-7 border border-[#D8B66D]/40 shadow-xl space-y-5">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#D8B66D]" />
          <span className="text-xs uppercase font-mono tracking-widest text-[#D8B66D] font-bold">
            Conclusión del Paso 1: Capital Desembolsado Requerido
          </span>
        </div>

        {/* 3 Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          
          {/* Block 1 */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <span className="text-[11px] text-[#DDD5C3] uppercase tracking-wider block mb-1">
              1. Cuota Inicial ({property.downPaymentPct}%)
            </span>
            <div className="font-mono text-xl sm:text-2xl font-bold text-white">
              {formatCurrency(results.downPaymentAmount, property.currency)}
            </div>
            <span className="text-[11px] text-[#DDD5C3]/70">
              Aporte al valor de compra
            </span>
          </div>

          {/* Block 2 */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 relative">
            <span className="text-[11px] text-[#DDD5C3] uppercase tracking-wider block mb-1">
              2. Gastos de Cierre
            </span>
            <div className="font-mono text-xl sm:text-2xl font-bold text-[#D8B66D]">
              {formatCurrency(results.totalInitialExpenses, property.currency)}
            </div>
            <span className="text-[11px] text-[#DDD5C3]/70">
              Notaría + SUNARP + Alcabala
            </span>
          </div>

          {/* Block 3 */}
          <div className="p-5 rounded-xl bg-[#D8B66D]/20 border border-[#D8B66D] shadow-inner">
            <span className="text-[11px] text-[#D8B66D] font-bold uppercase tracking-wider block mb-1">
              3. Inversión Total Propia (Equity)
            </span>
            <div className="font-mono text-2xl sm:text-3xl font-bold text-white">
              {formatCurrency(results.totalInitialInvestmentRequired, property.currency)}
            </div>
            <span className="text-[11px] text-[#DDD5C3]">
              Efectivo total necesario para la firma
            </span>
          </div>

        </div>

        {/* Next Step Button */}
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onNext}
            className="px-6 py-3 rounded-xl bg-[#E5B55E] hover:bg-[#d8a44b] text-[#081827] font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-all cursor-pointer"
          >
            <span>Continuar al Paso 2: Financiación & Cuotas</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};
