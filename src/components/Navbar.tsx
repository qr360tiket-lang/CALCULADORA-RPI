import React, { useState } from 'react';
import { 
  Building2, 
  RotateCcw, 
  Sparkles, 
  FileText, 
  FolderArchive, 
  Scale, 
  Download, 
  ChevronDown, 
  Trash2, 
  Plus, 
  ArrowLeftRight,
  ShieldCheck
} from 'lucide-react';
import { Currency, PropertyData } from '../types/realEstate';

interface NavbarProps {
  currentProperty: PropertyData;
  properties: PropertyData[];
  onSelectProperty: (id: string) => void;
  onNewProperty: () => void;
  onFormularioLimpio: () => void;
  onCargarEjemploFicticio: () => void;
  onOpenRangoInversion: () => void;
  onDeleteProperty: (id: string) => void;
  onCurrencyToggle: (currency: Currency) => void;
  onUpdateExchangeRate: (rate: number) => void;
  activeTab: 'wizard' | 'dashboard' | 'comparison';
  setActiveTab: (tab: 'wizard' | 'dashboard' | 'comparison') => void;
  onOpenExport: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentProperty,
  properties,
  onSelectProperty,
  onNewProperty,
  onFormularioLimpio,
  onCargarEjemploFicticio,
  onOpenRangoInversion,
  onDeleteProperty,
  onCurrencyToggle,
  onUpdateExchangeRate,
  activeTab,
  setActiveTab,
  onOpenExport,
}) => {
  const [showSavedMenu, setShowSavedMenu] = useState(false);
  const [showTcModal, setShowTcModal] = useState(false);
  const [tempTc, setTempTc] = useState(currentProperty.exchangeRate.toString());

  const handleTcSave = () => {
    const val = parseFloat(tempTc);
    if (!isNaN(val) && val > 0) {
      onUpdateExchangeRate(val);
      setShowTcModal(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#081827] text-[#F6F4EF] border-b border-[#D8B66D]/25 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Left: Brand Emblem + Title & Subtitle */}
          <div className="flex items-start gap-3.5">
            {/* Emblem icon */}
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-[#D8B66D]/30 via-[#081827] to-[#D8B66D]/10 border-2 border-[#D8B66D] p-1 flex items-center justify-center shrink-0 shadow-md">
              <div className="w-full h-full rounded-lg border border-[#D8B66D]/40 flex items-center justify-center">
                <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-[#D8B66D]" />
              </div>
            </div>

            <div>
              {/* Brand bar */}
              <div className="flex items-center gap-2 mb-1">
                <span className="font-serif-title text-xs sm:text-sm font-extrabold tracking-widest text-[#D8B66D] uppercase">
                  PAVEL MASTER
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#D8B66D]/15 text-[#D8B66D] border border-[#D8B66D]/40">
                  INVERSIÓN SEGURA
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="font-serif-title text-lg sm:text-xl md:text-2xl font-bold text-white tracking-tight leading-tight">
                Tu primera propiedad merece una decisión analizada
              </h1>

              {/* Subheadline */}
              <p className="text-xs text-[#DDD5C3]/80 mt-0.5 max-w-2xl">
                Calculadora financiera de rentabilidad, costos ocultos y flujo de caja para principiantes.
              </p>
            </div>
          </div>

          {/* Right: Action Buttons (2 Rows as in screenshot) */}
          <div className="flex flex-col gap-2 shrink-0 self-start lg:self-center">
            
            {/* Row 1: Primary Action Pills */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              
              {/* Button: Ficha Rango de Inversión (Emerald) */}
              <button
                type="button"
                onClick={onOpenRangoInversion}
                className="px-3 py-1.5 rounded-lg bg-[#00875A] hover:bg-[#00704A] text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                title="Ver rango de inversión sugerido y capacidad de compra"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Ficha: Rango de Inversión</span>
              </button>

              {/* Button: Formulario Limpio (Tus datos) (Gold/Amber) */}
              <button
                type="button"
                onClick={onFormularioLimpio}
                className="px-3 py-1.5 rounded-lg bg-[#E5B55E] hover:bg-[#d8a44b] text-[#081827] font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                title="Limpiar formulario para ingresar tus datos reales desde cero"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Formulario Limpio (Tus datos)</span>
              </button>

              {/* Button: Cargar ejemplo ficticio (Dark outlined) */}
              <button
                type="button"
                onClick={onCargarEjemploFicticio}
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#DDD5C3] hover:text-white border border-white/20 font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Cargar ejemplo con números ficticios de Lima"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#D8B66D]" />
                <span>Cargar ejemplo ficticio</span>
              </button>

            </div>

            {/* Row 2: Secondary Tools (Guardados, Comparar, PDF, Moneda, TC) */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 justify-start lg:justify-end">
              
              {/* Guardados Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowSavedMenu(!showSavedMenu)}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/20 text-[#DDD5C3] hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <FolderArchive className="w-3.5 h-3.5" />
                  <span>Guardados ({properties.length})</span>
                  <ChevronDown className="w-3 h-3 text-[#DDD5C3]/60 ml-0.5" />
                </button>

                {showSavedMenu && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setShowSavedMenu(false)} 
                    />
                    <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-[#081827] border border-[#D8B66D]/30 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
                      <div className="text-[11px] font-semibold text-[#DDD5C3]/60 px-3 py-1 uppercase tracking-wider">
                        Tus Propiedades ({properties.length})
                      </div>
                      <div className="max-h-60 overflow-y-auto space-y-1 my-1">
                        {properties.map(p => (
                          <div
                            key={p.id}
                            onClick={() => {
                              onSelectProperty(p.id);
                              setShowSavedMenu(false);
                            }}
                            className={`group flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all ${
                              p.id === currentProperty.id
                                ? 'bg-[#D8B66D]/20 border border-[#D8B66D]/50 text-white'
                                : 'hover:bg-white/5 text-[#DDD5C3]'
                            }`}
                          >
                            <div className="truncate pr-2">
                              <p className="text-xs font-semibold truncate group-hover:text-white">
                                {p.title || '(Sin nombre)'}
                              </p>
                              <p className="text-[11px] text-[#DDD5C3]/60 font-mono">
                                {p.district || 'Lima'} • {p.currency === 'USD' ? '$' : 'S/.'} {p.purchasePrice.toLocaleString()}
                              </p>
                            </div>
                            {properties.length > 1 && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (confirm(`¿Eliminar "${p.title}"?`)) {
                                    onDeleteProperty(p.id);
                                  }
                                }}
                                className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 text-[#DDD5C3]/60 transition-opacity"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="border-t border-white/10 pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            onNewProperty();
                            setShowSavedMenu(false);
                          }}
                          className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 bg-[#D8B66D] hover:bg-[#c49f4b] text-[#081827] font-semibold text-xs rounded-lg transition-colors cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>+ Nuevo Inmueble</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Comparar */}
              <button
                type="button"
                onClick={() => setActiveTab(activeTab === 'comparison' ? 'wizard' : 'comparison')}
                className={`px-2.5 py-1 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeTab === 'comparison'
                    ? 'bg-[#D8B66D] text-[#081827] border-[#D8B66D] font-bold'
                    : 'bg-white/5 hover:bg-white/10 border-white/20 text-[#DDD5C3] hover:text-white'
                }`}
                title="Comparar propiedades lado a lado"
              >
                <Scale className="w-3.5 h-3.5" />
                <span>Comparar</span>
              </button>

              {/* Descargar PDF */}
              <button
                type="button"
                onClick={onOpenExport}
                className="px-3 py-1 rounded-lg bg-white/10 hover:bg-[#D8B66D] hover:text-[#081827] text-white border border-white/30 text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                title="Descargar o imprimir reporte ejecutivo en PDF"
              >
                <Download className="w-3.5 h-3.5 text-[#D8B66D] group-hover:text-[#081827]" />
                <span>PDF</span>
              </button>

              {/* Moneda switch */}
              <div className="flex items-center bg-black/30 p-0.5 rounded-lg border border-white/15">
                <button
                  type="button"
                  onClick={() => onCurrencyToggle('PEN')}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold transition-all cursor-pointer ${
                    currentProperty.currency === 'PEN'
                      ? 'bg-[#D8B66D] text-[#081827]'
                      : 'text-[#DDD5C3]/80 hover:text-white'
                  }`}
                >
                  S/. PEN
                </button>
                <button
                  type="button"
                  onClick={() => onCurrencyToggle('USD')}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold transition-all cursor-pointer ${
                    currentProperty.currency === 'USD'
                      ? 'bg-[#D8B66D] text-[#081827]'
                      : 'text-[#DDD5C3]/80 hover:text-white'
                  }`}
                >
                  $ USD
                </button>
              </div>

              {/* Tipo de cambio quick badge */}
              <button
                type="button"
                onClick={() => {
                  setTempTc(currentProperty.exchangeRate.toString());
                  setShowTcModal(true);
                }}
                className="px-2 py-0.5 rounded bg-black/20 hover:bg-black/40 border border-white/15 text-[11px] font-mono text-[#DDD5C3] flex items-center gap-1 cursor-pointer"
                title="Tipo de Cambio editable"
              >
                <span className="text-[#D8B66D]">TC:</span>
                <span>S/. {currentProperty.exchangeRate.toFixed(2)}</span>
                <ArrowLeftRight className="w-2.5 h-2.5 opacity-60" />
              </button>

            </div>

          </div>

        </div>
      </div>

      {/* Tipo de Cambio Modal */}
      {showTcModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-[#081827] border border-[#D8B66D] rounded-2xl p-6 max-w-sm w-full shadow-2xl text-[#F6F4EF] animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-2 mb-3 text-[#D8B66D]">
              <ArrowLeftRight className="w-5 h-5" />
              <h3 className="font-serif-title font-bold text-lg">Tipo de Cambio (USD / PEN)</h3>
            </div>
            <p className="text-xs text-[#DDD5C3] mb-4">
              Ingresa el tipo de cambio bancario o SBS. Se usa para calcular la Alcabala (10 UIT) y equivalencias de moneda.
            </p>
            <div className="mb-5">
              <label className="block text-xs font-semibold text-[#DDD5C3] mb-1 font-mono">
                1 USD = Soles (PEN)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-[#D8B66D] font-mono">
                  S/.
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="2.5"
                  max="6.0"
                  value={tempTc}
                  onChange={(e) => setTempTc(e.target.value)}
                  className="w-full pl-12 pr-4 py-2 bg-white/10 border border-white/20 rounded-xl text-lg font-mono font-bold text-[#F6F4EF] focus:outline-none focus:border-[#D8B66D]"
                  autoFocus
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowTcModal(false)}
                className="px-4 py-2 text-xs font-medium text-[#DDD5C3] hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleTcSave}
                className="px-5 py-2 bg-[#D8B66D] text-[#081827] font-bold text-xs rounded-xl hover:bg-[#c9a656] transition-colors cursor-pointer"
              >
                Actualizar TC
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
