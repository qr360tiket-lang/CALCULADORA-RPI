import React, { useState } from 'react';
import { 
  Receipt, 
  Home, 
  Sparkles, 
  ShieldCheck, 
  Plus, 
  Trash2, 
  ChevronRight, 
  ChevronLeft,
  Percent,
  CalendarCheck,
  Building,
  Wrench,
  HelpCircle,
  Coins,
  Edit3
} from 'lucide-react';
import { PropertyData, FinancialCalculationResult, RentalStrategyType } from '../types/realEstate';
import { formatCurrency, formatPct } from '../utils/formatters';
import { InfoTooltip } from './InfoTooltip';
import { EditablePriceInput } from './EditablePriceInput';

interface Step3RentalProps {
  property: PropertyData;
  results: FinancialCalculationResult;
  onChange: (updated: Partial<PropertyData>) => void;
  onPrev: () => void;
  onNext: () => void;
}

export const Step3Rental: React.FC<Step3RentalProps> = ({
  property,
  results,
  onChange,
  onPrev,
  onNext,
}) => {
  const isTraditional = property.rentalStrategy === 'tradicional';
  const [newExpenseName, setNewExpenseName] = useState('');
  const [newExpenseAmount, setNewExpenseAmount] = useState('');
  const [showAddCustomExp, setShowAddCustomExp] = useState(false);

  const handleAddCustomExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpenseName.trim() || isNaN(Number(newExpenseAmount))) return;
    const newItems = [
      ...property.customRecurringExpenses,
      {
        id: `rec-${Date.now()}`,
        name: newExpenseName.trim(),
        amount: Math.max(0, Number(newExpenseAmount)),
        enabled: true,
      },
    ];
    onChange({ customRecurringExpenses: newItems });
    setNewExpenseName('');
    setNewExpenseAmount('');
    setShowAddCustomExp(false);
  };

  const handleRemoveCustomExpense = (id: string) => {
    const newItems = property.customRecurringExpenses.filter(e => e.id !== id);
    onChange({ customRecurringExpenses: newItems });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Dark Navy Step 3 Header Banner with Distinctive Celeste & Green Badges */}
      <div className="bg-[#091C2C] text-[#F6F4EF] rounded-2xl p-6 sm:p-7 border border-[#38BDF8]/40 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0284C7] text-white font-mono text-xs font-black uppercase tracking-wider mb-2.5 shadow-md ring-2 ring-[#38BDF8]/60">
            <span className="w-2 h-2 rounded-full bg-[#EF4444] animate-pulse"></span>
            <span>PASO 3 DE 4: RENTA & GASTOS OPERATIVOS</span>
          </div>
          <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Estrategia de Renta y Gastos Recurrentes
          </h2>
          <p className="text-xs sm:text-sm text-[#DDD5C3]/90 mt-1 max-w-2xl leading-relaxed">
            Modela tus ingresos por alquiler mensual o Airbnb, edita los precios libremente y descuenta mantenimiento, predial y el 5% de SUNAT (1ra Categoría).
          </p>
        </div>

        {/* Live Badges: Purchase Price & Gross Revenue */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="p-3 bg-white/10 rounded-xl border border-sky-400/40 text-right backdrop-blur-xs">
            <span className="text-[10px] text-[#38BDF8] uppercase font-mono font-bold block flex items-center justify-end gap-1">
              <span>Precio Inmueble</span>
              <span className="text-[9px] bg-sky-500/30 text-sky-200 px-1 py-0.2 rounded font-sans">Editable</span>
            </span>
            <span className="font-mono font-bold text-sm text-white">
              {property.purchasePrice > 0 ? formatCurrency(property.purchasePrice, property.currency) : 'S/. 0 (Ingresar abajo)'}
            </span>
          </div>

          <div className="p-3 bg-white/10 rounded-xl border border-emerald-400/40 text-right backdrop-blur-xs">
            <span className="text-[10px] text-[#34D399] uppercase font-mono font-bold block">Ingreso Bruto Mensual</span>
            <span className="font-mono font-bold text-base text-white">
              {formatCurrency(results.grossMonthlyIncome, property.currency)}
            </span>
          </div>
        </div>
      </div>

      {/* TARJETA DESTACADA: PRECIO DE COMPRA DEL INMUEBLE (100% EDITABLE DIRECTAMENTE EN ESTE PASO) */}
      <div className="bg-gradient-to-r from-sky-50 via-white to-blue-50/50 rounded-2xl p-5 sm:p-6 border-2 border-[#0284C7]/50 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-sky-200/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-[#0284C7] text-white shadow-sm shrink-0">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-serif-title font-bold text-base sm:text-lg text-[#081827]">
                  Precio de Compra del Inmueble
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white font-mono text-[10px] font-black uppercase tracking-wider shadow-2xs">
                  ✓ 100% EDITABLE AQUÍ
                </span>
              </div>
              <p className="text-xs text-[#6F6456]">
                Escribe directamente el monto que acordaste o deseas simular sin regresar al Paso 1.
              </p>
            </div>
          </div>

          {/* Currency Toggle */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-sky-300 shadow-2xs self-start sm:self-auto">
            <span className="text-[11px] font-mono text-[#6F6456] px-1.5 font-bold">Moneda:</span>
            <button
              type="button"
              onClick={() => onChange({ currency: 'PEN' })}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                property.currency === 'PEN'
                  ? 'bg-[#0284C7] text-white shadow-xs'
                  : 'text-[#081827] hover:bg-slate-100'
              }`}
            >
              Soles (S/.)
            </button>
            <button
              type="button"
              onClick={() => onChange({ currency: 'USD' })}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                property.currency === 'USD'
                  ? 'bg-[#0284C7] text-white shadow-xs'
                  : 'text-[#081827] hover:bg-slate-100'
              }`}
            >
              Dólares ($)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
          <div className="lg:col-span-7">
            <label className="block text-xs font-black text-[#081827] mb-1.5 uppercase tracking-wide">
              Monto del Precio de Compra:
            </label>
            <EditablePriceInput
              value={property.purchasePrice}
              onChange={(val) => onChange({ purchasePrice: val })}
              currency={property.currency}
              placeholder={property.currency === 'PEN' ? 'ej. 385000' : 'ej. 145000'}
              quickIncrements={property.currency === 'PEN' ? [-10000, 10000, 50000] : [-5000, 5000, 20000]}
              presets={property.currency === 'PEN' ? [250000, 385000, 480000, 620000] : [75000, 120000, 160000, 220000]}
              inputClassName="text-lg font-black text-[#081827]"
            />
          </div>

          <div className="lg:col-span-5 bg-white p-3.5 rounded-xl border border-sky-200/90 space-y-2 text-xs font-mono shadow-2xs">
            <div className="flex justify-between items-center text-[#6F6456]">
              <span>Cuota Inicial ({property.downPaymentPct}%):</span>
              <span className="font-bold text-[#081827] text-sm">
                {formatCurrency(results.downPaymentAmount, property.currency)}
              </span>
            </div>
            <div className="flex justify-between items-center text-[#6F6456]">
              <span>Saldo a Financiar:</span>
              <span className="font-bold text-[#0284C7] text-sm">
                {formatCurrency(results.loanAmount, property.currency)}
              </span>
            </div>
            {property.areaM2 > 0 && (
              <div className="flex justify-between items-center text-[#6F6456] pt-1.5 border-t border-slate-100">
                <span>Precio por m² ({property.areaM2} m²):</span>
                <span className="font-bold text-[#081827]">
                  {formatCurrency(results.pricePerM2, property.currency)}/m²
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Rental Strategy Selector: Traditional vs Airbnb */}
      <div className="bg-white rounded-2xl p-6 border border-[#DDD5C3] shadow-xs space-y-4">
        <label className="block text-xs font-bold text-[#091C2C] uppercase tracking-wider">
          Estrategia de Explotación del Inmueble
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Strategy A: Tradicional */}
          <button
            type="button"
            onClick={() => onChange({ rentalStrategy: 'tradicional' })}
            className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
              isTraditional
                ? 'bg-[#091C2C] text-[#F6F4EF] border-[#091C2C] shadow-md ring-2 ring-[#0284C7]'
                : 'bg-[#FBF9F5] text-[#091C2C] border-[#DDD5C3] hover:border-[#D8B66D]'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Home className={`w-5 h-5 ${isTraditional ? 'text-[#38BDF8]' : 'text-[#091C2C]'}`} />
                <span className="font-serif-title font-bold text-base">
                  Renta Tradicional (Largo Plazo)
                </span>
              </div>
              {isTraditional && (
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#0284C7] text-white font-black">
                  Activo
                </span>
              )}
            </div>
            <p className={`text-xs ${isTraditional ? 'text-[#DDD5C3]' : 'text-[#6F6456]'}`}>
              Contrato de 1 a 2 años con inquilino fijo. Flujo de caja predecible, menor desgaste y bajo costo de gestión.
            </p>
          </button>

          {/* Strategy B: Airbnb */}
          <button
            type="button"
            onClick={() => onChange({ rentalStrategy: 'airbnb' })}
            className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
              !isTraditional
                ? 'bg-[#091C2C] text-[#F6F4EF] border-[#091C2C] shadow-md ring-2 ring-[#0284C7]'
                : 'bg-[#FBF9F5] text-[#091C2C] border-[#DDD5C3] hover:border-[#D8B66D]'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sparkles className={`w-5 h-5 ${!isTraditional ? 'text-[#38BDF8]' : 'text-[#091C2C]'}`} />
                <span className="font-serif-title font-bold text-base">
                  Renta Corta / Airbnb / Booking
                </span>
              </div>
              {!isTraditional && (
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#0284C7] text-white font-black">
                  Activo
                </span>
              )}
            </div>
            <p className={`text-xs ${!isTraditional ? 'text-[#DDD5C3]' : 'text-[#6F6456]'}`}>
              Alquiler por noche para turismo y ejecutivos. Mayor potencial de ingresos brutos, pero requiere limpieza y gestión continua.
            </p>
          </button>

        </div>
      </div>

      {/* Strategy Detail Parameters */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Card Left: Revenue Parameters */}
        <div className="bg-white rounded-2xl p-6 border border-[#DDD5C3] shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#DDD5C3]/40">
            <div className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-[#0284C7]" />
              <h3 className="font-serif-title font-bold text-lg text-[#091C2C]">
                {isTraditional ? 'Precio de Alquiler Tradicional' : 'Tarifas de Renta Airbnb'}
              </h3>
            </div>
            <span className="text-[11px] font-mono font-bold text-[#0284C7] bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
              100% Editable
            </span>
          </div>

          {isTraditional ? (
            /* Traditional inputs */
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-[#091C2C] flex items-center gap-1">
                    <span>Precio de Alquiler Mensual Pactado</span>
                    <InfoTooltip 
                      title="Alquiler Mensual"
                      content="Renta bruta mensual que pagará el inquilino según el contrato de arrendamiento."
                    />
                  </label>
                  <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-mono font-bold">
                    Renta mensual
                  </span>
                </div>

                <EditablePriceInput
                  value={property.traditionalRentMonthly}
                  onChange={(val) => onChange({ traditionalRentMonthly: val })}
                  currency={property.currency}
                  placeholder={property.currency === 'PEN' ? 'ej. 2200' : 'ej. 750'}
                  quickIncrements={property.currency === 'PEN' ? [-100, 100, 500] : [-50, 50, 150]}
                  presets={property.currency === 'PEN' ? [1800, 2200, 2600, 3200] : [550, 750, 950, 1200]}
                  inputClassName="text-base font-bold text-[#081827]"
                />
              </div>

              {/* Vacancy Rate */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-[#091C2C] flex items-center gap-1">
                    Tasa de Vacancia estimada
                    <InfoTooltip 
                      title="Tasa de Vacancia Inmobiliaria"
                      content="Porcentaje del año que el inmueble pasa desocupado entre contratos. Un estándar prudente en Lima es de 5% a 8% (equivale a ~1 mes de desocupación cada 1.5 a 2 años)."
                    />
                  </label>
                  <span className="text-xs font-mono font-bold text-[#091C2C]">{property.vacancyRatePct}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="25"
                  step="1"
                  value={property.vacancyRatePct}
                  onChange={(e) => onChange({ vacancyRatePct: Number(e.target.value) })}
                  className="w-full accent-[#091C2C] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-[#6F6456] font-mono mt-1">
                  <span>0% (Continuo)</span>
                  <span>Pérdida por vacancia: -{formatCurrency(results.vacancyLossMonthly, property.currency)}/mes</span>
                  <span>25% (3 meses/año)</span>
                </div>
              </div>

              {/* Net effective income display */}
              <div className="p-3 bg-[#F6F4EF] rounded-xl border border-[#DDD5C3] flex items-center justify-between text-xs">
                <span className="font-semibold text-[#091C2C]">Ingreso Bruto Efectivo (después de vacancia):</span>
                <span className="font-mono font-bold text-sm text-[#091C2C]">
                  {formatCurrency(results.effectiveGrossMonthlyIncome, property.currency)} / mes
                </span>
              </div>
            </div>
          ) : (
            /* Airbnb inputs */
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#091C2C] mb-1">
                  Tarifa promedio por noche (ADR)
                </label>
                <EditablePriceInput
                  value={property.airbnbPricePerNight}
                  onChange={(val) => onChange({ airbnbPricePerNight: val })}
                  currency={property.currency}
                  placeholder={property.currency === 'PEN' ? 'ej. 160' : 'ej. 55'}
                  quickIncrements={property.currency === 'PEN' ? [-20, 20, 50] : [-10, 10, 25]}
                  presets={property.currency === 'PEN' ? [100, 140, 180, 240] : [35, 50, 75, 110]}
                  inputClassName="text-sm font-bold text-[#081827]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-[#091C2C]">
                    Ocupación mensual
                  </label>
                  <span className="text-xs font-mono font-bold text-[#091C2C]">{property.airbnbOccupancyPct}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="95"
                  step="1"
                  value={property.airbnbOccupancyPct}
                  onChange={(e) => onChange({ airbnbOccupancyPct: Number(e.target.value) })}
                  className="w-full accent-[#091C2C] cursor-pointer mt-2"
                />
                <span className="text-[10px] text-[#6F6456] font-mono block text-right">
                  ~{(30.4 * property.airbnbOccupancyPct / 100).toFixed(0)} noches ocupadas
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#091C2C] mb-1">
                    Comisión de plataforma (Airbnb)
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      step="0.5"
                      value={property.airbnbPlatformFeePct}
                      onChange={(e) => onChange({ airbnbPlatformFeePct: Math.max(0, parseFloat(e.target.value) || 0) })}
                      className="w-20 px-2 py-1.5 rounded-lg border border-[#DDD5C3] bg-[#FBF9F5] font-mono text-xs font-bold text-[#091C2C]"
                    />
                    <span className="text-xs font-bold text-[#6F6456]">% (3% host fee)</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#091C2C] mb-1">
                    Limpieza cobrada al huésped / mes
                  </label>
                  <EditablePriceInput
                    value={property.airbnbCleaningFeePerMonth}
                    onChange={(val) => onChange({ airbnbCleaningFeePerMonth: val })}
                    currency={property.currency}
                    placeholder="0"
                    inputClassName="text-xs font-bold text-[#081827] py-1.5"
                  />
                </div>
              </div>

              <div className="p-3 bg-[#F6F4EF] rounded-xl border border-[#DDD5C3] flex items-center justify-between text-xs">
                <span className="font-semibold text-[#091C2C]">Ingreso Bruto Efectivo Airbnb (neto plataforma):</span>
                <span className="font-mono font-bold text-sm text-[#091C2C]">
                  {formatCurrency(results.effectiveGrossMonthlyIncome, property.currency)} / mes
                </span>
              </div>
            </div>
          )}

          {/* SUNAT 1st Category 5% Tax Box */}
          <div className="p-4 rounded-xl bg-[#FBF9F5] border border-[#DDD5C3] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#D8B66D]" />
                <span className="text-xs font-bold text-[#091C2C]">
                  Impuesto a la Renta de 1ra Categoría (SUNAT)
                </span>
                <InfoTooltip 
                  title="Impuesto a la Renta SUNAT - 1ra Categoría"
                  content="En el Perú, el arrendamiento de predios por parte de personas naturales tributa con una tasa efectiva del 5% del importe bruto del alquiler. Se paga mensualmente mediante el Formulario Virtual N° 1683 o Guía de Arrendamiento."
                  badge="5% SUNAT"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={property.sunatFirstCatTaxEnabled}
                  onChange={(e) => onChange({ sunatFirstCatTaxEnabled: e.target.checked })}
                  className="rounded text-[#091C2C] focus:ring-[#D8B66D]"
                />
                <span className="text-xs font-semibold text-[#091C2C]">
                  Deducir el 5%
                </span>
              </label>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-[#6F6456]">
                {property.sunatFirstCatTaxEnabled ? 'Monto a pagar mensualmente a SUNAT:' : 'No deducido del cálculo'}
              </span>
              <span className={`font-mono font-bold text-xs ${property.sunatFirstCatTaxEnabled ? 'text-[#091C2C]' : 'text-gray-400'}`}>
                {formatCurrency(results.sunatTaxMonthly, property.currency)} / mes
              </span>
            </div>
          </div>

        </div>

        {/* Card Right: Operating Expenses */}
        <div className="bg-white rounded-2xl p-6 border border-[#DDD5C3] shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#DDD5C3]/40">
            <div className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-[#D8B66D]" />
              <h3 className="font-serif-title font-bold text-lg text-[#091C2C]">
                Gastos Operativos Mensuales (OpEx)
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-[#091C2C] bg-[#F6F4EF] px-2 py-1 rounded-md border border-[#DDD5C3]">
              Total: {formatCurrency(results.totalOperatingExpensesMonthly, property.currency)}/m
            </span>
          </div>

          <div className="space-y-3.5 text-xs">
            
            {/* 1. Mantenimiento del Edificio */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1">
                <label className="font-semibold text-[#091C2C] flex items-center gap-1">
                  Mantenimiento Edificio / Condominio
                  <InfoTooltip 
                    title="Mantenimiento de Edificio"
                    content="Cuota de la junta de propietarios para vigilancia 24/7, limpieza de áreas comunes, ascensores y bombas de agua."
                  />
                </label>
                <span className="text-[11px] text-[#6F6456]">Portería, luz áreas comunes, limpieza</span>
              </div>
              <div className="w-36">
                <EditablePriceInput
                  value={property.maintenanceFeeMonthly}
                  onChange={(val) => onChange({ maintenanceFeeMonthly: val })}
                  currency={property.currency}
                  placeholder="ej. 200"
                  inputClassName="py-1.5 text-xs text-right"
                />
              </div>
            </div>

            {/* 2. Predial y Arbitrios */}
            <div className="flex items-center justify-between gap-3 pt-2 border-t border-[#DDD5C3]/30">
              <div className="flex-1">
                <label className="font-semibold text-[#091C2C] flex items-center gap-1">
                  Impuesto Predial y Arbitrios (Prorrateado)
                  <InfoTooltip 
                    title="Impuesto Predial y Arbitrios Municipales"
                    content="Tributos pagados a la municipalidad distrital (SAT en Lima o municipalidad local). Se prorratea el monto anual entre 12 meses."
                  />
                </label>
                <span className="text-[11px] text-[#6F6456]">Municipalidad del distrito (SAT) al mes</span>
              </div>
              <div className="w-36">
                <EditablePriceInput
                  value={property.propertyTaxAndArbitriosMonthly}
                  onChange={(val) => onChange({ propertyTaxAndArbitriosMonthly: val })}
                  currency={property.currency}
                  placeholder="ej. 80"
                  inputClassName="py-1.5 text-xs text-right"
                />
              </div>
            </div>

            {/* 3. Reserva de Reparaciones (%) */}
            <div className="flex items-center justify-between gap-3 pt-2 border-t border-[#DDD5C3]/30">
              <div className="flex-1">
                <label className="font-semibold text-[#091C2C] flex items-center gap-1">
                  Reserva para Reparaciones & Desgaste
                  <InfoTooltip 
                    title="Reserva de Contingencia"
                    content="Fondo para pintura, griferías, electrodomésticos y reparaciones fortuitas. Se recomienda separar del 3% al 8% de la renta mensual."
                  />
                </label>
                <span className="text-[11px] text-[#6F6456]">
                  {property.repairsReservePct}% de la renta ({formatCurrency(results.repairsReserveMonthly, property.currency)}/mes)
                </span>
              </div>
              <div className="flex items-center gap-1 w-32 justify-end">
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={property.repairsReservePct}
                  onChange={(e) => onChange({ repairsReservePct: Math.max(0, parseFloat(e.target.value) || 0) })}
                  className="w-16 px-2 py-1.5 font-mono text-xs font-semibold text-right bg-[#FBF9F5] border border-[#DDD5C3] rounded-lg"
                />
                <span className="font-bold text-[#091C2C]">%</span>
              </div>
            </div>

            {/* 4. Comisión de Administración / Property Manager (%) */}
            <div className="flex items-center justify-between gap-3 pt-2 border-t border-[#DDD5C3]/30">
              <div className="flex-1">
                <label className="font-semibold text-[#091C2C]">
                  Comisión Property Manager / Co-anfitrión
                </label>
                <span className="text-[11px] text-[#6F6456]">
                  {property.managementFeePct}% ({formatCurrency(results.managementFeeMonthly, property.currency)}/mes)
                </span>
              </div>
              <div className="flex items-center gap-1 w-32 justify-end">
                <input
                  type="number"
                  min="0"
                  max="30"
                  value={property.managementFeePct}
                  onChange={(e) => onChange({ managementFeePct: Math.max(0, parseFloat(e.target.value) || 0) })}
                  className="w-16 px-2 py-1.5 font-mono text-xs font-semibold text-right bg-[#FBF9F5] border border-[#DDD5C3] rounded-lg"
                />
                <span className="font-bold text-[#091C2C]">%</span>
              </div>
            </div>

            {/* 5. Servicios (Luz, agua, internet) - especial Airbnb */}
            <div className="flex items-center justify-between gap-3 pt-2 border-t border-[#DDD5C3]/30">
              <div className="flex-1">
                <label className="font-semibold text-[#091C2C]">
                  Servicios Públicos (Luz, Agua, Internet)
                </label>
                <span className="text-[11px] text-[#6F6456]">Asumido por anfitrión en Airbnb o alquiler todo incluido</span>
              </div>
              <div className="w-36">
                <EditablePriceInput
                  value={property.utilitiesMonthly}
                  onChange={(val) => onChange({ utilitiesMonthly: val })}
                  currency={property.currency}
                  placeholder="0"
                  inputClassName="py-1.5 text-xs text-right"
                />
              </div>
            </div>

            {/* Custom Recurring Expenses */}
            {property.customRecurringExpenses.map((exp) => (
              <div key={exp.id} className="flex items-center justify-between gap-3 pt-2 border-t border-[#DDD5C3]/30">
                <div className="flex-1 flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={exp.enabled}
                    onChange={(e) => {
                      const updated = property.customRecurringExpenses.map(item => 
                        item.id === exp.id ? { ...item, enabled: e.target.checked } : item
                      );
                      onChange({ customRecurringExpenses: updated });
                    }}
                    className="rounded text-[#091C2C]"
                  />
                  <span className="font-semibold text-[#091C2C] truncate">{exp.name}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-bold text-xs text-[#091C2C]">
                    {formatCurrency(exp.amount, property.currency)}/m
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveCustomExpense(exp.id)}
                    className="text-gray-400 hover:text-red-500 p-0.5"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}

            {/* Add custom recurring expense button */}
            <div className="pt-2">
              {!showAddCustomExp ? (
                <button
                  type="button"
                  onClick={() => setShowAddCustomExp(true)}
                  className="text-xs font-semibold text-[#091C2C] hover:text-[#D8B66D] flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Agregar otro gasto mensual recurrente</span>
                </button>
              ) : (
                <form onSubmit={handleAddCustomExpense} className="p-2.5 bg-[#FBF9F5] rounded-xl border border-[#D8B66D] space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Nombre (ej. Seguro multirriesgo)"
                      value={newExpenseName}
                      onChange={(e) => setNewExpenseName(e.target.value)}
                      className="px-2 py-1 text-xs bg-white rounded border border-[#DDD5C3]"
                    />
                    <input
                      type="number"
                      placeholder="Monto mensual"
                      value={newExpenseAmount}
                      onChange={(e) => setNewExpenseAmount(e.target.value)}
                      className="px-2 py-1 text-xs font-mono bg-white rounded border border-[#DDD5C3]"
                    />
                  </div>
                  <div className="flex justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => setShowAddCustomExp(false)}
                      className="text-[11px] text-[#6F6456] px-2 py-0.5"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="text-[11px] bg-[#091C2C] text-[#F6F4EF] font-bold px-3 py-0.5 rounded"
                    >
                      Guardar
                    </button>
                  </div>
                </form>
              )}
            </div>

          </div>

          {/* NOI Preview Box */}
          <div className="p-4 rounded-xl bg-[#091C2C] text-[#F6F4EF] flex items-center justify-between">
            <div>
              <span className="text-[11px] text-[#D8B66D] uppercase tracking-wider font-mono block">
                Ingreso Operativo Neto (NOI)
              </span>
              <span className="text-[11px] text-[#DDD5C3]">
                Flujo libre generado por la propiedad antes de pagar deuda
              </span>
            </div>
            <div className="font-mono text-xl font-bold text-white">
              {formatCurrency(results.netOperatingIncomeMonthly, property.currency)}
              <span className="text-xs text-[#DDD5C3] font-normal">/m</span>
            </div>
          </div>

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
          <span>Volver al Paso 2: Hipoteca</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="px-6 py-2.5 rounded-xl bg-[#091C2C] hover:bg-[#15344f] text-[#F6F4EF] font-bold text-xs flex items-center gap-1.5 shadow-md transition-colors cursor-pointer"
        >
          <span>Continuar al Paso 4: Resultados & Rentabilidad</span>
          <ChevronRight className="w-4 h-4 text-[#D8B66D]" />
        </button>
      </div>

    </div>
  );
};
