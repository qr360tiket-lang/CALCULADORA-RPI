import React from 'react';
import { 
  Home, 
  Calculator, 
  BarChart3, 
  AlertTriangle,
  CheckCircle2,
  LayoutDashboard
} from 'lucide-react';
import { PropertyData, FinancialCalculationResult } from '../types/realEstate';

interface StepNavigationProps {
  currentStep: number;
  onSelectStep: (step: number) => void;
  activeTab: 'wizard' | 'dashboard' | 'comparison';
  setActiveTab: (tab: 'wizard' | 'dashboard' | 'comparison') => void;
  property: PropertyData;
  results: FinancialCalculationResult;
}

export const StepNavigation: React.FC<StepNavigationProps> = ({
  currentStep,
  onSelectStep,
  activeTab,
  setActiveTab,
  property,
  results,
}) => {
  // Calculate dynamic completion and pending items
  const pendingItems: string[] = [];
  if (!property.title || property.title.trim() === '') pendingItems.push('Nombre de la propiedad');
  if (!property.district || property.district.trim() === '') pendingItems.push('Distrito');
  if (!property.purchasePrice || property.purchasePrice <= 0 || property.pricePending) pendingItems.push('Precio de compra');
  if (property.notaryIsUnknown) pendingItems.push('Cotización notarial');
  if (property.sunarpIsUnknown) pendingItems.push('Arancel SUNARP');
  if (property.rentalStrategy === 'tradicional' && (!property.traditionalRentMonthly || property.traditionalRentMonthly <= 0)) {
    pendingItems.push('Monto de alquiler estimado');
  }
  if (property.rentalStrategy === 'airbnb' && (!property.airbnbPricePerNight || property.airbnbPricePerNight <= 0)) {
    pendingItems.push('Tarifa por noche Airbnb');
  }

  const totalChecks = 7;
  const completedChecks = Math.max(0, totalChecks - pendingItems.length);
  const completionPercentage = Math.round((completedChecks / totalChecks) * 100);

  const steps = [
    {
      id: 1,
      number: '1',
      title: '1. Tu propiedad',
      subtitle: 'Identificación, precio y costos in...',
      icon: Home,
    },
    {
      id: 2,
      number: '2',
      title: '2. Tus números',
      subtitle: 'Financiación, cuotas, renta y vac...',
      icon: Calculator,
    },
    {
      id: 3,
      number: '3',
      title: '3. Tu análisis',
      subtitle: 'Flujo de caja, rendimientos y de...',
      icon: BarChart3,
    },
  ];

  return (
    <div className="bg-[#F8F7F3] border-b border-[#DDD5C3]/70 py-3 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        
        {/* Step Buttons (Cards) */}
        <div className="flex flex-wrap sm:flex-nowrap items-stretch gap-2.5 flex-1">
          {steps.map((s) => {
            const Icon = s.icon;
            const isActive = activeTab === 'wizard' && currentStep === s.id;

            return (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  setActiveTab('wizard');
                  onSelectStep(s.id);
                }}
                className={`flex-1 min-w-[200px] p-2.5 sm:p-3 rounded-2xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                  isActive
                    ? 'bg-[#081827] text-white border-[#081827] shadow-md ring-2 ring-[#D8B66D]/40'
                    : 'bg-white hover:bg-[#F2EFE9] border-[#DDD5C3] text-[#081827]'
                }`}
              >
                {/* Step Icon */}
                <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                  isActive
                    ? 'bg-[#E5B55E] text-[#081827]'
                    : 'bg-[#F4F0E6] text-[#6E6353] border border-[#DDD5C3]/60'
                }`}>
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>

                {/* Step Titles */}
                <div className="truncate">
                  <div className={`font-bold text-xs sm:text-sm truncate ${isActive ? 'text-white' : 'text-[#081827]'}`}>
                    {s.title}
                  </div>
                  <div className={`text-[11px] truncate ${isActive ? 'text-[#D8B66D]' : 'text-[#7A6D5D]'}`}>
                    {s.subtitle}
                  </div>
                </div>
              </button>
            );
          })}

          {/* Quick Dashboard tab toggle */}
          <button
            type="button"
            onClick={() => setActiveTab(activeTab === 'dashboard' ? 'wizard' : 'dashboard')}
            className={`p-2.5 sm:p-3 rounded-2xl border text-left transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-[#081827] text-white border-[#081827] shadow-md ring-2 ring-[#D8B66D]/40'
                : 'bg-white hover:bg-[#F2EFE9] border-[#DDD5C3] text-[#081827]'
            }`}
            title="Ver vista completa de todas las métricas juntas"
          >
            <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 ${
              activeTab === 'dashboard' ? 'bg-[#E5B55E] text-[#081827]' : 'bg-[#F4F0E6] text-[#6E6353]'
            }`}>
              <LayoutDashboard className="w-4 h-4" />
            </div>
            <div className="hidden xl:block">
              <div className="font-bold text-xs">Resumen</div>
              <div className="text-[11px] text-[#7A6D5D]">Vista integral</div>
            </div>
          </button>
        </div>

        {/* Right: Completitud Progress Bar & Pendientes Badge (Exactly like in the image) */}
        <div className="flex items-center gap-3 bg-white px-3.5 py-2.5 rounded-2xl border border-[#DDD5C3] shadow-xs self-start lg:self-center shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#081827]">Completitud:</span>
            
            {/* Progress Bar */}
            <div className="w-24 sm:w-28 h-2 bg-[#E9E4D8] rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#D8B66D] to-[#B38734] transition-all duration-300 rounded-full"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            <span className="font-mono text-xs font-bold text-[#081827]">
              {completionPercentage}%
            </span>
          </div>

          {/* Warning badge for pending fields */}
          {pendingItems.length > 0 ? (
            <div 
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-300 text-[11px] font-semibold cursor-pointer"
              title={`Campos por completar:\n• ${pendingItems.join('\n• ')}`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>{pendingItems.length} pendientes</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-300 text-[11px] font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Completo</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
